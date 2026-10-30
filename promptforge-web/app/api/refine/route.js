import { buildRefinementSystemPrompt } from '@shared/prompts'
import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const { prompt, questions, answers, mode = 'auto' } = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not configured.' }, { status: 500 })
  }

  // ── Auth + usage check ─────────────────────────────────────────────────────
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.plan !== 'pro') {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('prompt_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', todayStart.toISOString())

      if ((count ?? 0) >= 5) {
        return NextResponse.json({ error: 'Daily limit reached. Upgrade to Pro for unlimited forges.' }, { status: 403 })
      }
    }
  } catch (e) {
    console.error('[refine] auth check error:', e)
    return NextResponse.json({ error: 'Auth error' }, { status: 500 })
  }

  // ── Generate ───────────────────────────────────────────────────────────────
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const qa = questions
      .map((q, i) => `- ${q}\n  → ${answers[i]}`)
      .join('\n')


    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: buildRefinementSystemPrompt(mode),
        },
        {
          role: 'user',
          content: `Original prompt: "${prompt.slice(0, 600)}"${qa ? `\n\nClarifications:\n${qa}` : ''}\n\nWrite a refined, precise version.`,
        },
      ],
    })

    const data = JSON.parse(completion.choices[0].message.content.trim())
    return NextResponse.json(data)
  } catch (e) {
    console.error('[refine] generation error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
