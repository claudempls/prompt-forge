import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase() })

    if (error && error.code !== '23505') throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('waitlist route error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
