import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignOutButton from '@/components/SignOutButton'

export const dynamic = 'force-dynamic'

function getScores(p) {
  // Prefer quality_before/after (always-present integer columns)
  if (p.quality_before != null && p.quality_after != null) {
    return { original_score: p.quality_before, refined_score: p.quality_after }
  }
  // Fall back to parsing model_used string (post-migration)
  if (!p.model_used) return { original_score: null, refined_score: null }
  const parts = p.model_used.split(' | ')
  const scores = parts[1]?.split('→')
  return {
    original_score: scores?.[0] != null ? parseFloat(scores[0]) : null,
    refined_score: scores?.[1] != null ? parseFloat(scores[1]) : null,
  }
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const { data: prompts } = await supabase
    .from('prompt_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [{ count: todayCount }, { count: totalCount }] = await Promise.all([
    supabase
      .from('prompt_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString()),
    supabase
      .from('prompt_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const plan = profile?.plan ?? 'free'
  const displayName = user.user_metadata?.full_name ?? user.email
  const avatarUrl = user.user_metadata?.avatar_url
  const dailyLimit = 5
  const usedToday = todayCount ?? 0
  const totalPrompts = totalCount ?? 0

  return (
    <div className="wrap">
      <Nav />
      <main className="dashboard-main">
        <div className="dashboard-inner">

          {/* Header */}
          <div className="dashboard-header">
            <div className="dashboard-user">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="dashboard-avatar" />
              ) : (
                <div className="dashboard-avatar dashboard-avatar-fallback">
                  {(displayName?.[0] ?? '?').toUpperCase()}
                </div>
              )}
              <div>
                <div className="section-label">Dashboard</div>
                <h1 className="dashboard-name">{displayName}</h1>
              </div>
            </div>
            <SignOutButton />
          </div>

          {/* Stats */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-label">Plan</div>
              <div className="dashboard-stat" style={{ color: plan === 'pro' ? 'var(--accent)' : undefined }}>
                {plan === 'pro' ? 'Pro ✦' : 'Free'}
              </div>
              {plan === 'free' && (
                <a
                  href="/upgrade"
                  className="btn btn-primary"
                  style={{ fontSize: '13px', alignSelf: 'flex-start', marginTop: '8px' }}
                >
                  Upgrade to Pro →
                </a>
              )}
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-label">Today&apos;s usage</div>
              <div className="dashboard-stat">
                {usedToday}
                {plan === 'free' && (
                  <span style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 400 }}>
                    &nbsp;/&nbsp;{dailyLimit}
                  </span>
                )}
              </div>
              {plan === 'free' && (
                <div className="dashboard-usage-bar-wrap">
                  <div
                    className="dashboard-usage-bar"
                    style={{ width: `${Math.min((usedToday / dailyLimit) * 100, 100)}%` }}
                  />
                </div>
              )}
              {plan === 'free' && usedToday >= dailyLimit && (
                <div style={{ fontSize: '12px', color: 'var(--accent-light)', marginTop: '6px' }}>
                  Limit reached · <a href="/upgrade" style={{ color: 'var(--accent)' }}>Upgrade</a>
                </div>
              )}
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-label">All time forges</div>
              <div className="dashboard-stat">{totalPrompts}</div>
            </div>
          </div>

          {/* Prompt history */}
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>Recent prompts</div>
            {!prompts || prompts.length === 0 ? (
              <div className="dashboard-empty">
                No prompts yet. <a href="/app" style={{ color: 'var(--accent)' }}>Use the forge to get started →</a>
              </div>
            ) : (
              <div className="dashboard-history">
                {prompts.map((p) => {
                  const { original_score, refined_score } = getScores(p)
                  return (
                    <div key={p.id} className="dashboard-prompt-item">
                      <div className="dashboard-prompt-original">{p.original_prompt}</div>
                      {p.enhanced_prompt && (
                        <div className="dashboard-prompt-enhanced">{p.enhanced_prompt}</div>
                      )}
                      <div className="dashboard-prompt-meta">
                        {original_score != null && refined_score != null && (
                          <span>Score: {original_score} → {refined_score}</span>
                        )}
                        <span>{new Date(p.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
