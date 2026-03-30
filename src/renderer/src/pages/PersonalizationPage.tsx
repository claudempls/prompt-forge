import { useState, useEffect } from 'react'
import { getPreferences, store } from '../lib/store'
import type { UserPreferences } from '../lib/store'

export default function PersonalizationPage() {
  const [prefs, setPrefs] = useState<UserPreferences>({ tags: {}, sessions: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPreferences().then((p) => { setPrefs(p); setLoading(false) })
  }, [])

  async function removeTag(category: string, value: string) {
    const updated = { ...prefs }
    updated.tags[category] = updated.tags[category].filter((v) => v !== value)
    if (updated.tags[category].length === 0) delete updated.tags[category]
    setPrefs(updated)
    await store.set('preferences', updated)
  }

  async function clearAll() {
    const cleared: UserPreferences = { tags: {}, sessions: prefs.sessions }
    setPrefs(cleared)
    await store.set('preferences', cleared)
  }

  const tagEntries = Object.entries(prefs.tags)

  return (
    <div className="flex flex-col h-full">
      <div className="drag-region h-10 flex-shrink-0 border-b border-forge-border flex items-center justify-between px-5">
        <span className="font-display text-base font-semibold text-forge-text/80">Personalization</span>
        {tagEntries.length > 0 && (
          <button
            onClick={clearAll}
            className="no-drag text-xs text-red-400/70 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/8 transition-all"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 max-w-xl">
        <div>
          <p className="text-sm text-forge-text font-medium">Learned preferences</p>
          <p className="text-xs text-forge-muted mt-1 leading-relaxed">
            PromptForge learns from your answers and uses these preferences to skip obvious questions in future sessions.
            Remove any that no longer apply.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center pt-8">
            <div className="w-5 h-5 rounded-full border-2 border-forge-accent border-t-transparent animate-spin" />
          </div>
        ) : tagEntries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-forge-surface border border-forge-border flex items-center justify-center opacity-50">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3.5 20c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-forge-muted text-sm">No preferences learned yet</p>
            <p className="text-xs text-forge-muted/60 max-w-xs">
              Complete a few sessions and PromptForge will start learning your style — design preferences, tone, complexity level and more.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tagEntries.map(([category, values]) => (
              <div key={category} className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-xs font-medium text-forge-muted uppercase tracking-widest">
                  {category.replace(/_/g, ' ')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => (
                    <div
                      key={v}
                      className="flex items-center gap-1.5 px-3 py-1 bg-forge-accent/8 border border-forge-accent/20 rounded-full text-xs text-forge-accent-soft"
                    >
                      {v}
                      <button
                        onClick={() => removeTag(category, v)}
                        className="text-forge-muted/50 hover:text-red-400 transition-colors ml-0.5"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {prefs.sessions.length > 0 && (
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-2xl font-semibold text-forge-text">{prefs.sessions.length}</span>
              <span className="text-xs text-forge-muted">Sessions</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-2xl font-semibold text-forge-accent-soft">{tagEntries.length}</span>
              <span className="text-xs text-forge-muted">Preference categories</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-2xl font-semibold text-forge-text">
                {prefs.sessions.length > 0
                  ? Math.round(prefs.sessions.reduce((a, s) => a + (s.enhancedScore - s.originalScore), 0) / prefs.sessions.length * 10) / 10
                  : 0}+
              </span>
              <span className="text-xs text-forge-muted">Avg score improvement</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
