'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function Nav() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = logged out
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    if (!supabaseConfigured) {
      setUser(null)
      return
    }

    const supabase = createClient()

    const loadUser = async (u) => {
      setUser(u)
      if (u) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', u.id)
          .maybeSingle()
        setPlan(profile?.plan ?? 'free')
      } else {
        setPlan('free')
      }
    }

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      loadUser(session?.user ?? null)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const initial = (user?.user_metadata?.full_name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()

  return (
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

      <div className="nav-links">
        <Link href="/#how" className="nav-link">How it works</Link>
        <Link href="/#features" className="nav-link">Features</Link>
        <Link href="/app" className="nav-link nav-link-forge">Forge</Link>
        <Link href="/#pricing" className="nav-link">Pricing</Link>

        {user === undefined ? null : user ? (
          <>
            {plan === 'pro' ? (
              <span className="nav-pro-badge">Pro</span>
            ) : (
              <Link href="/upgrade" className="nav-upgrade-btn">
                Upgrade to Pro
              </Link>
            )}
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '13px', padding: '7px 14px', borderRadius: '9px' }}>
              Dashboard
            </Link>
            <Link href="/dashboard" className="nav-account-avatar" aria-label="Account">
              {initial}
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">Sign in</Link>
            <Link href="/upgrade" className="btn btn-primary" style={{ fontSize: '13px', padding: '7px 14px', borderRadius: '9px' }}>
              Get Pro
            </Link>
            <Link href="/login" className="nav-account-icon" aria-label="Sign in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
