import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { original_prompt, refined_prompt, original_score, refined_score, improvement_note } = await request.json()

    const { error } = await supabase.from('prompt_history').insert({
      user_id: user.id,
      original_prompt,
      enhanced_prompt: refined_prompt,
      model_used: `groq/llama-3.3-70b-versatile | ${original_score}→${refined_score} | ${improvement_note ?? ''}`,
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('history route error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
