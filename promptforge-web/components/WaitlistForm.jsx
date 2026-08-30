'use client'
import { useState } from 'react'

export default function WaitlistForm({ compact = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

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
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className={`waitlist-form${compact ? ' waitlist-form-compact' : ''}`} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={compact ? 'cta-email' : 'hero-email'}>Email address</label>
      <div className="waitlist-row">
        <input
          id={compact ? 'cta-email' : 'hero-email'}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="waitlist-input"
          required
        />
        <button className="btn btn-primary waitlist-submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining...' : 'Notify me'}
        </button>
      </div>
      <p className={`waitlist-note waitlist-note-${status}`}>
        {status === 'success'
          ? 'You are on the launch list.'
          : status === 'error'
            ? 'Something went wrong. Try again in a moment.'
            : 'One launch email. No spam, no account needed.'}
      </p>
    </form>
  )
}
