import { useState } from 'react'
import type { AppState } from '../App'
import { setApiKey, setLanguage } from '../lib/store'

const LANGUAGES = ['English', 'Čeština', '中文', 'Español', 'Deutsch', 'Français', 'Italiano', 'Português', 'Polski', '日本語']

const PROVIDERS = [
  { id: 'gemini',    label: 'Gemini',    sub: 'Google',    color: '#4285F4' },
  { id: 'openai',    label: 'OpenAI',    sub: 'GPT-4o',    color: '#10a37f' },
  { id: 'anthropic', label: 'Anthropic', sub: 'Claude',    color: '#c97d3a' },
  { id: 'groq',      label: 'Groq',      sub: 'Llama 3',   color: '#f55036' }
]

type Plan = 'own' | 'pro'

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
  onDone?: () => void
}

export default function SetupPage({ state, update, onDone }: Props) {
  const [plan, setPlan] = useState<Plan>('own')
  const [provider, setProvider] = useState('gemini')
  const [key, setKey] = useState(state.apiKey)
  const [lang, setLang] = useState(state.language)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState<'plan' | 'config'>('plan')

  async function handleSave() {
    if (plan === 'own' && !key.trim()) { setError('Please enter your API key.'); return }
    setSaving(true)
    setError('')
    const finalKey = plan === 'pro' ? 'PRO_PLAN' : key.trim()
    await setApiKey(finalKey)
    await setLanguage(lang)
    // Store provider preference
    await window.electron.store.set('provider', provider)
    await window.electron.store.set('plan', plan)
    update({ forgeScreen: 'home', apiKey: finalKey, language: lang })
    onDone?.()
    setSaving(false)
  }

  const selectedProvider = PROVIDERS.find(p => p.id === provider)!

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

      {step === 'plan' ? (
        /* ---- Step 1: Choose Plan ---- */
        <div className="w-full max-w-sm flex flex-col gap-3">
          <p className="text-xs text-forge-muted uppercase tracking-widest text-center mb-1">Choose your plan</p>

          {/* Pro card */}
          <button
            onClick={() => setPlan('pro')}
            className={`relative w-full rounded-2xl border p-4 text-left transition-all shadow-card ${
              plan === 'pro'
                ? 'border-forge-accent bg-forge-accent/8'
                : 'border-forge-border bg-forge-surface hover:border-forge-border-hi'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-xl font-semibold text-forge-text">Pro</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-forge-accent/20 text-forge-accent-soft border border-forge-accent/30 font-medium">
                    $20 / month
                  </span>
                </div>
                <p className="text-xs text-forge-muted leading-relaxed">
                  Use our API — no key needed. Faster models, priority support, unlimited sessions.
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {['Gemini 2.0 Flash included', 'Preference sync across devices', 'Priority model access'].map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-forge-muted">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#c97d3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${plan === 'pro' ? 'border-forge-accent bg-forge-accent' : 'border-forge-muted'}`} />
            </div>
          </button>

          {/* Free / own key card */}
          <button
            onClick={() => setPlan('own')}
            className={`w-full rounded-2xl border p-4 text-left transition-all shadow-card ${
              plan === 'own'
                ? 'border-forge-accent/60 bg-forge-surface-2'
                : 'border-forge-border bg-forge-surface hover:border-forge-border-hi'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-xl font-semibold text-forge-text">Free</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-forge-surface border border-forge-border text-forge-muted">
                    Your own API key
                  </span>
                </div>
                <p className="text-xs text-forge-muted leading-relaxed">
                  Bring your own Gemini, OpenAI, Anthropic or Groq API key. Pay only what you use.
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${plan === 'own' ? 'border-forge-accent bg-forge-accent' : 'border-forge-muted'}`} />
            </div>
          </button>

          <button
            onClick={() => setStep('config')}
            className="mt-1 w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft text-white text-sm font-medium transition-all"
          >
            Continue
          </button>
        </div>
      ) : (
        /* ---- Step 2: Config ---- */
        <div className="w-full max-w-sm bg-forge-surface border border-forge-border rounded-2xl p-5 flex flex-col gap-5 shadow-card">

          {plan === 'pro' ? (
            /* Pro setup */
            <div className="flex flex-col gap-4">
              <div className="text-center py-2">
                <p className="font-display text-2xl font-semibold text-forge-text">Go Pro</p>
                <p className="text-xs text-forge-muted mt-1">One payment. Full access. No API headaches.</p>
              </div>
              <div className="bg-forge-accent/8 border border-forge-accent/20 rounded-xl p-3 text-center">
                <p className="font-display text-3xl font-bold text-forge-accent-soft">$20</p>
                <p className="text-xs text-forge-muted">per month · cancel anytime</p>
              </div>
              <button
                className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft text-white text-sm font-semibold transition-all"
                onClick={() => {
                  // TODO: wire up payment (Stripe etc.)
                  alert('Payment coming soon! For now continue with Free.')
                }}
              >
                Subscribe — $20/month
              </button>
              <button onClick={() => setStep('plan')} className="text-xs text-forge-muted hover:text-forge-text text-center">
                ← Back
              </button>
            </div>
          ) : (
            /* Own key setup */
            <>
              {/* Provider */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-forge-muted uppercase tracking-widest">Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={`px-3 py-2 rounded-xl text-sm border transition-all flex items-center gap-2 ${
                        provider === p.id
                          ? 'border-forge-accent bg-forge-accent/8 text-forge-text'
                          : 'border-forge-border text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      <span className="font-medium">{p.label}</span>
                      <span className="text-xs text-forge-muted ml-auto">{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-forge-muted uppercase tracking-widest">{selectedProvider.label} API Key</label>
                <input
                  type="password"
                  className="no-drag bg-forge-bg border border-forge-border rounded-xl px-4 py-2.5 text-sm text-forge-text placeholder:text-forge-muted focus:outline-none focus:border-forge-accent/60"
                  placeholder={provider === 'gemini' ? 'AIza...' : provider === 'openai' ? 'sk-...' : provider === 'anthropic' ? 'sk-ant-...' : 'gsk_...'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>

              {/* Language */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-forge-muted uppercase tracking-widest">Language</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                        lang === l
                          ? 'border-forge-accent bg-forge-accent/8 text-forge-accent-soft font-medium'
                          : 'border-forge-border text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex gap-2">
                <button onClick={() => setStep('plan')} className="px-4 py-2.5 rounded-xl border border-forge-border text-forge-muted text-sm hover:text-forge-text hover:border-forge-border-hi">
                  ←
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-50 text-white font-medium text-sm transition-all"
                >
                  {saving ? 'Saving…' : 'Start forging'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
