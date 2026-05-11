'use client'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorParam = searchParams.get('error')

  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'magic'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error'|'success', text }

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Check your email to confirm your account.' })
      }
    } else if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Magic link sent — check your inbox.' })
      }
    }

    setLoading(false)
  }

  return (
    <div className="wrap">
      <nav>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 11L5 3.5 8.5 8 11 5l1.5 3.5" stroke="#c97d3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="3" r="1.4" fill="#e09a5a"/>
            </svg>
          </div>
          PromptForge
        </Link>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <div className="hero-eyebrow" style={{ alignSelf: 'flex-start' }}>
            <span className="hero-eyebrow-dot"></span>
            {mode === 'signup' ? 'Create your account' : 'Sign in to PromptForge'}
          </div>

          <h1 className="auth-title">
            {mode === 'signup' ? <>Get<br /><em>started.</em></> : <>Welcome<br /><em>back.</em></>}
          </h1>

          <p className="auth-sub">
            {mode === 'signup'
              ? 'Create an account to save your prompt history and settings.'
              : 'Sign in to access your dashboard, prompt history, and personalized settings.'}
          </p>

          {(errorParam || message?.type === 'error') && (
            <div className="auth-error">
              {message?.type === 'error' ? message.text : 'Something went wrong during sign in. Please try again.'}
            </div>
          )}

          {message?.type === 'success' && (
            <div className="auth-success">{message.text}</div>
          )}

          {/* Google OAuth */}
          <button onClick={handleGoogleLogin} className="btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.96L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="auth-input"
            />

            {mode !== 'magic' && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
            )}

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading
                ? 'Loading…'
                : mode === 'login'
                  ? 'Sign in with email'
                  : mode === 'signup'
                    ? 'Create account'
                    : 'Send magic link'}
            </button>
          </form>

          {/* Mode switcher */}
          <div className="auth-switch">
            {mode === 'login' && (
              <>
                <button className="auth-link" onClick={() => { setMode('signup'); setMessage(null) }}>
                  No account? Sign up
                </button>
                <span className="auth-switch-sep">·</span>
                <button className="auth-link" onClick={() => { setMode('magic'); setMessage(null) }}>
                  Magic link
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button className="auth-link" onClick={() => { setMode('login'); setMessage(null) }}>
                Already have an account? Sign in
              </button>
            )}
            {mode === 'magic' && (
              <button className="auth-link" onClick={() => { setMode('login'); setMessage(null) }}>
                Back to sign in
              </button>
            )}
          </div>

          <p className="auth-terms">
            By signing in, you agree to our{' '}
            <span className="auth-terms-link">Terms of Service</span> and{' '}
            <span className="auth-terms-link">Privacy Policy</span>.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
