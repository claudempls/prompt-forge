import { useState, useEffect } from 'react'
import type { AppState } from '../App'
import { setLanguage, getDailyUsage, FREE_DAILY_LIMIT } from '../lib/store'

const LANGUAGES = ['English', 'Čeština', '中文', 'Español', 'Deutsch', 'Français', 'Italiano', 'Português', 'Polski', '日本語']

const PRO_FEATURES = [
  { icon: '⚡', title: 'API included', desc: 'No key needed' },
  { icon: '🔄', title: 'Sync', desc: 'Preferences everywhere' },
  { icon: '📈', title: 'Priority models', desc: 'Fastest tiers' },
  { icon: '♾️', title: 'Unlimited', desc: 'No rate limits' },
]

const STRIPE_LINK = 'https://buy.stripe.com/test_14A5kD3aWbxq8223G1dIA01'

function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-forge-bg/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-forge-surface border border-forge-border rounded-2xl p-5 shadow-card flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-forge-text">PromptForge Pro</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-3xl font-bold text-forge-accent-soft">$3</span>
              <span className="text-forge-muted text-xs">/ month · cancel anytime</span>
            </div>
          </div>
          <button onClick={onClose} className="text-forge-muted hover:text-forge-text mt-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRO_FEATURES.map(f => (
            <div key={f.title} className="bg-forge-bg border border-forge-border rounded-xl p-2.5 flex flex-col gap-0.5">
              <span className="text-sm">{f.icon}</span>
              <p className="text-xs font-semibold text-forge-text">{f.title}</p>
              <p className="text-xs text-forge-muted">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => { window.open(STRIPE_LINK, '_blank'); onClose() }}
            className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            Subscribe — $3/month
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3l3 3.5-3 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
  onLogout: () => void
}

export default function SettingsPage({ state, update, onLogout }: Props) {
  const [showPro, setShowPro] = useState(false)
  const [lang, setLang] = useState(state.language)
  const [saved, setSaved] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const isPro = (state as AppState & { plan?: string }).plan === 'pro'

  useEffect(() => {
    getDailyUsage().then(u => setUsageCount(u.count))
  }, [])

  async function handleSave() {
    await setLanguage(lang)
    await window.electron.store.set('language', lang)
    update({ language: lang })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogout() {
    await window.electron.store.set('plan', null)
    onLogout()
  }

  return (
    <div className="flex flex-col h-full relative">
      {showPro && <ProModal onClose={() => setShowPro(false)} />}

      <div className="drag-region h-10 flex-shrink-0 border-b border-forge-border flex items-center px-5">
        <span className="font-display text-base font-semibold text-forge-text/80">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 max-w-md">

        {/* Plan */}
        <section className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-forge-text">
              {isPro ? 'Pro plan' : 'Free plan'}
            </p>
            {isPro ? (
              <p className="text-xs text-forge-accent-soft mt-0.5">Unlimited · no rate limits</p>
            ) : (
              <p className="text-xs text-forge-muted mt-0.5">
                {usageCount} / {FREE_DAILY_LIMIT} used today
              </p>
            )}
          </div>
          {!isPro && (
            <button
              onClick={() => setShowPro(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-forge-accent/10 border border-forge-accent/25 text-forge-accent-soft hover:bg-forge-accent/15 transition-all"
            >
              Upgrade to Pro
            </button>
          )}
        </section>

        {/* Daily usage bar (free only) */}
        {!isPro && (
          <section className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-forge-muted">
              <span>Today's usage</span>
              <span>{usageCount} / {FREE_DAILY_LIMIT}</span>
            </div>
            <div className="h-1.5 bg-forge-border rounded-full overflow-hidden">
              <div
                className="h-full bg-forge-accent rounded-full transition-all"
                style={{ width: `${Math.min(100, (usageCount / FREE_DAILY_LIMIT) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-forge-muted/60">Resets at midnight</p>
          </section>
        )}

        {/* Language */}
        <section className="flex flex-col gap-2">
          <p className="text-xs font-medium text-forge-muted uppercase tracking-widest">Language</p>
          <div className="grid grid-cols-2 gap-1.5">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                  lang === l
                    ? 'border-forge-accent/60 bg-forge-accent/8 text-forge-accent-soft font-medium'
                    : 'border-forge-border text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* Quick Mode */}
        <section className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex items-start gap-3">
          <div className="flex gap-1 flex-shrink-0 mt-0.5">
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-muted font-mono">⌥</kbd>
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-muted font-mono">Space</kbd>
          </div>
          <div>
            <p className="text-sm text-forge-text font-medium">Quick Mode</p>
            <p className="text-xs text-forge-muted leading-relaxed mt-0.5">
              Option+Space opens the floating overlay anywhere — type a prompt, answer questions, and the enhanced result auto-pastes back.
            </p>
          </div>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
            saved
              ? 'bg-green-500/15 text-green-400 border border-green-500/25'
              : 'bg-forge-accent hover:bg-forge-accent-soft text-white'
          }`}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>

        {/* Danger zone */}
        <section className="border border-red-500/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-forge-text">Reset app</p>
            <p className="text-xs text-forge-muted mt-0.5">Returns to welcome screen</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/8 transition-all"
          >
            Reset
          </button>
        </section>

      </div>
    </div>
  )
}
