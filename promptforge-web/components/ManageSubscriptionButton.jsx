'use client'
import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const open = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="btn btn-ghost"
        style={{ fontSize: '13px', alignSelf: 'flex-start', marginTop: '8px', minHeight: '44px' }}
      >
        {loading ? 'Opening…' : 'Manage or cancel subscription'}
      </button>
      {error && <p role="alert" style={{ fontSize: '13px', marginTop: '6px' }}>{error}</p>}
    </>
  )
}
