'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { createClient } from '@/lib/supabase/client'

const STEPS = {
  INPUT: 'input',
  LOADING_Q: 'loading_q',
  QUESTIONS: 'questions',
  LOADING_R: 'loading_r',
  RESULT: 'result',
}

const MODE_META = {
  lite:     { label: 'Lite',     hint: 'Zero questions — instant polish',           color: '#6dbf7f' },
  standard: { label: 'Standard', hint: '3–5 questions, guided refinement',          color: '#c97d3a' },
  expert:   { label: 'Expert',   hint: '6–10 questions, production-grade prompt',   color: '#a78bfa' },
  auto:     { label: null,       hint: null,                                         color: null     },
}

function detectMode(text) {
  if (/^\/lite\b/i.test(text))     return 'lite'
  if (/^\/standard\b/i.test(text)) return 'standard'
  if (/^\/expert\b/i.test(text))   return 'expert'
  return 'auto'
}

function stripModePrefix(text) {
  return text.replace(/^\/(lite|standard|expert)\s*/i, '').trim()
}

const EXAMPLES = [
  'Write a cover letter for a software engineer role',
  'Make a landing page for my SaaS product',
  'Explain quantum computing to a 10-year-old',
  'Help me debug this React component',
]

export default function AppPage() {
  const router = useRouter()
  const supabase = useRef(createClient()).current

  const [user, setUser] = useState(undefined) // undefined = loading
  const [plan, setPlan] = useState(null)
  const [usedToday, setUsedToday] = useState(0)
  const [step, setStep] = useState(STEPS.INPUT)
  const [roughPrompt, setRoughPrompt] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [customAnswer, setCustomAnswer] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedMode, setSelectedMode] = useState('auto')

  // Load auth + plan on mount
  useEffect(() => {
    const fetchPlan = async (u) => {
      if (!u) { setPlan(null); return }
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', u.id)
        .maybeSingle()
      setPlan(profile?.plan ?? 'free')

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const { count } = await supabase
        .from('prompt_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', u.id)
        .gte('created_at', todayStart.toISOString())
      setUsedToday(count ?? 0)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      const u = session?.user ?? null
      setUser(u)
      fetchPlan(u)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Keyboard shortcuts for question options
  useEffect(() => {
    if (step !== STEPS.QUESTIONS) return
    const q = questions[currentQ]
    if (!q) return
    const handler = (e) => {
      const num = parseInt(e.key)
      if (num >= 1 && num <= q.options.length) handleAnswer(q.options[num - 1])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step, currentQ, questions])

  const handleStart = async () => {
    if (!roughPrompt.trim()) return
    const prefixMode = detectMode(roughPrompt)
    const mode = prefixMode !== 'auto' ? prefixMode : selectedMode
    const cleanPrompt = stripModePrefix(roughPrompt)
    setError(null)

    if (mode === 'lite') {
      setStep(STEPS.LOADING_R)
      try {
        const res = await fetch('/api/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: cleanPrompt, questions: [], answers: [], mode: 'lite' }),
        })
        const data = await res.json()
        if (res.status === 401) { router.push('/login?next=/app'); return }
        if (res.status === 403) { setError(data.error || 'Daily limit reached.'); setStep(STEPS.INPUT); return }
        if (!res.ok) throw new Error(data.error || 'Failed to refine prompt')
        setResult(data)
        setStep(STEPS.RESULT)
        setUsedToday(prev => prev + 1)
        if (user) {
          await supabase.from('prompt_history').insert({
            user_id: user.id,
            original_prompt: cleanPrompt,
            enhanced_prompt: data.refined,
            quality_before: Math.round(data.original_score ?? 0),
            quality_after: Math.round(data.refined_score ?? 0),
          })
        }
      } catch (e) {
        setError(e.message)
        setStep(STEPS.INPUT)
      }
      return
    }

    setStep(STEPS.LOADING_Q)
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cleanPrompt, mode }),
      })
      const data = await res.json()
      if (res.status === 401) { router.push('/login?next=/app'); return }
      if (res.status === 403) { setError(data.error || 'Daily limit reached.'); setStep(STEPS.INPUT); return }
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions')
      setQuestions(data.questions)
      setAnswers([])
      setCurrentQ(0)
      setShowCustom(false)
      setStep(STEPS.QUESTIONS)
    } catch (e) {
      setError(e.message)
      setStep(STEPS.INPUT)
    }
  }

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setShowCustom(false)
      setCustomAnswer('')
      return
    }

    // Last answer — generate refined prompt
    setStep(STEPS.LOADING_R)
    const prefixMode = detectMode(roughPrompt)
    const mode = prefixMode !== 'auto' ? prefixMode : selectedMode
    const cleanPrompt = stripModePrefix(roughPrompt)
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanPrompt,
          questions: questions.map(q => q.q),
          answers: newAnswers,
          mode,
        }),
      })
      const data = await res.json()

      if (res.status === 401) { router.push('/login?next=/app'); return }
      if (res.status === 403) { setError(data.error || 'Daily limit reached.'); setStep(STEPS.INPUT); return }
      if (!res.ok) throw new Error(data.error || 'Failed to refine prompt')

      setResult(data)
      setStep(STEPS.RESULT)
      setUsedToday(prev => prev + 1)

      // Save to history
      if (user) {
        const { error: saveErr } = await supabase.from('prompt_history').insert({
          user_id: user.id,
          original_prompt: cleanPrompt,
          enhanced_prompt: data.refined,
          quality_before: Math.round(data.original_score ?? 0),
          quality_after: Math.round(data.refined_score ?? 0),
        })
        if (saveErr) console.error('[history] save failed:', saveErr.message)
      }
    } catch (e) {
      setError(e.message)
      setStep(STEPS.INPUT)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.refined)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setStep(STEPS.INPUT)
    setRoughPrompt('')
    setQuestions([])
    setAnswers([])
    setCurrentQ(0)
    setResult(null)
    setError(null)
    setShowCustom(false)
    setCustomAnswer('')
    setCopied(false)
  }

  // ── Auth loading ──────────────────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="wrap">
        <Nav />
        <main className="forge-main">
          <div className="forge-step forge-loading-step">
            <div className="forge-spinner" />
          </div>
        </main>
      </div>
    )
  }

  // ── Not logged in ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="wrap">
        <Nav />
        <main className="forge-main">
          <div className="forge-step forge-gate">
            <div className="forge-eyebrow">
              <span className="hero-eyebrow-dot" />
              PromptForge Web
            </div>
            <h1 className="forge-title">Sign in to<br /><em>start forging</em></h1>
            <p className="forge-sub">Create an account and subscribe to start transforming your prompts.</p>
            <a href="/login" className="btn btn-primary btn-lg forge-submit">
              Sign in with Google
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </main>
      </div>
    )
  }

  // ── Full forge UI ─────────────────────────────────────────────────────────────
  return (
    <div className="wrap">
      <Nav />
      <main className="forge-main">

        {/* ── INPUT ── */}
        {step === STEPS.INPUT && (
          <div className="forge-step">
            <div className="forge-eyebrow">
              <span className="hero-eyebrow-dot" />
              PromptForge Web
            </div>
            <h1 className="forge-title">What do you want<br /><em>to create?</em></h1>
            <p className="forge-sub">
              Paste any rough prompt. We'll ask a few smart questions and return something far more precise.
            </p>

            {plan === 'free' && (
              <div className="forge-usage-bar-wrap">
                <span className="forge-usage-label">
                  {usedToday >= 5
                    ? <>Daily limit reached · <a href="/upgrade" style={{ color: 'var(--accent)' }}>Upgrade to Pro</a></>
                    : <>{5 - usedToday} forge{5 - usedToday !== 1 ? 's' : ''} remaining today</>
                  }
                </span>
                <div className="forge-usage-track">
                  <div className="forge-usage-fill" style={{ width: `${Math.min((usedToday / 5) * 100, 100)}%` }} />
                </div>
              </div>
            )}

            {error && (
              <div className="auth-error" style={{ maxWidth: '560px', width: '100%' }}>
                {error.includes('GROQ_API_KEY') ? (
                  <>Add <code>GROQ_API_KEY</code> to your <code>.env.local</code></>
                ) : error}
              </div>
            )}

            <div className="forge-mode-selector">
              {[
                { id: 'auto',     label: 'Auto',     hint: 'We detect the right mode' },
                { id: 'lite',     label: 'Lite',     hint: 'Instant polish, zero questions' },
                { id: 'standard', label: 'Standard', hint: '3–5 questions, guided' },
                { id: 'expert',   label: 'Expert',   hint: '6–10 questions, production-grade' },
              ].map(({ id, label, hint }) => {
                const prefixMode = detectMode(roughPrompt)
                const active = prefixMode !== 'auto' ? prefixMode === id : selectedMode === id
                const meta = MODE_META[id]
                return (
                  <button
                    key={id}
                    className={`forge-mode-btn${active ? ' active' : ''}`}
                    style={active && meta.color ? { '--mode-color': meta.color } : {}}
                    onClick={() => setSelectedMode(id)}
                    title={hint}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <div className="forge-input-wrap">
              <textarea
                className="forge-textarea"
                placeholder="Paste any rough prompt and we'll transform it…"
                value={roughPrompt}
                onChange={e => setRoughPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && roughPrompt.trim()) handleStart() }}
                rows={4}
                autoFocus
              />
              <div className="forge-input-footer">
                {detectMode(roughPrompt) !== 'auto' && (() => {
                  const m = detectMode(roughPrompt)
                  const meta = MODE_META[m]
                  return (
                    <span className="forge-mode-badge" style={{ color: meta.color, borderColor: meta.color + '40', background: meta.color + '15' }}>
                      /{m} mode active
                    </span>
                  )
                })()}
                <span className="forge-input-hint" style={{ marginLeft: 'auto' }}>⌘↵ to submit</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg forge-submit"
              onClick={handleStart}
              disabled={!roughPrompt.trim()}
            >
              Forge my prompt
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="forge-examples">
              <span className="forge-examples-label">Try an example</span>
              {EXAMPLES.map(ex => (
                <button key={ex} className="forge-example-chip" onClick={() => setRoughPrompt(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── LOADING QUESTIONS ── */}
        {step === STEPS.LOADING_Q && (
          <div className="forge-step forge-loading-step">
            <div className="forge-spinner" />
            <p className="forge-loading-text">Analyzing your prompt…</p>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {step === STEPS.QUESTIONS && questions[currentQ] && (
          <div className="forge-step">
            <div className="forge-progress-row">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`forge-prog-pip ${i < currentQ ? 'done' : ''} ${i === currentQ ? 'active' : ''}`}
                />
              ))}
            </div>
            <p className="forge-q-counter">Question {currentQ + 1} of {questions.length}</p>
            <h2 className="forge-question">{questions[currentQ].q}</h2>

            <div className="forge-options">
              {questions[currentQ].options.map((opt, i) => (
                <button key={i} className="forge-option" onClick={() => handleAnswer(opt)}>
                  <span className="forge-opt-num">{i + 1}</span>
                  {opt}
                </button>
              ))}
              {!showCustom ? (
                <button className="forge-option forge-option-custom" onClick={() => setShowCustom(true)}>
                  <span className="forge-opt-num">✎</span>
                  Custom answer…
                </button>
              ) : (
                <div className="forge-custom-row">
                  <input
                    className="auth-input"
                    placeholder="Type your answer…"
                    value={customAnswer}
                    onChange={e => setCustomAnswer(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && customAnswer.trim()) handleAnswer(customAnswer) }}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => customAnswer.trim() && handleAnswer(customAnswer)}
                    disabled={!customAnswer.trim()}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>

            <p className="forge-kbd-hint">Press <kbd>1</kbd>–<kbd>{questions[currentQ].options.length}</kbd> to select</p>

            <button className="forge-back-btn" onClick={() => {
              if (currentQ > 0) {
                setCurrentQ(currentQ - 1)
                setAnswers(answers.slice(0, -1))
                setShowCustom(false)
                setCustomAnswer('')
              } else {
                handleReset()
              }
            }}>
              ← Back
            </button>
          </div>
        )}

        {/* ── LOADING RESULT ── */}
        {step === STEPS.LOADING_R && (
          <div className="forge-step forge-loading-step">
            <div className="forge-spinner" />
            <p className="forge-loading-text">Forging your prompt…</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === STEPS.RESULT && result && (
          <div className="forge-step forge-result-step">
            <div className="forge-result-top">
              <div className="forge-result-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l2.5 2.5 5.5-5.5" stroke="#6dbf7f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Prompt forged
              </div>
              <div className="forge-score-row">
                <span className="forge-score-before">{result.original_score}/10</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8.5 4l4 4-4 4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="forge-score-after">{result.refined_score}/10</span>
              </div>
            </div>

            {result.improvement && (
              <p className="forge-improvement">💡 {result.improvement}</p>
            )}

            <div className="forge-cards">
              <div className="forge-card forge-card-before">
                <div className="forge-card-label">Original</div>
                <p>{roughPrompt}</p>
              </div>

              <div className="forge-card forge-card-after">
                <div className="forge-card-label-row">
                  <span className="forge-card-label">Refined</span>
                  <button className={`forge-copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
                    {copied ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <rect x="4" y="4" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M1.5 9V2a1 1 0 011-1H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Copy prompt
                      </>
                    )}
                  </button>
                </div>
                <p>{result.refined}</p>
              </div>
            </div>

            <div className="forge-result-actions">
              <button className="btn btn-ghost" onClick={handleReset}>
                ← Try another prompt
              </button>
              <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>
                View history →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
