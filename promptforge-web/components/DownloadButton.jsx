'use client'
import { useState } from 'react'

export default function DownloadButton({ className = 'btn btn-primary btn-lg btn-download', children }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to join waitlist')
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

            <div className="hero-eyebrow" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>
              <span className="hero-eyebrow-dot" />
              macOS app
            </div>

            <h2 className="modal-title">Desktop app<br /><em>coming soon.</em></h2>
            <p className="modal-sub">
              The native macOS app with Quick Mode (⌥ Space) is in development. Leave your email and we'll notify you the moment it's ready.
            </p>

            {status === 'success' ? (
              <div className="auth-success" style={{ marginTop: '8px' }}>
                You're on the list — we'll email you when it ships. 🎉
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
                {status === 'error' && (
                  <div className="auth-error">Something went wrong. Try again.</div>
                )}
                <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ width: '100%', justifyContent: 'center' }}>
                  {status === 'loading' ? 'Saving…' : "Notify me when it's ready"}
                </button>
              </form>
            )}

            <div className="modal-divider"><span>or</span></div>

            <a href="/app" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
              Try the web app now →
            </a>
          </div>
        </div>
      )}
    </>
  )
}
