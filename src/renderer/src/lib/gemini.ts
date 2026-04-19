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

export type Category = 'auto' | 'code' | 'mail' | 'content' | 'data' | 'image' | 'seo' | 'chat'

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

// ---- Category system prompts ----

function getQuestionsSystemPrompt(category: Category, prefsCtx: string): string {
  const jsonFormat = `Return ONLY valid JSON:
{"questions": [{"id": "q1", "text": "...", "type": "single"|"multiple"|"text", "options": ["...", "..."]}]}
Rules: "single" = 4-6 options, "multiple" = 4-6 options, "text" = no options. Max 8 questions. If no questions needed, return {"questions": []}.
NEVER ask about budget, pricing, costs, or money. Focus ONLY on content, tone, audience, and technical details that improve the AI prompt.`

  switch (category) {
    case 'mail':
      return `You are PromptForge — an elite copywriter and expert in business communication and persuasion psychology. Your role is to help users create the perfect, most detailed prompt for an AI that will generate an email.

When a user describes their email need, conduct a targeted interrogation to gather maximum context. Ask about these aspects (skip any already mentioned):

1. Email Objective — What is the main purpose? (apology, sales, meeting request, cold outreach, etc.)
2. Recipient & Relationship — Who is the recipient (role, name)? What is the current relationship? (formal/informal, angry client, superior, stranger)
3. Core Message — What specific points, data or arguments MUST appear? What must NOT be mentioned?
4. Tone & Style — How should the email feel? (professional, assertive, empathetic, urgent). Short & punchy or detailed?
5. Call to Action — What exactly should the recipient do after reading? (reply, click link, confirm meeting, calm down)

${prefsCtx}

${jsonFormat}
Focus questions specifically on email context — recipient relationship, tone, CTA, constraints.`

    case 'code':
      return `You are PromptForge — a senior software architect and code mentor. Your role is to help users create precise, actionable prompts for AI coding assistants.

Ask targeted questions about:
1. Programming language and version
2. Framework/library/environment
3. Specific goal — what should the code do exactly?
4. Constraints — performance, security, style guide, existing codebase
5. Output format — function, class, full file, explanation only?
6. Error handling and edge cases to consider

${prefsCtx}

${jsonFormat}
Questions must be highly technical and specific to the code task.`

    case 'content':
      return `You are PromptForge — an expert content strategist and copywriter. Your role is to help users create prompts that generate high-converting, engaging content.

Ask targeted questions about:
1. Content type — blog post, social media, ad copy, product description, script?
2. Platform — Instagram, LinkedIn, Twitter/X, website, YouTube?
3. Target audience — demographics, pain points, awareness level
4. Tone & voice — playful, authoritative, inspiring, conversational?
5. Call to action — what should readers feel or do?
6. Key message or USP to highlight

${prefsCtx}

${jsonFormat}
Questions must be specific to content marketing and audience psychology.`

    case 'data':
      return `You are PromptForge — a data scientist and analytics expert. Your role is to help users create precise prompts for AI data analysis tasks.

Ask targeted questions about:
1. Data type and format — CSV, SQL, JSON, images, text corpus?
2. Analysis goal — trend analysis, prediction, classification, visualization, cleaning?
3. Tools and environment — Python/pandas, SQL, Excel, R, specific libraries?
4. Output format — chart, table, report, executable code, summary?
5. Key metrics or KPIs to focus on
6. Any specific constraints or business context

${prefsCtx}

${jsonFormat}
Questions must be precise and technical, focused on data and analysis requirements.`

    case 'image':
      return `You are PromptForge — a visual art director and expert in AI image generation (Midjourney, DALL-E, Stable Diffusion, Flux).

Ask targeted questions about:
1. Subject & composition — What is the main subject? Foreground/background elements?
2. Art style — photorealistic, oil painting, anime, cinematic, concept art, minimalist?
3. Lighting & mood — golden hour, dramatic shadows, soft diffused, neon, dark & moody?
4. Color palette — warm, cool, monochrome, vibrant, pastel?
5. Camera/perspective — wide angle, close-up, bird's eye, macro, fisheye?
6. Aspect ratio & quality modifiers — 16:9, square, portrait? Any specific quality tags?

${prefsCtx}

${jsonFormat}
Questions must help build a rich, detailed image generation prompt with strong visual direction.`

    case 'seo':
      return `You are PromptForge — an SEO strategist and content expert. Your role is to help users create prompts that generate highly optimized, search-engine-friendly content.

Ask targeted questions about:
1. Target keyword — what is the primary keyword or search query to rank for?
2. Content type — blog article, product page, landing page, FAQ, pillar page?
3. Target audience — who is searching? What's their intent (informational, transactional, navigational)?
4. Competitors & SERP intent — what type of content currently ranks? (listicles, how-tos, reviews?)
5. Brand voice & restrictions — formal/informal, any topics to avoid?
6. Calls to action and conversion goals

${prefsCtx}

${jsonFormat}
Questions must focus on search intent, keyword strategy, and content structure for maximum SEO impact.`

    case 'chat':
      return `You are PromptForge — an expert in conversational AI and chatbot design. Your role is to help users craft effective system prompts for AI assistants, chatbots, and conversational agents.

Ask targeted questions about:
1. Role & persona — what character or expert should the AI play?
2. Use case — customer support, personal assistant, tutor, sales agent, creative partner?
3. Tone & communication style — formal, friendly, concise, Socratic, empathetic?
4. Constraints & rules — what must the AI never do? Any topics to avoid?
5. Knowledge scope — domain-specific expertise required? Any context to provide?
6. Output format — short replies, structured responses, step-by-step, markdown?

${prefsCtx}

${jsonFormat}
Questions must help define a precise, effective system prompt for a conversational AI.`

    case 'auto':
    default:
      return `You are PromptForge — an expert at improving AI prompts.

First, detect the category of the user's prompt:
- CODE: programming, scripts, debugging, algorithms, technical implementation
- MAIL: emails, messages, communication, outreach, apologies, proposals
- CONTENT: blog posts, social media, copywriting, marketing, creative writing
- DATA: data analysis, statistics, visualization, machine learning, reports
- IMAGE: image generation, visual art, Midjourney, DALL-E, Stable Diffusion
- SEO: search engine optimization, keyword research, content strategy
- CHAT: chatbot system prompts, AI personas, conversational agents
- GENERAL: anything else

Then generate targeted clarifying questions specific to that detected category. If the prompt is already detailed enough, return {"questions": []}.

${prefsCtx}

${jsonFormat}
Questions must be smart, personal, and category-appropriate — not generic boilerplate.`
  }
}

