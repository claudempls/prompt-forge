import { useState } from 'react'
import type { AppState } from '../App'
import { generateQuestions } from '../lib/gemini'

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
  const [prompt, setPrompt] = useState(state.originalPrompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleStart() {
    const trimmed = prompt.trim()
    if (!trimmed) { setError('Write something first.'); return }
    setError('')
    setLoading(true)
    try {
      const questions = await generateQuestions(state.apiKey, trimmed, state.language)
      update({ forgeScreen: 'questions', originalPrompt: trimmed, questions, answers: {} })
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
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-5xl font-semibold text-forge-text tracking-tight leading-tight">
            Improve your prompt
          </h2>
          <p className="text-forge-muted text-sm max-w-sm leading-relaxed">
            Paste any rough idea — PromptForge asks a few smart questions and transforms it into something precise.
          </p>
        </div>

        {/* Input card */}
        <div className="w-full max-w-lg rounded-2xl border border-forge-border bg-forge-surface shadow-card focus-within:border-forge-accent/50 transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build, write, or create…"
            className="no-drag w-full bg-transparent text-forge-text text-sm px-4 pt-4 pb-2 placeholder:text-forge-muted focus:outline-none min-h-[100px] leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleStart()
            }}
          />
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <span className="text-xs text-forge-muted/70">
              {prompt.length > 0 ? `${prompt.length} chars` : '⌘+Enter to improve'}
            </span>
            <button
              onClick={handleStart}
              disabled={loading}
              className="no-drag flex items-center gap-2 px-4 py-1.5 bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M8 3l3 3.5-3 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Improve
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
            <p className="text-xs text-forge-muted/60">Try an example</p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-lg">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-xs px-3 py-1.5 bg-forge-surface border border-forge-border rounded-full text-forge-muted hover:text-forge-text hover:border-forge-border-hi transition-all"
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
