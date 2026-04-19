import { useState } from 'react'
import { supabase } from '../lib/supabase'


interface Props {
  onLoggedIn: () => void
}

type Mode = 'signin' | 'signup'

export default function LoginPage({ onLoggedIn }: Props) {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        onLoggedIn()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setInfo('Check your email for a confirmation link, then sign in.')
        setMode('signin')
      }
    }

    setLoading(false)
  }

  async function handleGoogle() {
    setError(null)
    setLoading(true)
    try {
      const { access_token, refresh_token } = await window.electron.auth.google()
      const { error } = await supabase.auth.setSession({ access_token, refresh_token })
      if (error) throw error
      onLoggedIn()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg !== 'Window closed by user') setError(msg)
    }
    setLoading(false)
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
        <p className="text-forge-muted text-sm">
          {mode === 'signin' ? 'Sign in to your account' : 'Create a free account'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        {/* Mode tabs */}
        <div className="flex rounded-xl border border-forge-border overflow-hidden bg-forge-bg">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setInfo(null) }}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              mode === 'signin'
                ? 'bg-forge-surface text-forge-text'
                : 'text-forge-muted hover:text-forge-text'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setInfo(null) }}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              mode === 'signup'
                ? 'bg-forge-surface text-forge-text'
                : 'text-forge-muted hover:text-forge-text'
            }`}
          >
            Sign up
          </button>
        </div>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-forge-surface border border-forge-border text-forge-text text-sm placeholder:text-forge-muted focus:outline-none focus:border-forge-accent/50"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-forge-surface border border-forge-border text-forge-text text-sm placeholder:text-forge-muted focus:outline-none focus:border-forge-accent/50"
        />

        {error && (
          <p className="text-xs text-red-400 px-1">{error}</p>
        )}
        {info && (
          <p className="text-xs text-green-400 px-1">{info}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-forge-accent-soft disabled:opacity-50 text-white font-medium text-sm transition-all"
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in →' : 'Create account →'}
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-forge-border" />
          <span className="text-xs text-forge-muted">or</span>
          <div className="flex-1 h-px bg-forge-border" />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogle}
          className="w-full py-2.5 rounded-xl bg-forge-surface border border-forge-border hover:border-forge-accent/40 disabled:opacity-50 text-forge-text font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </form>
    </div>
  )
}