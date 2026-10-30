import { createHash, randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function unavailable() {
  return Object.assign(new Error('Usage service is unavailable. Please try again later.'), { status: 503 })
}

function check(result) {
  if (result.error) throw unavailable()
  return result
}

async function countEvents(admin, column, value, since) {
  let query = admin.from('usage_events').select('id', { count: 'exact', head: true })
    .eq('kind', 'forge').eq(column, value)
  if (since) query = query.gte('created_at', since)
  return check(await query).count ?? 0
}

// Read-only quota check: questions never insert usage events.
export async function getUsage(request) {
  const { data: { user }, error } = await createClient().auth.getUser()
  if (error && error.name !== 'AuthSessionMissingError') throw unavailable()
  const context = { user, remaining: user ? 5 : 2, admin: null }
  if (!user) {
    const store = cookies()
    const existing = store.get('pf_anon')?.value
    context.anonId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing ?? '')
      ? existing : randomUUID()
    if (context.anonId !== existing) {
      store.set('pf_anon', context.anonId, {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365,
      })
    }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || (!user && !process.env.USAGE_SALT)) {
    if (process.env.NODE_ENV === 'production') throw unavailable()
    console.warn('[usage] Missing service-role configuration or USAGE_SALT; allowing forge in development.')
    return context
  }

  const admin = createAdminClient()
  context.admin = admin
  if (user) {
    const { data: profile } = check(await admin.from('profiles').select('plan').eq('id', user.id).maybeSingle())
    if (profile?.plan === 'pro') return { ...context, remaining: null }
    const dayStart = new Date()
    dayStart.setUTCHours(0, 0, 0, 0)
    const used = await countEvents(admin, 'user_id', user.id, dayStart.toISOString())
    return { ...context, remaining: Math.max(0, 5 - used), code: 'LIMIT_FREE' }
  }

  // The hosting proxy must replace x-forwarded-for with the client's address.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  context.ipHash = createHash('sha256').update(ip + process.env.USAGE_SALT).digest('hex')
  const [cookieUsed, ipUsed] = await Promise.all([
    countEvents(admin, 'anon_id', context.anonId),
    countEvents(admin, 'ip_hash', context.ipHash),
  ])
  return { ...context, remaining: Math.max(0, 2 - Math.max(cookieUsed, ipUsed)), code: 'LIMIT_ANON' }
}

function limitError(code) {
  return Object.assign(new Error(code === 'LIMIT_ANON'
    ? 'Your free tries are used. Sign in for 5 forges per day.'
    : 'Daily limit reached. Upgrade to Pro for unlimited forges.'), {
    status: 403, code, remaining: 0,
  })
}

export async function assertCanForge(request) {
  const usage = await getUsage(request)
  if (usage.remaining === 0) throw limitError(usage.code)
  return usage
}

// Called only after a valid refinement has been generated, never for questions.
export async function recordForge(usage) {
  if (!usage.admin) return usage.remaining
  const { data, error } = await usage.admin.rpc('record_forge', {
    p_user_id: usage.user?.id ?? null,
    p_anon_id: usage.user ? null : usage.anonId,
    p_ip_hash: usage.user ? null : usage.ipHash,
  })
  if (error?.message === 'LIMIT_ANON' || error?.message === 'LIMIT_FREE') {
    throw limitError(error.message)
  }
  if (error) throw unavailable()
  return data
}

export function usageError(error) {
  return { error: error.message, ...(error.code ? { code: error.code, remaining: 0 } : {}) }
}
