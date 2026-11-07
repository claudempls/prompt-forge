import { GROQ_MODEL, GROQ_ANON_MODEL, parseModelJson, buildRefinementSystemPrompt } from '@shared/prompts'
import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { assertCanForge, recordForge, usageError } from '@/lib/usage'

export async function POST(request) {
  const { prompt, questions = [], answers = [], mode = 'auto' } = await request.json()

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

  // ── Generate ───────────────────────────────────────────────────────────────
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const qa = questions
      .map((q, i) => `- ${q}\n  → ${answers[i]}`)
      .join('\n')


    const completion = await groq.chat.completions.create({
      model: usage.user
        ? (process.env.GROQ_MODEL || GROQ_MODEL)
        : (process.env.GROQ_ANON_MODEL || GROQ_ANON_MODEL),
      reasoning_effort: 'low',
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

    const data = parseModelJson(completion.choices[0].message.content)
    if (typeof data.refined !== 'string' || !data.refined.trim()) throw new Error('Invalid response shape from model')
    const remaining = await recordForge(usage)
    return NextResponse.json({ ...data, remaining })
  } catch (e) {
    console.error('[refine] generation error:', e)
    return NextResponse.json(usageError(e), { status: e.status || 500 })
  }
}
