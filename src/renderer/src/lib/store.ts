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
  const key = await getApiKey()
  return !!key
}
