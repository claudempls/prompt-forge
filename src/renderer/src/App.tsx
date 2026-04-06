import { useState, useEffect } from 'react'
import SetupPage from './pages/SetupPage'
import HomePage from './pages/HomePage'
import QuestionsPage from './pages/QuestionsPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import PersonalizationPage from './pages/PersonalizationPage'
import SettingsPage from './pages/SettingsPage'
import Sidebar from './components/Sidebar'
import { isSetupDone, getLanguage, getApiKey } from './lib/store'
import type { Question, EnhanceResult } from './lib/gemini'

export type NavTab = 'forge' | 'history' | 'personalization' | 'settings'
export type ForgeScreen = 'home' | 'questions' | 'result'

export interface AppState {
  apiKey: string
  language: string
  provider: string
  originalPrompt: string
  questions: Question[]
  answers: Record<string, string | string[]>
  result: EnhanceResult | null
  forgeScreen: ForgeScreen
}

export default function App() {
  const [tab, setTab] = useState<NavTab>('forge')
  const [setup, setSetup] = useState<boolean | null>(null)
  const [state, setState] = useState<AppState>({
    apiKey: '',
    language: 'English',
    provider: 'groq',
    originalPrompt: '',
    questions: [],
    answers: {},
    result: null,
    forgeScreen: 'home'
  })

  useEffect(() => {
    async function init() {
      const done = await isSetupDone()
      const lang = await getLanguage()
      const key = await getApiKey()
      const provider = (await window.electron.store.get('provider') as string) ?? 'groq'
      setState((s) => ({ ...s, language: lang, apiKey: key ?? '', provider }))
      setSetup(done)
    }
    init()
  }, [])

  const update = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }))

  // Still loading
  if (setup === null) {
    return (
      <div className="app-content flex items-center justify-center h-full">
        <div className="w-5 h-5 rounded-full border-2 border-forge-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  // First-time setup (no sidebar)
  if (!setup) {
    return (
      <div className="app-content h-full">
        <SetupPage state={state} update={update} onDone={() => setSetup(true)} />
      </div>
    )
  }

  return (
    <div className="app-content flex h-full">
      <Sidebar active={tab} onChange={setTab} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Per-tab content */}
        {tab === 'forge' && state.forgeScreen === 'home'      && <HomePage      state={state} update={update} />}
        {tab === 'forge' && state.forgeScreen === 'questions' && <QuestionsPage state={state} update={update} />}
        {tab === 'forge' && state.forgeScreen === 'result'    && <ResultPage    state={state} update={update} />}
        {tab === 'history'         && <HistoryPage />}
        {tab === 'personalization' && <PersonalizationPage />}
        {tab === 'settings'        && <SettingsPage state={state} update={update} onLogout={() => setSetup(false)} />}
      </main>
    </div>
  )
}
