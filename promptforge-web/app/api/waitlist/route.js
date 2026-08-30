import { createClient } from '@/lib/supabase/server'
import { sendWaitlistConfirmation } from '@/lib/email/waitlist-confirmation'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email: normalizedEmail })

    if (error && error.code !== '23505') throw error

    try {
      const emailResult = await sendWaitlistConfirmation(normalizedEmail)
      return NextResponse.json({
        ok: true,
        email_sent: !emailResult.skipped,
        email_skipped_reason: emailResult.skipped ? emailResult.reason : undefined,
      })
    } catch (emailError) {
      console.error('waitlist confirmation email error:', emailError)
      return NextResponse.json({
        ok: true,
        email_sent: false,
        email_error: 'Waitlist signup saved, but confirmation email failed.',
      })
    }
  } catch (e) {
    console.error('waitlist route error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
