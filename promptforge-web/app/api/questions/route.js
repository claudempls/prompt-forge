import { buildQuestionsSystemPrompt, skipsQuestions } from '@shared/prompts'
import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const { prompt, mode = 'auto' } = await request.json()

  if (!prompt?.trim()) {
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
    console.error('[questions] auth check error:', e)
    return NextResponse.json({ error: 'Auth error' }, { status: 500 })
  }

  if (skipsQuestions(mode)) return NextResponse.json({ questions: [] })

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const systemPrompt = buildQuestionsSystemPrompt(mode)

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Prompt: "${prompt.slice(0, 600)}"\n\nGenerate clarifying questions specific to this exact prompt.`,
        },
      ],
    })

    const text = completion.choices[0].message.content.trim()
    const data = JSON.parse(text)

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error('Invalid response shape from model')
    }

    return NextResponse.json(data)
  } catch (e) {
    console.error('questions route error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
