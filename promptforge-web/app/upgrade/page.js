'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const FEATURES = [
  'Unlimited forges per day',
  'Our API included — no key needed',
  'Always the latest model',
  'Sync across all devices',
  'Priority support — <4h response',
  'Early access to new features',
]

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2 7l3.5 3.5 6.5-6.5" stroke="#c97d3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const data = await res.json()

      if (res.status === 401) {
        router.push('/login?next=/upgrade')
        return
      }
      if (res.status === 400 && data.error === 'Already on Pro plan') {
        router.push('/dashboard')
        return
      }
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      window.location.href = data.url
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="wrap">
      <Nav />
      <main className="upgrade-main">
        <div className="upgrade-inner">

          <div className="upgrade-eyebrow">
            <span className="hero-eyebrow-dot" />
            Pro Plan
          </div>

          <h1 className="upgrade-title">
            Upgrade to <em>Pro</em>
          </h1>
          <p className="upgrade-sub">
            Unlimited forges, no API key needed, always on the latest model.
          </p>

          <div className="upgrade-card">
            <div className="upgrade-price-row">
              <span className="upgrade-price">$3</span>
              <span className="upgrade-price-period">/ month</span>
            </div>

            <ul className="upgrade-features">
              {FEATURES.map((f, i) => (
                <li key={i} className="upgrade-feature">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="auth-error" style={{ marginBottom: '12px' }}>{error}</div>
            )}

            <button
              className="btn btn-primary upgrade-btn"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="upgrade-spinner" />
                  Redirecting to Stripe…
                </>
              ) : (
                <>
                  Subscribe — $3/mo
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <p className="upgrade-guarantee">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cancel anytime · Secure checkout via Stripe
            </p>
          </div>

          <a href="/dashboard" className="upgrade-back">← Back to Dashboard</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
