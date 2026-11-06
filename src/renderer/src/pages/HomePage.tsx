
import { useState, useEffect, useRef } from 'react'
import type { AppState } from '../App'
import type { Category, Mode } from '../lib/groq'
import { generateQuestions, enhancePrompt } from '../lib/groq'
import { useT, detectLanguage } from '../lib/i18n'
import { setLanguage } from '../lib/store'

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
}

const EXAMPLES = [
  'Make me a landing page for my SaaS startup',
  'Write a cover letter for a product designer role',
  'Create a Python script to analyze sales data',
  'Write a social media post about my new product launch'
]

export default function HomePage({ state, update }: Props) {
  const t = useT(state.language)
  const [prompt, setPrompt] = useState(state.originalPrompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedLang, setDetectedLang] = useState<string | null>(null)
  const detectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedCategory = state.category ?? 'auto'
  const selectedMode = state.mode ?? 'standard'

  // Auto-detect language as user types
  useEffect(() => {
    if (detectTimer.current) clearTimeout(detectTimer.current)
    detectTimer.current = setTimeout(() => {
      const lang = detectLanguage(prompt)
      if (lang && lang !== state.language) {
        setDetectedLang(lang)
        update({ language: lang })
        setLanguage(lang)
        window.electron.store.set('language', lang)
      } else if (!lang) {
        setDetectedLang(null)
      }
    }, 600)
    return () => { if (detectTimer.current) clearTimeout(detectTimer.current) }
  }, [prompt])

  const CATEGORIES: { id: Category; label: string; icon: string }[] = [
    { id: 'auto',    label: t.catAuto,    icon: '✦' },
    { id: 'code',    label: t.catCode,    icon: '{ }' },
    { id: 'mail',    label: t.catMail,    icon: '✉' },
    { id: 'content', label: t.catContent, icon: '✍' },
    { id: 'data',    label: t.catData,    icon: '◫' },
    { id: 'image',   label: t.catImage,   icon: '⬡' },
    { id: 'seo',     label: t.catSeo,     icon: '↑' },
    { id: 'chat',    label: t.catChat,    icon: '◎' },
  ]

  const MODES: { id: Mode; label: string; desc: string }[] = [
    { id: 'lite',     label: t.modeLite,     desc: t.modeLiteDesc },
    { id: 'standard', label: t.modeStandard, desc: t.modeStandardDesc },
    { id: 'expert',   label: t.modeExpert,   desc: t.modeExpertDesc },
    { id: 'compact',  label: t.modeCompact,  desc: t.modeCompactDesc },
  ]

  async function handleStart() {
    const trimmed = prompt.trim()
    if (!trimmed) { setError(t.homeWriteFirst); return }
    setError('')
    setLoading(true)
    try {
      const questions = await generateQuestions(state.apiKey, trimmed, state.language, selectedCategory, selectedMode)

      if (questions.length === 0) {
        // Lite/Compact mode or prompt needs no clarification — enhance directly
        const result = await enhancePrompt(state.apiKey, trimmed, [], {}, state.language, selectedCategory, selectedMode)
        update({ forgeScreen: 'result', originalPrompt: trimmed, questions: [], answers: {}, result })
      } else {
        update({ forgeScreen: 'questions', originalPrompt: trimmed, questions, answers: {} })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Title bar — draggable */}
      <div className="drag-region h-10 flex-shrink-0 flex items-center px-5 border-b border-forge-border">
        <span className="no-drag ml-14 font-display text-base font-semibold text-forge-text/80 tracking-wide">
          PromptForge
        </span>
        <div className="flex-1" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-5xl font-semibold text-forge-text tracking-tight leading-tight">
            {t.homeTitle}
          </h2>
          <p className="text-forge-muted text-sm max-w-sm leading-relaxed">
            {t.homeSubtitle}
          </p>
        </div>

        {/* Category selector */}
        <div className="w-full max-w-lg flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => update({ category: cat.id })}
                className={`no-drag flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-forge-accent/15 border-forge-accent/50 text-forge-accent'
                    : 'bg-forge-surface border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-border-hi'
                }`}
              >
                <span className="text-[11px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mode selector */}
          <div className="flex items-center justify-center gap-1.5">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => update({ mode: m.id })}
                title={m.desc}
                className={`no-drag flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  selectedMode === m.id
                    ? 'bg-forge-accent/15 border-forge-accent/50 text-forge-accent'
                    : 'bg-forge-surface border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-border-hi'
                }`}
              >
                {m.id === 'lite' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v2M5 7v2M1 5h2M7 5h2M2.5 2.5l1.5 1.5M6 6l1.5 1.5M2.5 7.5L4 6M6 4l1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
                {m.id === 'standard' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
                {m.id === 'expert' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1.5l1 2.5 2.5.5-1.8 1.8.5 2.7L5 7.8 2.8 9l.5-2.7L1.5 4.5 4 4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
                  </svg>
                )}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input card */}
        <div className="w-full max-w-lg rounded-2xl border border-forge-border bg-forge-surface shadow-card focus-within:border-forge-accent/50 transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.homePlaceholder}
            className="no-drag w-full bg-transparent text-forge-text text-sm px-4 pt-4 pb-2 placeholder:text-forge-muted focus:outline-none min-h-[100px] leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleStart()
            }}
          />
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <span className="text-xs text-forge-muted/70 flex items-center gap-1.5">
              {detectedLang ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-forge-accent/70 animate-pulse" />
                  <span className="text-forge-accent/70">{detectedLang}</span>
                </>
              ) : (
                prompt.length > 0 ? `${prompt.length} chars` : t.homeShortcut
              )}
            </span>
            <button
              onClick={handleStart}
              disabled={loading}
              className="no-drag flex items-center gap-2 px-5 py-2 bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-forge-accent/20"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.homeAnalyzing}
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M8 3l3 3.5-3 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t.homeImprove}
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400/90 text-xs bg-red-500/8 border border-red-500/15 px-4 py-2 rounded-xl max-w-lg text-center">
            {error}
          </p>
        )}

        {/* Example chips */}
        {!loading && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-forge-muted/60">{t.homeTryExample}</p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-lg">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-xs px-3.5 py-2 bg-forge-surface border border-forge-border rounded-full text-forge-muted hover:text-forge-text hover:border-forge-accent/30 hover:bg-forge-accent/5 transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}