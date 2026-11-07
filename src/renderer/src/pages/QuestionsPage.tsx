import { useState, useEffect, useCallback } from 'react'
import type { AppState } from '../App'
import { enhancePrompt, extractPreferenceTags } from '../lib/groq'
import { getPreferences, setLanguage, store } from '../lib/store'
import type { UserPreferences } from '../lib/store'
import { useT } from '../lib/i18n'

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
}

export default function QuestionsPage({ state, update }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [textInputs, setTextInputs] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = useT(state.language)
  const { questions, originalPrompt, apiKey, language, category, mode } = state
  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const answer = answers[current?.id]

  function toggleSingle(qId: string, option: string) {
    setAnswers((a) => ({ ...a, [qId]: option }))
  }

  function toggleMultiple(qId: string, option: string) {
    setAnswers((a) => {
      const current = (a[qId] as string[]) ?? []
      const exists = current.includes(option)
      return { ...a, [qId]: exists ? current.filter((x) => x !== option) : [...current, option] }
    })
  }

  function setTextAnswer(qId: string, val: string) {
    setTextInputs((t) => ({ ...t, [qId]: val }))
    setAnswers((a) => ({ ...a, [qId]: val }))
  }

  function goNext() {
    if (isLast) {
      handleEnhance()
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function goBack() {
    if (currentIndex === 0) {
      update({ forgeScreen: 'home' })
    } else {
      setCurrentIndex((i) => i - 1)
    }
  }

  // Keyboard shortcuts
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!current || loading) return
    const opts = current.options ?? []

    // Number keys to select option
    const num = parseInt(e.key)
    if (!isNaN(num) && num >= 1 && num <= opts.length) {
      if (current.type === 'single') toggleSingle(current.id, opts[num - 1])
      else if (current.type === 'multiple') toggleMultiple(current.id, opts[num - 1])
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      goNext()
    }
  }, [current, loading, isLast, answers])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  async function handleEnhance() {
    setError('')
    setLoading(true)
    try {
      const result = await enhancePrompt(apiKey, originalPrompt, questions, answers, language, category, mode)
      savePreferencesAsync(result)
      update({ forgeScreen: 'result', answers, result })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  async function savePreferencesAsync(result: import('../lib/groq').EnhanceResult) {
    try {
      const { topicCategory, enhancedPrompt, originalScore, enhancedScore } = result
      const tags = await extractPreferenceTags(apiKey, questions, answers, topicCategory)
      const prefs = await getPreferences() as UserPreferences
      for (const [k, vals] of Object.entries(tags)) {
        const existing = prefs.tags[k] ?? []
        prefs.tags[k] = [...new Set([...existing, ...vals])].slice(0, 8)
      }
      const keyAnswers = questions
        .filter((q) => answers[q.id])
        .map((q) => ({
          question: q.text,
          answer: Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).join(', ') : (answers[q.id] as string)
        }))
      const session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        originalPrompt,
        enhancedPrompt,
        topicCategory,
        originalScore,
        enhancedScore,
        keyAnswers
      }
      prefs.sessions = [session, ...prefs.sessions].slice(0, 50)
      await setLanguage(language)
      await store.set('preferences', prefs)
    } catch { /* non-critical */ }
  }

  if (!current) return null

  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div className="flex flex-col h-full">
      {/* Title bar */}
      <div className="drag-region h-10 flex-shrink-0 flex items-center px-5 border-b border-forge-border">
        <button
          className="no-drag ml-14 text-forge-muted hover:text-forge-text flex items-center gap-1.5 text-xs"
          onClick={goBack}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.qBack}
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-forge-muted">{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="no-drag w-16" />
      </div>

      {/* Progress bar */}
      <div className="h-px bg-forge-border flex-shrink-0">
        <div className="h-full bg-forge-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* Question text */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-forge-muted/60 uppercase tracking-widest">
              {t.qQuestion} {currentIndex + 1}
            </p>
            <h2 className="font-display text-2xl font-semibold text-forge-text leading-snug">
              {current.text}
            </h2>
            <p className="text-xs text-forge-muted/70">
              {current.type === 'single' && t.qChooseOne + (current.options?.length ?? 0)}
              {current.type === 'multiple' && t.qChooseMany + (current.options?.length ?? 0)}
              {current.type === 'text' && t.qTypeAnswer}
            </p>
          </div>

          {/* Options */}
          {current.type !== 'text' && current.options && (
            <div className="flex flex-col gap-2">
              {current.options.map((opt, i) => {
                const selected = current.type === 'single'
                  ? answer === opt
                  : Array.isArray(answer) && answer.includes(opt)
                const isSingle = current.type === 'single'
                return (
                  <button
                    key={opt}
                    onClick={() => isSingle ? toggleSingle(current.id, opt) : toggleMultiple(current.id, opt)}
                    className={`text-left px-4 py-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      selected
                        ? 'border-forge-accent/60 bg-forge-accent/10 text-forge-text'
                        : 'border-forge-border bg-forge-surface text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                    }`}
                  >
                    {/* Radio (single) vs Checkbox (multiple) indicator */}
                    {isSingle ? (
                      <span className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'border-forge-accent bg-forge-accent' : 'border-forge-muted/40'
                      }`}>
                        {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    ) : (
                      <span className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                        selected ? 'border-forge-accent bg-forge-accent' : 'border-forge-muted/40'
                      }`}>
                        {selected && (
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                    )}
                    <span className="text-xs text-forge-muted/50 font-mono w-3 flex-shrink-0">{i + 1}</span>
                    <span className="text-sm">{opt}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Text input */}
          {current.type === 'text' && (
            <textarea
              value={textInputs[current.id] ?? ''}
              onChange={(e) => setTextAnswer(current.id, e.target.value)}
              placeholder={`${t.qTypeAnswer}…`}
              autoFocus
              className="no-drag w-full bg-forge-surface border border-forge-border rounded-2xl px-4 py-3 text-sm text-forge-text placeholder:text-forge-muted/60 focus:outline-none focus:border-forge-accent/50 min-h-[90px] resize-none"
            />
          )}

          {error && (
            <p className="text-red-400/90 text-xs bg-red-500/8 border border-red-500/15 px-4 py-2 rounded-xl text-center">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={goNext}
              disabled={loading}
              className="text-xs text-forge-muted/50 hover:text-forge-muted transition-colors"
            >
              {t.qSkip}
            </button>

            <button
              onClick={goNext}
              disabled={loading}
              className={`no-drag flex items-center gap-2 px-5 py-2.5 bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all ${isLast ? 'shadow-glow-accent scale-[1.02]' : 'shadow-md shadow-forge-accent/25'}`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.qForging}
                </>
              ) : isLast ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2l1.5 3 3.5.5-2.5 2.5.5 3.5L7 10 3.5 11.5l.5-3.5L1.5 5.5 5 5z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                  {t.qForge}
                </>
              ) : (
                <>
                  {t.qNext}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5">
            {questions.map((q, i) => {
              const ans = answers[q.id]
              const done = ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : (ans as string).trim().length > 0)
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-4 h-1.5 bg-forge-accent'
                      : done
                      ? 'w-1.5 h-1.5 bg-forge-accent/40'
                      : 'w-1.5 h-1.5 bg-forge-border'
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
