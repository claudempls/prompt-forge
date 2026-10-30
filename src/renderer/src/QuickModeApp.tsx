import { useState, useEffect, useRef, useCallback } from 'react'
import { generateQuestions, enhancePrompt } from './lib/groq'
import { getApiKey, getLanguage } from './lib/store'
import { useT } from './lib/i18n'
import type { Mode, Question } from './lib/groq'

type QMState = 'idle' | 'loading-questions' | 'questions' | 'loading-result' | 'done' | 'error'

const WINDOW_HEIGHTS: Record<QMState, number> = {
  'idle':              72,
  'loading-questions': 72,
  'questions':         380,
  'loading-result':    100,
  'done':              100,
  'error':             90
}

export default function QuickModeApp() {
  const [state, setState] = useState<QMState>('idle')
  const [prompt, setPrompt] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [error, setError] = useState('')
  const [apiKey, setApiKeyState] = useState('')
  const [language, setLanguageState] = useState('English')
  const [mode, setMode] = useState<Mode>('standard')
  const t = useT(language)
  const [detectedSource, setDetectedSource] = useState(false) // true = came from active field

  const promptRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getApiKey().then((k) => setApiKeyState(k ?? ''))
    getLanguage().then((l) => setLanguageState(l))
  }, [])

  // Resize window whenever state changes
  useEffect(() => {
    window.electron.quick.resize(WINDOW_HEIGHTS[state])
  }, [state])

  // Listen for reset from main (window hidden)
  useEffect(() => {
    return window.electron.quick.onReset(reset)
  }, [])

  // Listen for detected prompt from active input field
  useEffect(() => {
    return window.electron.quick.onDetectedPrompt((text: string) => {
      if (text.trim().length > 3) {
        // Got real text from the active field — auto-start immediately
        setPrompt(text.trim())
        setDetectedSource(true)
        startFlow(text.trim())
      } else {
        // Nothing found — show input, let user type
        setDetectedSource(false)
        setTimeout(() => promptRef.current?.focus(), 80)
      }
    })
  }, [apiKey, language, mode]) // re-register when api key loads

  function reset() {
    setState('idle')
    setPrompt('')
    setQuestions([])
    setQIndex(0)
    setAnswers({})
    setError('')
    setDetectedSource(false)
  }

  async function startFlow(text: string) {
    const key = apiKey || (await getApiKey()) || ''
    const lang = language || (await getLanguage()) || 'English'
    if (!key) { setError('No API key configured. Open PromptForge settings.'); setState('error'); return }

    setState('loading-questions')
    try {
      const qs = await generateQuestions(key, text, lang, 'auto', mode)

      if (qs.length === 0) {
        // No questions needed — forge directly
        await forgeDirectly(text, [], {}, key, lang)
      } else {
        setQuestions(qs)
        setQIndex(0)
        setAnswers({})
        setState('questions')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error generating questions')
      setState('error')
    }
  }

  async function forgeDirectly(
    text: string,
    qs: Question[],
    ans: Record<string, string | string[]>,
    key: string,
    lang: string
  ) {
    setState('loading-result')
    try {
      const result = await enhancePrompt(key, text, qs, ans, lang, 'auto', mode)
      await window.electron.quick.done(result.enhancedPrompt)
      setState('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error enhancing prompt')
      setState('error')
    }
  }

  async function handlePromptSubmit() {
    const trimmed = prompt.trim()
    if (!trimmed) return
    setDetectedSource(false)
    await startFlow(trimmed)
  }

  async function handleForge() {
    const key = apiKey || (await getApiKey()) || ''
    const lang = language || (await getLanguage()) || 'English'
    await forgeDirectly(prompt, questions, answers, key, lang)
  }

  const currentQ = questions[qIndex]

  function advanceQuestion() {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1)
    } else {
      handleForge()
    }
  }

  // Keyboard handler for question phase
  const handleQuestionKey = useCallback((e: KeyboardEvent) => {
    if (state !== 'questions' || !currentQ) return

    if (e.key === 'Escape') { window.electron.quick.close(); return }

    if (currentQ.type === 'text' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); advanceQuestion(); return
    }

    if (currentQ.type !== 'text' && currentQ.options) {
      const num = parseInt(e.key)
      if (num >= 1 && num <= currentQ.options.length) {
        const opt = currentQ.options[num - 1]
        if (currentQ.type === 'single') {
          setAnswers((a) => ({ ...a, [currentQ.id]: opt }))
          setTimeout(() => advanceQuestion(), 180)
        } else {
          setAnswers((a) => {
            const cur = (a[currentQ.id] as string[]) ?? []
            return { ...a, [currentQ.id]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] }
          })
        }
      }
      if (e.key === 'Enter') { e.preventDefault(); advanceQuestion() }
    }
  }, [state, currentQ, qIndex, questions.length]) // eslint-disable-line

  useEffect(() => {
    window.addEventListener('keydown', handleQuestionKey)
    return () => window.removeEventListener('keydown', handleQuestionKey)
  }, [handleQuestionKey])

  return (
    <div className="quick-root h-full flex flex-col overflow-hidden select-none">

      {/* ---- IDLE / LOADING-QUESTIONS: prompt input ---- */}
      {(state === 'idle' || state === 'loading-questions') && (
        <div className="flex items-center h-[72px] px-4 gap-3">
          <div className="w-5 h-5 rounded-md bg-forge-accent/20 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L4.5 2l4 5.5L7 4.5 9 2.5" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            ref={promptRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePromptSubmit()
              if (e.key === 'Escape') window.electron.quick.close()
            }}
            placeholder="Paste or type your prompt…"
            className="flex-1 bg-transparent text-forge-text text-sm placeholder:text-forge-muted/50 focus:outline-none select-text"
          />
          <select
            aria-label={t.modeLabel}
            value={mode}
            disabled={state !== 'idle'}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="no-drag bg-forge-surface text-forge-muted text-xs rounded border border-forge-border"
          >
            <option value="lite" title={t.modeLiteDesc}>{t.modeLite}</option>
            <option value="standard" title={t.modeStandardDesc}>{t.modeStandard}</option>
            <option value="expert" title={t.modeExpertDesc}>{t.modeExpert}</option>
            <option value="compact" title={t.modeCompactDesc}>{t.modeCompact}</option>
          </select>
          {state === 'loading-questions' ? (
            <div className="w-4 h-4 border-2 border-forge-accent/30 border-t-forge-accent rounded-full animate-spin flex-shrink-0" />
          ) : prompt.trim() ? (
            <kbd className="text-[10px] text-forge-muted/50 font-mono px-1.5 py-0.5 bg-forge-surface/60 rounded border border-forge-border flex-shrink-0">↵</kbd>
          ) : null}
        </div>
      )}

      {/* ---- QUESTIONS: one at a time ---- */}
      {state === 'questions' && currentQ && (
        <div className="flex flex-col h-full">
          {/* Mini header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1.5 flex-shrink-0">
            <span className="text-[10px] text-forge-muted/50 truncate max-w-[300px] italic">"{prompt.length > 60 ? prompt.slice(0, 60) + '…' : prompt}"</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-forge-muted/40 font-mono">{qIndex + 1}/{questions.length}</span>
              <button onClick={() => window.electron.quick.close()} className="text-forge-muted/30 hover:text-forge-muted transition-colors">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 px-4 mb-2.5 flex-shrink-0">
            {questions.map((_, i) => (
              <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                i < qIndex ? 'bg-forge-accent' : i === qIndex ? 'bg-forge-accent/50' : 'bg-forge-border'
              }`} />
            ))}
          </div>

          {/* Question content */}
          <div className="flex-1 flex flex-col px-4 gap-2.5 overflow-hidden">
            <p className="text-sm font-medium text-forge-text leading-snug flex-shrink-0">{currentQ.text}</p>

            {/* Single/Multiple options */}
            {currentQ.type !== 'text' && currentQ.options && (
              <div className="flex flex-col gap-1 overflow-y-auto">
                {currentQ.options.map((opt, idx) => {
                  const ans = answers[currentQ.id]
                  const selected = currentQ.type === 'single' ? ans === opt : Array.isArray(ans) && ans.includes(opt)
                  return (
                    <button key={opt} onClick={() => {
                      if (currentQ.type === 'single') {
                        setAnswers((a) => ({ ...a, [currentQ.id]: opt }))
                        setTimeout(() => advanceQuestion(), 180)
                      } else {
                        setAnswers((a) => {
                          const cur = (a[currentQ.id] as string[]) ?? []
                          return { ...a, [currentQ.id]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] }
                        })
                      }
                    }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all text-left ${
                        selected
                          ? 'border-forge-accent/60 bg-forge-accent/10 text-forge-accent-soft'
                          : 'border-forge-border/60 text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                      }`}
                    >
                      <span className="text-[10px] text-forge-muted/40 font-mono w-3 flex-shrink-0">{idx + 1}</span>
                      <span className={`w-2.5 h-2.5 flex-shrink-0 border transition-all ${
                        currentQ.type === 'single' ? 'rounded-full' : 'rounded-sm'
                      } ${selected ? 'bg-forge-accent border-forge-accent' : 'border-forge-muted/30'}`} />
                      {opt}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Text */}
            {currentQ.type === 'text' && (
              <textarea
                autoFocus
                value={(answers[currentQ.id] as string) ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [currentQ.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); advanceQuestion() } }}
                placeholder="Type your answer… (Enter to continue)"
                className="no-drag flex-1 bg-forge-bg/60 border border-forge-border/60 rounded-xl px-3 py-2 text-sm text-forge-text placeholder:text-forge-muted/40 focus:outline-none focus:border-forge-accent/40 resize-none min-h-[56px]"
              />
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 border-t border-forge-border/40 mt-1">
            <span className="text-[10px] text-forge-muted/30">
              {currentQ.type !== 'text' ? `press 1–${currentQ.options?.length} to select` : 'Enter to continue'}
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => advanceQuestion()}
                className="text-[10px] text-forge-muted/50 hover:text-forge-muted px-2 py-1 rounded-lg hover:bg-forge-surface/60 transition-all">
                Skip
              </button>
              {qIndex === questions.length - 1 ? (
                <button onClick={handleForge}
                  className="text-[10px] px-3 py-1 rounded-lg bg-forge-accent text-white hover:bg-forge-accent-soft transition-all font-medium">
                  Forge ✦
                </button>
              ) : (
                <button onClick={advanceQuestion}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-forge-surface/80 border border-forge-border/60 text-forge-muted hover:text-forge-text transition-all">
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- LOADING RESULT ---- */}
      {state === 'loading-result' && (
        <div className="flex items-center justify-center h-full gap-3 px-4">
          <div className="w-3.5 h-3.5 border-2 border-forge-accent/30 border-t-forge-accent rounded-full animate-spin" />
          <span className="text-sm text-forge-muted">Forging your prompt…</span>
        </div>
      )}

      {/* ---- DONE ---- */}
      {state === 'done' && (
        <div className="flex items-center justify-center h-full gap-2.5 px-4">
          <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm text-forge-muted">
            {detectedSource ? 'Pasting enhanced prompt…' : 'Copied to clipboard ✓'}
          </span>
        </div>
      )}

      {/* ---- ERROR ---- */}
      {state === 'error' && (
        <div className="flex items-center gap-3 h-full px-4">
          <span className="text-red-400/80 text-xs flex-1 leading-relaxed">{error}</span>
          <button onClick={reset}
            className="text-xs text-forge-muted hover:text-forge-text px-2 py-1 rounded-lg bg-forge-surface/60 border border-forge-border/60 flex-shrink-0">
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
