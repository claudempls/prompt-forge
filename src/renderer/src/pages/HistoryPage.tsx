import { useState, useEffect } from 'react'
import { getPreferences } from '../lib/store'
import type { SessionSummary } from '../lib/store'
import { computeDiff, mergeDiff } from '../lib/diff'
import type { DiffToken } from '../lib/diff'

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [selected, setSelected] = useState<SessionSummary | null>(null)
  const [diffTokens, setDiffTokens] = useState<DiffToken[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getPreferences().then((prefs) => setSessions(prefs.sessions))
  }, [])

  function handleSelect(s: SessionSummary) {
    setSelected(s)
    const tokens = mergeDiff(computeDiff(s.originalPrompt, s.enhancedPrompt))
    setDiffTokens(tokens)
  }

  async function handleCopy() {
    if (!selected) return
    await navigator.clipboard.writeText(selected.enhancedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full">
      {/* List panel */}
      <div className="w-60 flex-shrink-0 border-r border-forge-border flex flex-col">
        {/* Title bar spacer */}
        <div className="drag-region h-10 flex-shrink-0 border-b border-forge-border flex items-center px-4">
          <span className="font-display text-base font-semibold text-forge-text/80">History</span>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="opacity-30">
                <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M14 8v6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-xs text-forge-muted">No sessions yet</p>
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-4 py-3 border-b border-forge-border/50 hover:bg-forge-surface transition-all ${
                  selected?.id === s.id ? 'bg-forge-surface border-l-2 border-l-forge-accent' : ''
                }`}
              >
                <p className="text-xs text-forge-text truncate font-medium">{s.originalPrompt}</p>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="text-[10px] text-forge-muted/60 truncate">{s.topicCategory}</span>
                  <span className="text-[10px] text-forge-muted/50 flex-shrink-0">{formatDate(s.date)}</span>
                </div>
                {/* Score bar */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-forge-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-forge-accent/50"
                      style={{ width: `${(s.originalScore / 10) * 100}%` }}
                    />
                  </div>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4h6M5 2l2 2-2 2" stroke="#c97d3a" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <div className="flex-1 h-1 rounded-full bg-forge-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-forge-accent"
                      style={{ width: `${(s.enhancedScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="drag-region h-10 flex-shrink-0 border-b border-forge-border flex items-center justify-between px-5">
          <span className="text-xs text-forge-muted">
            {selected ? selected.topicCategory : 'Select a session'}
          </span>
          {selected && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-forge-muted">{selected.originalScore}/10</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M6 2l3 3-3 3" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <span className="text-xs text-forge-accent-soft font-medium">{selected.enhancedScore}/10</span>
              </div>
              <button
                onClick={handleCopy}
                className={`no-drag text-xs px-3 py-1 rounded-lg transition-all ${copied ? 'text-green-400 bg-green-500/10' : 'text-forge-muted hover:text-forge-text hover:bg-forge-surface'}`}
              >
                {copied ? 'Copied!' : 'Copy enhanced'}
              </button>
            </div>
          )}
        </div>

        {selected ? (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
            {/* Diff view */}
            <div>
              <p className="text-xs font-medium text-forge-muted uppercase tracking-widest mb-2">Prompt diff</p>
              <div className="bg-forge-surface border border-forge-border rounded-2xl p-4 text-sm leading-relaxed select-text">
                {diffTokens.map((tok, i) => {
                  if (tok.type === 'same') {
                    return <span key={i} className="text-forge-text/70">{tok.text}</span>
                  }
                  if (tok.type === 'added') {
                    return (
                      <span key={i} className="text-forge-accent-soft bg-forge-accent/12 rounded px-0.5">
                        {tok.text}
                      </span>
                    )
                  }
                  // removed
                  return (
                    <span key={i} className="text-red-400/60 line-through">
                      {tok.text}
                    </span>
                  )
                })}
              </div>
              {/* Legend */}
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] text-forge-muted flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-forge-accent/30 inline-block" /> Added
                </span>
                <span className="text-[10px] text-forge-muted flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-red-500/20 inline-block" /> Removed
                </span>
              </div>
            </div>

            {/* Q&A summary */}
            {selected.keyAnswers.length > 0 && (
              <div>
                <p className="text-xs font-medium text-forge-muted uppercase tracking-widest mb-2">Your answers</p>
                <div className="flex flex-col gap-2">
                  {selected.keyAnswers.map((qa, i) => (
                    <div key={i} className="bg-forge-surface border border-forge-border rounded-xl px-4 py-2.5">
                      <p className="text-xs text-forge-muted">{qa.question}</p>
                      <p className="text-sm text-forge-text mt-0.5">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-8">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="opacity-20">
              <path d="M6 30L14 10L22 20L28 13L32 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-forge-muted text-sm">Select a session to see the diff</p>
          </div>
        )}
      </div>
    </div>
  )
}
