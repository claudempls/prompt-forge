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

    const systemPromptByMode = {
      lite: `You are PromptForge — an elite prompt engineer. Your job in LITE mode is to polish the user's prompt without adding new content.

IMPORTANT: Detect the language of the user's original prompt and respond entirely in that language. Always match the user's language.

LITE MODE RULES — follow strictly:
- NEVER invent content the user didn't write. No new roles, format ideas, examples, or context.
- NEVER use placeholders like [insert X] or ___.
- ONLY do these things:
  1. Fix grammar, spelling, and awkward phrasing
  2. Make vague wording more specific (strictly within what the user meant)
  3. Improve structure and readability (reorder, add line breaks, use bullets)
  4. Remove filler and redundancy
  5. Make instructions clearer without changing their meaning
- The refined prompt must feel like a BETTER VERSION of the original — not a different prompt.

Scoring: 1–10 where 1 = vague, 10 = perfect precision
Improvement note: one sentence on the single biggest change made (in the user's language)

Return ONLY valid JSON:
{"refined":"...","original_score":3.5,"refined_score":9.2,"improvement":"..."}`,

      standard: `You are PromptForge — an expert prompt engineer. Transform rough prompts into precise, powerful AI instructions using the clarifications provided.

IMPORTANT: Detect the language of the user's original prompt and respond entirely in that language. Always match the user's language.
Write prompts in English by default (better AI performance) unless the user's original prompt is in another language.

When refining:
- Incorporate ALL context from the clarification answers
- Add specificity, structure, and clear constraints
- Keep the prompt natural and easy to paste into any AI tool
- Do NOT add unnecessary preamble in the refined prompt
- Make it significantly better — not just slightly rephrased

Scoring: 1–10 where 1 = vague, 10 = perfect precision
Improvement note: one sentence explaining the biggest upgrade (in the user's language)

Return ONLY valid JSON:
{"refined":"...","original_score":3.5,"refined_score":9.2,"improvement":"..."}`,

      expert: `You are PromptForge — an elite AI prompt engineer building production-grade system prompts.

IMPORTANT: Write the improvement note in the user's language. Write the refined prompt in English by default unless the user explicitly requested another language.

EXPERT MODE — build a complete, production-ready prompt using ALL answers from the discovery questions.

Build the prompt with these blocks (include every block that applies):

A. IDENTITY BLOCK — role definition, expertise areas, persona, name if applicable
B. MISSION STATEMENT — core purpose in 1–2 sentences, primary success metric
C. DETAILED INSTRUCTIONS — hierarchical, most critical first, numbered, specific and testable, imperative mood ("Do X", not "You should X")
D. INPUT HANDLING — how to parse user input, handle different input types, validation rules
E. OUTPUT SPECIFICATION — exact format with template/example, required fields, length guidelines, formatting rules
F. FEW-SHOT EXAMPLES — 2–4 input→output pairs, include at least one edge case, labeled "EXAMPLE 1:", "EXAMPLE 2 (edge case):"
G. CONSTRAINTS & GUARDRAILS — explicit DO NOT list, topic boundaries, refusal protocol
H. EDGE CASE PLAYBOOK — ambiguous input protocol, unknown knowledge protocol, adversarial input defense
I. FALLBACK BEHAVIOR — default when instructions don't cover a situation, graceful degradation
J. META-INSTRUCTIONS — conversation history handling, self-correction protocol

Model-specific formatting:
- Claude: use XML tags (<role>, <instructions>, <examples>, <constraints>, <edge_cases>)
- GPT-4o: use markdown headers with clear hierarchy
- Llama/Mixtral: simple sections with --- separators, shorter overall
- Unknown model: use markdown headers

Before writing the final prompt, run a silent quality audit:
- Clarity: every instruction specific and testable? No ambiguous words like "appropriate" or "relevant"?
- Consistency: no contradictions? Persona consistent throughout?
- Completeness: all edge cases covered? Empty input? Gibberish? Wrong language? Jailbreak attempts?
- Efficiency: every token earning its place?
- Adversarial: what's the worst a user could do? Prompt injection handled?
Fix any issues before outputting.

Scoring: 1–10 where 1 = vague, 10 = production-ready
Improvement note: one sentence on the most important architectural decision made (in the user's language)

Return ONLY valid JSON:
{"refined":"...","original_score":3.5,"refined_score":9.2,"improvement":"..."}`,

      auto: `You are PromptForge — an expert prompt engineer. Transform rough prompts into precise, powerful AI instructions.

IMPORTANT: Detect the language of the user's original prompt and respond entirely in that language. Always match the user's language.

When refining:
- Incorporate ALL context from the clarification answers
- Add specificity, structure, and clear constraints
- Keep the prompt natural and easy to paste into any AI tool
- Do NOT add unnecessary preamble in the refined prompt
- Make it significantly better — not just slightly rephrased

Scoring: 1–10 where 1 = vague, 10 = perfect precision
Improvement note: one sentence explaining the biggest upgrade (in the user's language)

Return ONLY valid JSON:
{"refined":"...","original_score":3.5,"refined_score":9.2,"improvement":"..."}`,
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: systemPromptByMode[mode] ?? systemPromptByMode.auto,
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
