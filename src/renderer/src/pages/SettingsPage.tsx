import { useState, useEffect } from 'react'
import type { AppState } from '../App'
import { setLanguage, getDailyUsage, FREE_DAILY_LIMIT } from '../lib/store'
import { useT } from '../lib/i18n'

const LANGUAGES = ['English', 'Čeština', '中文', 'Español', 'Deutsch', 'Français', 'Italiano', 'Português', 'Polski', '日本語']

import type { T } from '../lib/i18n'

const STRIPE_LINK = 'https://buy.stripe.com/test_14A5kD3aWbxq8223G1dIA01'
const STRIPE_PORTAL = 'https://billing.stripe.com/p/login/test_00g00000000000'

function ProModal({ onClose, t }: { onClose: () => void; t: T }) {
  const features = [
    { icon: '⚡', title: t.pmFeatApi, desc: t.pmFeatApiDesc },
    { icon: '🔄', title: t.pmFeatSync, desc: t.pmFeatSyncDesc },
    { icon: '📈', title: t.pmFeatModels, desc: t.pmFeatModelsDesc },
    { icon: '♾️', title: t.pmFeatUnlimited, desc: t.pmFeatUnlimitedDesc },
  ]
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-forge-bg/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-forge-surface border border-forge-border rounded-2xl p-5 shadow-card flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-forge-text">PromptForge Pro</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-3xl font-bold text-forge-accent-soft">$3</span>
              <span className="text-forge-muted text-xs">{t.pmPerMonth}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-forge-muted hover:text-forge-text mt-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {features.map(f => (
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
            {t.pmSubscribe}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3l3 3.5-3 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function CancelModal({ onClose, onConfirm, t }: { onClose: () => void; onConfirm: () => void; t: T }) {
  const LOSING = [t.cmLose1, t.cmLose2, t.cmLose3]
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-forge-bg/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-forge-surface border border-forge-border rounded-2xl p-5 shadow-card flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-forge-text">{t.cmTitle}</p>
            <p className="text-xs text-forge-muted mt-0.5">{t.cmDesc}</p>
          </div>
          <button onClick={onClose} className="text-forge-muted hover:text-forge-text mt-0.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="bg-forge-bg border border-forge-border rounded-xl p-3 flex flex-col gap-1.5">
          <p className="text-xs text-forge-muted font-medium">{t.cmYouLose}</p>
          {LOSING.map(l => (
            <div key={l} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-400/60 flex-shrink-0" />
              <p className="text-xs text-forge-muted/80">{l}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => { window.open(STRIPE_PORTAL, '_blank'); onClose() }}
            className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 text-sm font-medium border border-red-500/20 transition-all"
          >
            {t.cmCancel}
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2 rounded-xl text-forge-muted text-xs hover:text-forge-text transition-colors"
          >
            {t.cmAlreadyCancelled}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft text-white text-sm font-medium transition-all"
          >
            {t.cmKeepPro}
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
  const t = useT(state.language)
  const [showPro, setShowPro] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [lang, setLang] = useState(state.language)
  const [saved, setSaved] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    window.electron.store.get('plan').then((p) => setIsPro(p === 'pro'))
  }, [])

  useEffect(() => {
    getDailyUsage().then(u => setUsageCount(u.count))
  }, [])

  async function handleDowngradeToFree() {
    await window.electron.store.set('plan', 'free')
    setIsPro(false)
    setShowCancel(false)
  }

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
      {showPro && <ProModal onClose={() => setShowPro(false)} t={t} />}
      {showCancel && <CancelModal onClose={() => setShowCancel(false)} onConfirm={handleDowngradeToFree} t={t} />}

      <div className="drag-region h-10 flex-shrink-0 border-b border-forge-border flex items-center px-5">
        <span className="font-display text-base font-semibold text-forge-text/80">{t.sSettings}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 max-w-md">

        {/* Plan */}
        <section className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-forge-text">
                {isPro ? t.sProPlan : t.sFreePlan}
              </p>
              {isPro && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-forge-accent/15 text-forge-accent-soft font-semibold tracking-wide border border-forge-accent/25">PRO</span>
              )}
            </div>
            {isPro ? (
              <p className="text-xs text-forge-accent-soft mt-0.5">{t.sUnlimited}</p>
            ) : (
              <p className="text-xs text-forge-muted mt-0.5">
                {usageCount} / {FREE_DAILY_LIMIT} · {t.sTodaysUsage.toLowerCase()}
              </p>
            )}
          </div>
          {isPro ? (
            <button
              onClick={() => setShowCancel(true)}
              className="text-xs px-3 py-1.5 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-border-hi transition-all"
            >
              {t.sManage}
            </button>
          ) : (
            <button
              onClick={() => setShowPro(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft text-white font-semibold transition-all shadow-sm"
            >
              {t.sUpgrade}
            </button>
          )}
        </section>

        {/* Daily usage bar (free only) */}
        {!isPro && (
          <section className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-forge-muted">
              <span>{t.sTodaysUsage}</span>
              <span>{usageCount} / {FREE_DAILY_LIMIT}</span>
            </div>
            <div className="h-1.5 bg-forge-border rounded-full overflow-hidden">
              <div
                className="h-full bg-forge-accent rounded-full transition-all"
                style={{ width: `${Math.min(100, (usageCount / FREE_DAILY_LIMIT) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-forge-muted/60">{t.sResetsAt}</p>
          </section>
        )}

        {/* Language */}
        <section className="flex flex-col gap-2">
          <p className="text-xs font-medium text-forge-muted uppercase tracking-widest">{t.sLanguage}</p>
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
            <p className="text-sm text-forge-text font-medium">{t.sQuickMode}</p>
            <p className="text-xs text-forge-muted leading-relaxed mt-0.5">
              {t.sQuickModeDesc}
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
          {saved ? t.sSaved : t.sSave}
        </button>

        {/* Danger zone */}
        <section className="border border-red-500/15 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-forge-text">{t.sResetApp}</p>
            <p className="text-xs text-forge-muted mt-0.5">{t.sResetAppDesc}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/8 transition-all"
          >
            {t.sReset}
          </button>
        </section>

      </div>
    </div>
  )
}
