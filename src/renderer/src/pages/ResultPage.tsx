import { useState } from 'react'
import type { AppState } from '../App'
import { useT } from '../lib/i18n'

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
}

export default function ResultPage({ state, update }: Props) {
  const t = useT(state.language)
  const { result, originalPrompt } = state
  const [copied, setCopied] = useState(false)

  if (!result) { update({ forgeScreen: 'home' }); return null }

  async function handleCopy() {
    await navigator.clipboard.writeText(result!.enhancedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Title bar */}
      <div className="drag-region h-10 flex-shrink-0 flex items-center px-5 border-b border-forge-border gap-2">
        <button
          className="no-drag ml-14 text-forge-muted hover:text-forge-text flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg hover:bg-forge-surface border border-transparent hover:border-forge-border transition-all"
          onClick={() => update({ forgeScreen: 'questions' })}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.rEditAnswers}
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-forge-accent/12 text-forge-accent-soft border border-forge-accent/20">
            {result.topicCategory}
          </span>
        </div>
        <button
          className="no-drag flex items-center gap-1.5 text-xs font-medium text-forge-text px-3 py-1.5 rounded-lg bg-forge-surface border border-forge-border hover:border-forge-border-hi transition-all"
          onClick={() => update({ forgeScreen: 'home', originalPrompt: '', questions: [], answers: {}, result: null })}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {t.rNewPrompt}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 max-w-2xl mx-auto w-full">
        {/* Header with scores */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-forge-accent/12 border border-forge-accent/25 flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 2l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L2.5 5.5 6 5z" stroke="#c97d3a" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-forge-text leading-tight">{t.rTitle}</h2>
            <p className="text-xs text-forge-muted">{t.rSubtitle}</p>
          </div>
          {/* Score pill */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-forge-surface border border-forge-border">
              <span className="text-[10px] text-forge-muted leading-none">{t.rBefore}</span>
              <span className="text-sm font-semibold text-forge-muted">{result.originalScore}/10</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="#c97d3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-forge-accent/12 border border-forge-accent/30">
              <span className="text-[10px] text-forge-accent/70 leading-none">{t.rAfter}</span>
              <span className="text-sm font-semibold text-forge-accent-soft">{result.enhancedScore}/10</span>
            </div>
          </div>
        </div>

        {/* Enhanced prompt */}
        <div className="bg-forge-surface border border-forge-accent/30 rounded-2xl p-4 flex flex-col gap-3 shadow-glow-accent">
          <p className="text-sm text-forge-text leading-relaxed whitespace-pre-wrap select-text">{result.enhancedPrompt}</p>
          <div className="flex gap-2 pt-2 border-t border-forge-border">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                copied
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'bg-forge-accent hover:bg-forge-accent-soft text-white shadow-glow-accent'
              }`}
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t.rCopied}
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="4" y="4" width="6" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M2 8V2h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {t.rCopy}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-forge-surface border border-forge-border rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-forge-muted uppercase tracking-widest mb-2">{t.rWhatImproved}</p>
          <p className="text-sm text-forge-muted leading-relaxed">{result.explanation}</p>
        </div>

        {/* Original */}
        <div className="bg-forge-surface border border-forge-border rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-forge-muted uppercase tracking-widest mb-2">{t.rOriginal}</p>
          <p className="text-sm text-forge-muted/60 leading-relaxed select-text">{originalPrompt}</p>
        </div>

        {/* New prompt */}
        <button
          onClick={() => update({ forgeScreen: 'home', originalPrompt: '', questions: [], answers: {}, result: null })}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-forge-surface border border-forge-border-hi hover:border-forge-accent/40 hover:bg-forge-surface text-forge-text text-sm font-medium transition-all group"
        >
          <span className="w-6 h-6 rounded-lg bg-forge-accent/10 border border-forge-accent/20 flex items-center justify-center group-hover:bg-forge-accent/15 transition-colors">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="#c97d3a" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
          {t.rImproveAnother}
        </button>
      </div>
    </div>
  )
}
