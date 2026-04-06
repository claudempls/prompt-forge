import { useState } from 'react'
import type { AppState } from '../App'
import { setLanguage, store } from '../lib/store'

const LANGUAGES = ['English', 'Čeština', '中文', 'Español', 'Deutsch', 'Français', 'Italiano', 'Português', 'Polski', '日本語']

const PRO_FEATURES = [
  { icon: '⚡', title: 'API included', desc: 'No key needed — we cover all AI costs' },
  { icon: '🔄', title: 'Sync across devices', desc: 'Preferences and history everywhere' },
  { icon: '📈', title: 'Priority models', desc: 'Fastest available Groq & Gemini tiers' },
  { icon: '♾️', title: 'Unlimited', desc: 'No rate limits, ever' },
]

const STRIPE_LINK = 'https://buy.stripe.com/test_14A5kD3aWbxq8223G1dIA01'

function ProPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="font-display text-3xl font-semibold text-forge-text">PromptForge Pro</p>
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <span className="font-display text-4xl font-bold text-forge-accent-soft">$3</span>
          <span className="text-forge-muted text-sm">/ month</span>
        </div>
        <p className="text-xs text-forge-muted mt-1">Cancel anytime · no API key needed</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRO_FEATURES.map(f => (
          <div key={f.title} className="bg-forge-bg border border-forge-border rounded-xl p-3 flex flex-col gap-1">
            <span className="text-base">{f.icon}</span>
            <p className="text-xs font-semibold text-forge-text">{f.title}</p>
            <p className="text-xs text-forge-muted leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.open(STRIPE_LINK, '_blank')}
        className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
      >
        Subscribe — $3/month
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3l3 3.5-3 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <button onClick={onBack} className="text-xs text-forge-muted hover:text-forge-text text-center transition-colors">
        ← Free plan is fine for now
      </button>
    </div>
  )
}

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
  onDone?: () => void
}

export default function SetupPage({ state, update, onDone }: Props) {
  const [lang, setLang] = useState(state.language)
  const [saving, setSaving] = useState(false)
  const [showPro, setShowPro] = useState(false)

  async function handleStart() {
    setSaving(true)
    await setLanguage(lang)
    await store.set('plan', 'free')
    update({ forgeScreen: 'home', language: lang })
    onDone?.()
    setSaving(false)
  }

  return (
    <div className="app-content flex flex-col items-center justify-center h-full px-8 gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-14 h-14 rounded-2xl border border-forge-border bg-forge-surface shadow-glow-accent flex items-center justify-center mb-1">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 23L11 8L17 16L22 10L25 18" stroke="#c97d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="22" cy="7" r="2.5" fill="#e09a5a"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl font-semibold text-forge-text tracking-tight">PromptForge</h1>
        <p className="text-forge-muted text-sm max-w-xs leading-relaxed">
          Transform rough ideas into precise, powerful prompts.
        </p>
      </div>

      {showPro ? (
        <div className="w-full max-w-sm bg-forge-surface border border-forge-border rounded-2xl p-5 shadow-card">
          <ProPage onBack={() => setShowPro(false)} />
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-4">
          {/* Language */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-forge-muted uppercase tracking-widest text-center">Choose your language</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-2 rounded-xl text-xs border transition-all ${
                    lang === l
                      ? 'border-forge-accent/60 bg-forge-accent/8 text-forge-accent-soft font-medium'
                      : 'border-forge-border text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Free plan info */}
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forge-text">Free plan</p>
              <p className="text-xs text-forge-muted mt-0.5">5 prompts per day · no setup needed</p>
            </div>
            <button
              onClick={() => setShowPro(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-forge-accent/10 border border-forge-accent/25 text-forge-accent-soft hover:bg-forge-accent/15 transition-all flex-shrink-0"
            >
              Go Pro →
            </button>
          </div>

          <button
            onClick={handleStart}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-50 text-white font-medium text-sm transition-all"
          >
            {saving ? 'Starting…' : 'Start forging →'}
          </button>
        </div>
      )}
    </div>
  )
}
