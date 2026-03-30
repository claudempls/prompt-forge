import { GoogleGenerativeAI } from '@google/generative-ai'
import { getPreferences } from './store'

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
  originalScore: number   // 1-10, how good the original was
  enhancedScore: number   // 1-10, how good the enhanced is
}

async function buildPrefsContext(language: string): Promise<string> {
  const prefs = await getPreferences()
  if (prefs.sessions.length === 0) return `\nRespond in language: ${language}.`
  const tagLines = Object.entries(prefs.tags)
    .map(([k, v]) => `  - ${k}: ${v.join(', ')}`)
    .join('\n')
  return `\n\nUSER PREFERENCES (learned from past sessions):\n${tagLines || '  (none yet)'}\nRespond in language: ${language}.`
}

export async function generateQuestions(
  apiKey: string,
  userPrompt: string,
  language: string
): Promise<Question[]> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prefsCtx = await buildPrefsContext(language)

  const systemPrompt = `You are PromptForge, an expert at improving AI prompts.
Analyze the user's prompt. If it is already specific and detailed enough to improve without any clarification, return an empty array: []
Otherwise, generate up to 8 smart, PERSONAL clarifying questions — tailored specifically to this prompt, not generic.
Only ask questions that will genuinely make the result significantly better.
${prefsCtx}

RULES:
- Output ONLY a valid JSON array (no markdown, no explanation outside JSON)
- If no questions needed → return exactly: []
- Each question object: { "id": "q1", "text": "...", "type": "single"|"multiple"|"text", "options": ["...", "..."] }
- For "single": 4-6 specific options relevant to THIS prompt
- For "multiple": 4-6 options
- For "text": no options (open answer)
- Maximum 8 questions
- Questions must feel personal and smart, not boilerplate
- Respond in language: ${language}`

  const result = await model.generateContent([systemPrompt, `\n\nUser's prompt:\n"${userPrompt}"`])
  const raw = result.response.text().trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  try {
    return JSON.parse(raw) as Question[]
  } catch {
    throw new Error('Gemini returned invalid JSON for questions.')
  }
}

export async function enhancePrompt(
  apiKey: string,
  originalPrompt: string,
  questions: Question[],
  answers: Record<string, string | string[]>,
  language: string
): Promise<EnhanceResult> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
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

Output ONLY valid JSON (no markdown):
{
  "enhancedPrompt": "...",
  "explanation": "2-3 sentence explanation of what you improved",
  "topicCategory": "e.g. Web Development, Copywriting, Data Analysis",
  "originalScore": <integer 1-10 rating of original prompt quality>,
  "enhancedScore": <integer 1-10 rating of enhanced prompt quality>
}

Respond in language: ${language}`

  const result = await model.generateContent([systemPrompt, `\n\nOriginal prompt:\n"${originalPrompt}"\n\nClarifying answers:\n${qaBlock}`])
  const raw = result.response.text().trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  try {
    return JSON.parse(raw) as EnhanceResult
  } catch {
    throw new Error('Gemini returned invalid JSON for enhancement.')
  }
}

export async function extractPreferenceTags(
  apiKey: string,
  questions: Question[],
  answers: Record<string, string | string[]>,
  topicCategory: string
): Promise<Record<string, string[]>> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const qaBlock = questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => `${q.text}: ${Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).join(', ') : answers[q.id]}`)
    .join('\n')

  const prompt = `From this Q&A session (topic: ${topicCategory}), extract reusable user preferences as JSON.
Keys = preference categories (e.g. "design_style", "tone", "complexity"), values = string arrays.
Only extract genuine preferences useful in future sessions.
Output ONLY valid JSON. If nothing worth saving, output {}.

Q&A:\n${qaBlock}`

  const result = await model.generateContent(prompt)
  const raw = result.response.text().trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  try { return JSON.parse(raw) as Record<string, string[]> } catch { return {} }
}
