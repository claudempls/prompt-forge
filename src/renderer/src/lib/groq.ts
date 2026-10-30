import { GROQ_MODEL, parseModelJson, buildQuestionsSystemPrompt, buildRefinementSystemPrompt, buildPreferencesContext, buildPreferenceTagsSystemPrompt, skipsQuestions } from '@shared/prompts'
import { getPreferences, canUseToday, incrementDailyUsage } from './store'

export interface Question {
  id: string
  text: string
  type: 'single' | 'multiple' | 'text'
  options?: string[]
}

export interface EnhanceResult {
  enhancedPrompt: string
  explanation: string
  topicCategory: string
  originalScore: number
  enhancedScore: number
}

import type { Category, Mode } from '@shared/prompts'
export type { Category, Mode } from '@shared/prompts'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function groq(apiKey: string, systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      reasoning_effort: 'low',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `Groq error ${res.status}`)
  }
  const data = await res.json() as { choices: { message: { content: string } }[] }
  return data.choices[0].message.content.trim()
}

async function buildPrefsContext(language: string): Promise<string> {
  return buildPreferencesContext(language, await getPreferences())
}

// ---- Public API ----

export async function generateQuestions(
  apiKey: string,
  userPrompt: string,
  language: string,
  category: Category = 'auto',
  mode: Mode = 'standard'
): Promise<Question[]> {
  // Lite and Compact skip questions; usage is counted in enhancePrompt.
  if (skipsQuestions(mode)) return []

  const { allowed } = await canUseToday()
  if (!allowed) {
    throw new Error(`Daily limit reached (5/day on free plan). Come back tomorrow or upgrade to Pro.`)
  }
  await incrementDailyUsage()
  const prefsCtx = await buildPrefsContext(language)
  const systemPrompt = buildQuestionsSystemPrompt(mode, { desktop: true, category, preferencesContext: prefsCtx })

  const raw = await groq(apiKey, systemPrompt, `User's prompt:\n"${userPrompt}"`)
  try {
    const parsed = parseModelJson(raw) as { questions: Question[] }
    return parsed.questions ?? []
  } catch {
    throw new Error('Invalid response from Groq for questions.')
  }
}

export async function enhancePrompt(
  apiKey: string,
  originalPrompt: string,
  questions: Question[],
  answers: Record<string, string | string[]>,
  language: string,
  category: Category = 'auto',
  mode: Mode = 'standard'
): Promise<EnhanceResult> {
  // Count usage here for modes that skip question generation.
  if (skipsQuestions(mode)) {
    const { allowed } = await canUseToday()
    if (!allowed) {
      throw new Error(`Daily limit reached (5/day on free plan). Come back tomorrow or upgrade to Pro.`)
    }
    await incrementDailyUsage()
  }

  const prefsCtx = await buildPrefsContext(language)
  const systemPrompt = buildRefinementSystemPrompt(mode, { desktop: true, preferencesContext: prefsCtx })

  const qaBlock = questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => {
      const ans = answers[q.id]
      return `Q: ${q.text}\nA: ${Array.isArray(ans) ? ans.join(', ') : ans}`
    })
    .join('\n\n')

  const categoryHint = category !== 'auto' ? `\nCategory context: ${category}` : ''
  const userMessage = qaBlock
    ? `Original prompt:\n"${originalPrompt}"${categoryHint}\n\nClarifying answers:\n${qaBlock}`
    : `Original prompt:\n"${originalPrompt}"${categoryHint}`

  const raw = await groq(apiKey, systemPrompt, userMessage)
  try {
    return parseModelJson(raw) as EnhanceResult
  } catch {
    throw new Error('Invalid response from Groq for enhancement.')
  }
}

export async function extractPreferenceTags(
  apiKey: string,
  questions: Question[],
  answers: Record<string, string | string[]>,
  topicCategory: string
): Promise<Record<string, string[]>> {
  const qaBlock = questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => `${q.text}: ${Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).join(', ') : answers[q.id]}`)
    .join('\n')

  if (!qaBlock) return {}

  const systemPrompt = buildPreferenceTagsSystemPrompt(topicCategory)

  const raw = await groq(apiKey, systemPrompt, `Q&A:\n${qaBlock}`)
  try { return parseModelJson(raw) as Record<string, string[]> } catch { return {} }
}