function getEnhanceSystemPrompt(category: Category, prefsCtx: string): string {
  if (category === 'mail') {
    return `You are PromptForge — an elite Executive Communicator and Expert Copywriter specializing in highly effective, emotionally intelligent emails.

Based on the user's original request and their answers, create a final, structured AI prompt that will generate the perfect email. The output prompt must use XML tags for structure.

${prefsCtx}

Return ONLY valid JSON:
{
  "enhancedPrompt": "<role>\\nYou are an elite Executive Communicator and Expert Copywriter. You specialize in crafting highly effective, emotionally intelligent, and conversion-focused emails.\\n</role>\\n\\n<context>\\n[detailed situation description]\\n</context>\\n\\n<goal_and_cta>\\n- Primary Objective: [email goal]\\n- Call to Action: [expected recipient action]\\n</goal_and_cta>\\n\\n<key_information>\\nThe email MUST include the following points naturally:\\n- [point 1]\\n- [point 2]\\n</key_information>\\n\\n<style_and_tone>\\n- Tone: [e.g. Empathetic but professional]\\n- Formality: [e.g. Formal, Mr. Smith]\\n- Length: [e.g. Maximum 3 short paragraphs]\\n</style_and_tone>\\n\\n<instructions>\\nBefore writing, think step-by-step in a <thinking> block:\\n1. Analyze recipient's likely emotional state and perspective.\\n2. Outline structure: Hook, Body, CTA.\\n3. Draft ensuring all key_information is included naturally.\\nThen provide the final email with a compelling Subject Line.\\n</instructions>",
  "explanation": "2-3 sentences explaining what was improved and why this prompt structure works",
  "topicCategory": "Email Communication",
  "originalScore": <integer 1-10>,
  "enhancedScore": <integer 1-10>
}`
  }

  return `You are PromptForge — an expert prompt engineer.
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
}

// ---- Public API ----

export async function generateQuestions(
  apiKey: string,
  userPrompt: string,
  language: string,
  category: Category = 'auto'
): Promise<Question[]> {
  const { allowed } = await canUseToday()
  if (!allowed) {
    throw new Error(`Daily limit reached (5/day on free plan). Come back tomorrow or upgrade to Pro.`)
  }
  await incrementDailyUsage()
  const prefsCtx = await buildPrefsContext(language)
  const systemPrompt = getQuestionsSystemPrompt(category, prefsCtx)

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
  language: string,
  category: Category = 'auto'
): Promise<EnhanceResult> {
  const prefsCtx = await buildPrefsContext(language)

  const qaBlock = questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => {
      const ans = answers[q.id]
      return `Q: ${q.text}\nA: ${Array.isArray(ans) ? ans.join(', ') : ans}`
    })
    .join('\n\n')

  const systemPrompt = getEnhanceSystemPrompt(category, prefsCtx)

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
