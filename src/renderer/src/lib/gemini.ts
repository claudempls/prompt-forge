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

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

async function groq(apiKey: string, systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
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
  const prefs = await getPreferences()
  if (prefs.sessions.length === 0) return `Respond in language: ${language}.`
  const tagLines = Object.entries(prefs.tags)
    .map(([k, v]) => `  - ${k}: ${v.join(', ')}`)
    .join('\n')
  return `USER PREFERENCES (learned from past sessions):\n${tagLines || '  (none yet)'}\nRespond in language: ${language}.`
}

export async function generateQuestions(
  apiKey: string,
  userPrompt: string,
  language: string
): Promise<Question[]> {
  const { allowed, remaining } = await canUseToday()
  if (!allowed) {
    throw new Error(`Daily limit reached (${5}/day on free plan). Come back tomorrow or upgrade to Pro.`)
  }
  await incrementDailyUsage()
  const prefsCtx = await buildPrefsContext(language)

  const systemPrompt = `You are PromptForge, an expert at improving AI prompts.
Analyze the user's prompt. If it is already specific and detailed enough, return {"questions": []}.
Otherwise generate up to 8 smart, personal clarifying questions tailored to this prompt.
${prefsCtx}

Return ONLY valid JSON in this exact format:
{"questions": [{"id": "q1", "text": "...", "type": "single"|"multiple"|"text", "options": ["...", "..."]}]}

Rules:
- For "single": 4-6 specific options relevant to THIS prompt
- For "multiple": 4-6 options
- For "text": no options field
- Maximum 8 questions
- Questions must feel personal and smart, not boilerplate`

  const raw = await groq(apiKey, systemPrompt, `User's prompt:\n"${userPrompt}"`)
  try {
    const parsed = JSON.parse(raw) as { questions: Question[] }
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
  language: string
): Promise<EnhanceResult> {
  const prefsCtx = await buildPrefsContext(language)

  const qaBlock = questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => {
      const ans = answers[q.id]
      return `Q: ${q.text}\nA: ${Array.isArray(ans) ? ans.join(', ') : ans}`
    })
    .join('\n\n')

  const systemPrompt = `You are PromptForge, an expert prompt engineer.
Given the user's original prompt and their clarifying answers, produce an improved prompt.
${prefsCtx}

Return ONLY valid JSON:
{
  "enhancedPrompt": "...",
  "explanation": "2-3 sentence explanation of what you improved",
  "topicCategory": "e.g. Web Development, Copywriting, Data Analysis",
  "originalScore": <integer 1-10>,
  "enhancedScore": <integer 1-10>
}`

  const raw = await groq(apiKey, systemPrompt, `Original prompt:\n"${originalPrompt}"\n\nClarifying answers:\n${qaBlock}`)
  try {
    return JSON.parse(raw) as EnhanceResult
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

  const systemPrompt = `From this Q&A session (topic: ${topicCategory}), extract reusable user preferences as JSON.
Keys = preference categories (e.g. "design_style", "tone", "complexity"), values = string arrays.
Only extract genuine preferences useful in future sessions.
Return ONLY valid JSON like: {"tone": ["professional"], "style": ["minimal"]}. If nothing worth saving, return {}.`

  const raw = await groq(apiKey, systemPrompt, `Q&A:\n${qaBlock}`)
  try { return JSON.parse(raw) as Record<string, string[]> } catch { return {} }
}
