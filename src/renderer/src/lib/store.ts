export const store = {
  get: async <T>(key: string): Promise<T | null> => {
    return (await window.electron.store.get(key)) as T | null
  },
  set: async (key: string, value: unknown): Promise<void> => {
    await window.electron.store.set(key, value)
  },
  all: async (): Promise<Record<string, unknown>> => {
    return await window.electron.store.all()
  }
}

export interface UserPreferences {
  tags: Record<string, string[]>
  sessions: SessionSummary[]
}

export interface SessionSummary {
  id: string
  date: string
  originalPrompt: string
  enhancedPrompt: string
  topicCategory: string
  originalScore: number
  enhancedScore: number
  keyAnswers: { question: string; answer: string }[]
}

export const FREE_DAILY_LIMIT = 5

interface DailyUsage {
  date: string
  count: number
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function getDailyUsage(): Promise<DailyUsage> {
  const usage = await store.get<DailyUsage>('dailyUsage')
  const today = todayStr()
  if (!usage || usage.date !== today) return { date: today, count: 0 }
  return usage
}

export async function incrementDailyUsage(): Promise<void> {
  const usage = await getDailyUsage()
  await store.set('dailyUsage', { date: usage.date, count: usage.count + 1 })
}

export async function canUseToday(): Promise<{ allowed: boolean; remaining: number }> {
  const plan = (await store.get<string>('plan')) ?? 'free'
  if (plan === 'pro') return { allowed: true, remaining: Infinity }
  const usage = await getDailyUsage()
  const remaining = Math.max(0, FREE_DAILY_LIMIT - usage.count)
  return { allowed: remaining > 0, remaining }
}

export async function getPreferences(): Promise<UserPreferences> {
  const prefs = await store.get<UserPreferences>('preferences')
  return prefs ?? { tags: {}, sessions: [] }
}

export async function getApiKey(): Promise<string | null> {
  return store.get<string>('apiKey')
}

export async function setApiKey(key: string): Promise<void> {
  return store.set('apiKey', key)
}

export async function getLanguage(): Promise<string> {
  return (await store.get<string>('language')) ?? 'English'
}

export async function setLanguage(lang: string): Promise<void> {
  return store.set('language', lang)
}

export async function isSetupDone(): Promise<boolean> {
  const plan = await store.get<string>('plan')
  return !!plan
}
