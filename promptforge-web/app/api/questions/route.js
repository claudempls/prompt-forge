import { GROQ_MODEL, GROQ_ANON_MODEL, parseModelJson, buildQuestionsSystemPrompt, skipsQuestions } from '@shared/prompts'
import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { assertCanForge, usageError } from '@/lib/usage'

export async function POST(request) {
  const { prompt, mode = 'auto' } = await request.json()

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not configured.' }, { status: 500 })
  }

  let usage
  try {
    usage = await assertCanForge(request)
  } catch (error) {
    return NextResponse.json(usageError(error), { status: error.status || 503 })
  }

  if (skipsQuestions(mode)) return NextResponse.json({ questions: [], remaining: usage.remaining })

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const systemPrompt = buildQuestionsSystemPrompt(mode)

    const completion = await groq.chat.completions.create({
      model: usage.user
        ? (process.env.GROQ_MODEL || GROQ_MODEL)
        : (process.env.GROQ_ANON_MODEL || GROQ_ANON_MODEL),
      reasoning_effort: 'low',
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
    const data = parseModelJson(text)

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error('Invalid response shape from model')
    }

    return NextResponse.json({ ...data, remaining: usage.remaining })
  } catch (e) {
    console.error('questions route error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
