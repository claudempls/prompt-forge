import { useState } from 'react'
import type { AppState } from '../App'
import { setApiKey, setLanguage } from '../lib/store'

const LANGUAGES = ['English', 'Čeština', '中文', 'Español', 'Deutsch', 'Français', 'Italiano', 'Português', 'Polski', '日本語']
const PROVIDERS = [
  { id: 'gemini',    label: 'Gemini',    sub: 'Flash 2.0', color: '#4285F4' },
  { id: 'openai',    label: 'OpenAI',    sub: 'GPT-4o',    color: '#10a37f' },
  { id: 'anthropic', label: 'Anthropic', sub: 'Claude',    color: '#c97d3a' },
  { id: 'groq',      label: 'Groq',      sub: 'Llama 3',   color: '#f55036' }
]

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
  onLogout: () => void
}

export default function SettingsPage({ state, update, onLogout }: Props) {
  const [key, setKey] = useState(state.apiKey)
  const [lang, setLang] = useState(state.language)
  const [provider, setProvider] = useState('gemini')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)

  async function handleSave() {
    await setApiKey(key.trim())
    await setLanguage(lang)
    await window.electron.store.set('provider', provider)
    update({ apiKey: key.trim(), language: lang })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogout() {
    await window.electron.store.set('apiKey', '')
    onLogout()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="drag-region h-10 flex-shrink-0 border-b border-forge-border flex items-center px-5">
        <span className="font-display text-base font-semibold text-forge-text/80">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 max-w-md">

        {/* Plan */}
        <section className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-forge-text">Plan</p>
            <p className="text-xs text-forge-muted mt-0.5">Free — using your own API key</p>
          </div>
          <button className="text-xs px-3 py-1.5 rounded-xl bg-forge-accent/10 border border-forge-accent/25 text-forge-accent-soft hover:bg-forge-accent/15 transition-all">
            Upgrade to Pro
          </button>
        </section>

        {/* Provider */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-medium text-forge-muted uppercase tracking-widest">AI Provider</p>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`px-3 py-2.5 rounded-xl text-sm border flex items-center gap-2 transition-all ${
                  provider === p.id
                    ? 'border-forge-accent/60 bg-forge-accent/8 text-forge-text'
                    : 'border-forge-border bg-forge-surface text-forge-muted hover:border-forge-border-hi hover:text-forge-text'
                }`}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span className="font-medium">{p.label}</span>
                <span className="text-xs text-forge-muted ml-auto">{p.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* API Key */}
        <section className="flex flex-col gap-2">
          <p className="text-xs font-medium text-forge-muted uppercase tracking-widest">API Key</p>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="no-drag w-full bg-forge-bg border border-forge-border rounded-xl px-4 py-2.5 pr-10 text-sm text-forge-text placeholder:text-forge-muted focus:outline-none focus:border-forge-accent/60"
              placeholder="Paste your API key…"
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-muted hover:text-forge-text transition-colors"
            >
              {showKey ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M5.5 5.7A3 3 0 009.3 9.5M1 7s2-4 6-4c.9 0 1.7.2 2.4.5M13 7s-.8 1.8-2.4 2.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
        </section>

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

        {/* Quick Mode shortcut info */}
        <section className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex items-start gap-3">
          <div className="flex gap-1 flex-shrink-0 mt-0.5">
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-muted font-mono">⌥</kbd>
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-muted font-mono">Space</kbd>
          </div>
          <div>
            <p className="text-sm text-forge-text font-medium">Quick Mode</p>
            <p className="text-xs text-forge-muted leading-relaxed mt-0.5">
              Option+Space opens the floating overlay anywhere — type a prompt, answer questions, and the enhanced result auto-pastes back to your previous app.
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
            <p className="text-sm text-forge-text">Reset account</p>
            <p className="text-xs text-forge-muted mt-0.5">Clears API key and returns to setup</p>
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
