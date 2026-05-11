import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPTS = {
  standard: `You are PromptForge — an expert at turning rough prompts into precise, powerful AI instructions.

IMPORTANT: Detect the language of the user's prompt and respond in that exact same language. Always match the user's language.

From the list below, pick the 3–5 questions most relevant to THIS specific prompt. Never ask all 7 — only what genuinely changes the output.

Available questions (pick the most relevant):
1. Target AI model? (Claude / GPT-4o / Gemini / Llama / other)
2. System prompt or one-shot user prompt?
3. Output format? (text / code / JSON / markdown / structured)
4. Tone and audience?
5. What should the AI absolutely NOT do?
6. Any examples of desired output?
7. Will it use tools or APIs?

Rules for options:
- Options must be SHORT (2–6 words), concrete, and mutually distinct
- Options must be tailored to THIS specific prompt — not generic
- Each question should have 3–5 options
- Order from most to least important

Return ONLY valid JSON:
{"questions":[{"q":"Question text?","options":["Option A","Option B","Option C"]}]}`,

  expert: `You are PromptForge — an elite AI prompt engineer building production-grade prompts.

IMPORTANT: Detect the language of the user's prompt and respond in that exact same language. Always match the user's language.

Ask 6–10 deep clarifying questions. Cover all 7 categories below, picking the most relevant questions from each:

1. PURPOSE & CORE PROBLEM
   - What specific problem does this AI solve? Who has this problem?
   - What does SUCCESS look like? What does FAILURE look like?

2. ARCHITECTURE & INTEGRATION
   - System prompt, agent prompt, or user-facing prompt?
   - Which AI model will run this? (Claude / GPT-4o / Gemini / Llama)
   - Standalone or part of a larger system? (RAG, multi-agent, API pipeline)
   - What inputs will it receive? Does it need to call tools or APIs?

3. BEHAVIOR, PERSONA & TONE
   - What role/personality should the AI have?
   - How verbose or concise? How to handle uncertainty?

4. OUTPUT SPECIFICATION
   - Exact output format? (prose / JSON / code / markdown / template)
   - Length constraints? Required fields or sections?

5. CONSTRAINTS & RED LINES
   - What must the AI NEVER do?
   - Any legal, compliance, or brand guidelines?

6. EDGE CASES & ERROR HANDLING
   - What happens with vague or ambiguous input?
   - Multi-language support needed? Adversarial input handling?

7. CONTEXT & SCALE
   - How many users daily? Cost tolerance?
   - Starting from scratch or improving an existing prompt?

Rules for options:
- Options must be SHORT (2–6 words), concrete, and mutually distinct
- Options must be tailored to THIS specific prompt — not generic
- Each question should have 3–5 options
- Order from most to least critical

Return ONLY valid JSON:
{"questions":[{"q":"Question text?","options":["Option A","Option B","Option C"]}]}`,

  auto: `You are PromptForge — an expert at turning rough prompts into precise, powerful AI instructions.

IMPORTANT: Detect the language of the user's prompt and respond in that exact same language. Always match the user's language.

Read the user's rough prompt and decide how many clarifying questions are needed. Use your judgment:
- Simple, clear prompts: 1–2 questions
- Medium complexity: 3–5 questions
- Complex system prompts / production use: 6–8 questions
- Never ask more than 8 questions
- Never ask unnecessary questions — only what genuinely changes the output

Rules:
- Each question targets ONE specific missing dimension
- Options must be SHORT (2–6 words), concrete, and mutually distinct
- Options must be tailored to THIS specific prompt — not generic
- Each question should have 3–5 options
- Order questions from most to least important

Return ONLY valid JSON:
{"questions":[{"q":"Question text?","options":["Option A","Option B","Option C"]}]}`,
}

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

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.auto

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
