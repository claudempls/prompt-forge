import { useState } from 'react'
import type { AppState } from '../App'
import type { Question } from '../lib/gemini'
import { enhancePrompt, extractPreferenceTags } from '../lib/gemini'
import { getPreferences, setLanguage, store } from '../lib/store'
import type { UserPreferences } from '../lib/store'

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
}

export default function QuestionsPage({ state, update }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [textInputs, setTextInputs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { questions, originalPrompt, apiKey, language } = state

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

  function answeredCount() {
    return questions.filter((q) => {
      const ans = answers[q.id]
      if (!ans) return false
      if (Array.isArray(ans)) return ans.length > 0
      return ans.trim().length > 0
    }).length
  }

  async function handleEnhance() {
    setError('')
    setLoading(true)
    try {
      const result = await enhancePrompt(apiKey, originalPrompt, questions, answers, language)
      savePreferencesAsync(result)
      update({ forgeScreen: 'result', answers, result })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function savePreferencesAsync(result: import('../lib/gemini').EnhanceResult) {
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

  const progress = Math.round((answeredCount() / questions.length) * 100)

  return (
    <div className="flex flex-col h-full">
      {/* Title bar */}
      <div className="drag-region h-10 flex-shrink-0 flex items-center px-5 border-b border-forge-border">
        <button
          className="no-drag ml-14 text-forge-muted hover:text-forge-text flex items-center gap-1.5 text-xs"
          onClick={() => update({ forgeScreen: 'home' })}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-forge-muted">{answeredCount()} / {questions.length} answered</span>
        </div>
        <div className="no-drag w-16" />
      </div>

      {/* Progress bar */}
      <div className="h-px bg-forge-border flex-shrink-0">
        <div className="h-full bg-forge-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
        <div className="text-center mb-3">
          <h2 className="font-display text-3xl font-semibold text-forge-text">A few quick questions</h2>
          <p className="text-xs text-forge-muted mt-1">Help us tailor your prompt perfectly</p>
        </div>

        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            answer={answers[q.id]}
            textValue={textInputs[q.id] ?? ''}
            onSingle={(opt) => toggleSingle(q.id, opt)}
            onMultiple={(opt) => toggleMultiple(q.id, opt)}
            onText={(val) => setTextAnswer(q.id, val)}
          />
        ))}

        <div className="flex flex-col items-center gap-2 mt-2 pb-2">
          {error && (
            <p className="text-red-400/90 text-xs bg-red-500/8 border border-red-500/15 px-4 py-2 rounded-xl">{error}</p>
          )}
          <button
            onClick={handleEnhance}
            disabled={loading || answeredCount() === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Forging your prompt…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2l1.5 3 3.5.5-2.5 2.5.5 3.5L7 10 3.5 11.5l.5-3.5L1.5 5.5 5 5z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                Forge my prompt
              </>
            )}
          </button>
          {answeredCount() < questions.length && !loading && (
            <p className="text-xs text-forge-muted/60">You can skip questions you're unsure about</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Question Card ----

interface CardProps {
  question: Question
  index: number
  answer: string | string[] | undefined
  textValue: string
  onSingle: (opt: string) => void
  onMultiple: (opt: string) => void
  onText: (val: string) => void
}

function QuestionCard({ question, index, answer, textValue, onSingle, onMultiple, onText }: CardProps) {
  const isAnswered = answer !== undefined && (Array.isArray(answer) ? answer.length > 0 : answer.trim().length > 0)

  return (
    <div className={`bg-forge-surface border rounded-2xl p-4 flex flex-col gap-3 shadow-card transition-all ${
      isAnswered ? 'border-forge-accent/35' : 'border-forge-border'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forge-accent/12 text-forge-accent text-xs font-semibold flex items-center justify-center mt-0.5 border border-forge-accent/20">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm text-forge-text font-medium leading-snug">{question.text}</p>
          <p className="text-xs text-forge-muted/70 mt-0.5">
            {question.type === 'single' && 'Choose one'}
            {question.type === 'multiple' && 'Choose all that apply'}
            {question.type === 'text' && 'Free answer'}
          </p>
        </div>
        {isAnswered && (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="7.5" cy="7.5" r="6.5" fill="#c97d3a" fillOpacity="0.15"/>
            <path d="M4.5 7.5l2 2 4-4" stroke="#c97d3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Options */}
      {question.type !== 'text' && question.options && (
        <div className="grid grid-cols-2 gap-1.5">
          {question.options.map((opt) => {
            const selected = question.type === 'single' ? answer === opt : Array.isArray(answer) && answer.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => question.type === 'single' ? onSingle(opt) : onMultiple(opt)}
                className={`text-left px-3 py-2 rounded-xl text-xs border transition-all ${
                  selected
                    ? 'border-forge-accent/60 bg-forge-accent/10 text-forge-accent-soft font-medium'
                    : 'border-forge-border text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 flex-shrink-0 border transition-all ${
                    question.type === 'single' ? 'rounded-full' : 'rounded-sm'
                  } ${selected ? 'bg-forge-accent border-forge-accent' : 'border-forge-muted/50'}`} />
                  {opt}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Text */}
      {question.type === 'text' && (
        <textarea
          value={textValue}
          onChange={(e) => onText(e.target.value)}
          placeholder="Your answer…"
          className="no-drag w-full bg-forge-bg border border-forge-border rounded-xl px-3 py-2 text-sm text-forge-text placeholder:text-forge-muted/60 focus:outline-none focus:border-forge-accent/50 min-h-[60px]"
        />
      )}
    </div>
  )
}
