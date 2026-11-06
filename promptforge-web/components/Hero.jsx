'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ANON_FREE_FORGES, FREE_DAILY_FORGES } from '@/lib/plans'

const DEMOS = [
  {
    before: 'Write a blog post about AI',
    after: 'Write a 1,200-word blog post for technical founders explaining how transformer LLMs work. Use clear analogies, avoid jargon. Structure: intro → how attention works → practical implications → CTA.',
  },
  {
    before: 'Help me write a cold email',
    after: 'Write a 3-sentence cold email to a Series A startup founder offering a UX audit. Lead with a specific pain point, cite one relevant case study, end with a low-friction CTA — 30-min call, no prep needed.',
  },
  {
    before: 'Make landing page copy',
    after: 'Write conversion-focused copy for a B2B SaaS invoicing tool targeting freelancers. Outcome-focused headline. Subheadline addresses top objection. 3 benefit bullets. CTA uses action verb + time commitment.',
  },
  {
    before: 'Explain machine learning simply',
    after: 'Explain machine learning to a non-technical product manager in under 200 words. Use one concrete analogy from everyday life. Avoid math. End with why it matters for product decisions.',
  },
]

const BEFORE_SPEED = 55
const AFTER_SPEED  = 18
const LOAD_PAUSE   = 900
const READ_PAUSE   = 3200
const RESET_PAUSE  = 500

export default function Hero({ preview }) {
  const [idx, setIdx]         = useState(0)
  const [phase, setPhase]     = useState('typing-before')
  const [beforeText, setBefore] = useState('')
  const [afterText, setAfter]   = useState('')
  const [showAfter, setShowAfter] = useState(false)
  const timeout = useRef(null)

  useEffect(() => {
    const demo = DEMOS[idx]

    if (phase === 'typing-before') {
      if (beforeText.length < demo.before.length) {
        timeout.current = setTimeout(() => {
          setBefore(demo.before.slice(0, beforeText.length + 1))
        }, BEFORE_SPEED)
      } else {
        timeout.current = setTimeout(() => setPhase('loading'), 400)
      }
    }

    if (phase === 'loading') {
      timeout.current = setTimeout(() => {
        setShowAfter(true)
        setPhase('typing-after')
      }, LOAD_PAUSE)
    }

    if (phase === 'typing-after') {
      if (afterText.length < demo.after.length) {
        timeout.current = setTimeout(() => {
          setAfter(demo.after.slice(0, afterText.length + 1))
        }, AFTER_SPEED)
      } else {
        timeout.current = setTimeout(() => setPhase('reading'), 400)
      }
    }

    if (phase === 'reading') {
      timeout.current = setTimeout(() => setPhase('resetting'), READ_PAUSE)
    }

    if (phase === 'resetting') {
      timeout.current = setTimeout(() => {
        setBefore('')
        setAfter('')
        setShowAfter(false)
        setIdx(i => (i + 1) % DEMOS.length)
        setPhase('typing-before')
      }, RESET_PAUSE)
    }

    return () => clearTimeout(timeout.current)
  }, [phase, beforeText, afterText, idx])

  return (
    <div className="hero-layout">
      <section className="hero">
        <div className="decoration-layer" aria-hidden="true">
          <div className="hero-orb" />
        </div>
  
        <div className="hero-inner">
          {/* ── LEFT ── */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Free · {ANON_FREE_FORGES} prompts without signup
            </div>
  
            <h1 className="hero-title hero-title-animate">
              Stop rewriting prompts.<br /><em>Answer a few questions instead.</em>
            </h1>
  
            <p className="hero-sub hero-sub-animate">
              Paste a rough idea. PromptForge asks what&apos;s missing, then rewrites it into a precise prompt for ChatGPT, Claude, Gemini or your local LLM, with a before/after quality score.
            </p>
  
            <div className="hero-actions hero-actions-animate">
              <Link href="/app" className="btn btn-primary btn-lg">Forge my first prompt →</Link>
              <Link href="/#how" className="btn btn-ghost btn-lg">See how it works</Link>
            </div>
            <p className="waitlist-note hero-free-note">
              {ANON_FREE_FORGES} prompts free, no account. Then {FREE_DAILY_FORGES} a day free with Google sign-in. No API key.
            </p>
  
            <div className="hero-providers hero-providers-animate">
              <span className="hero-providers-label">Writes prompts for</span>
              <div className="provider-pill provider-pill-active"><span className="provider-dot" style={{ background: '#f55036' }} />local LLMs</div>
              <div className="provider-pill provider-pill-active"><span className="provider-dot" style={{ background: '#4285F4' }} />Gemini</div>
              <div className="provider-pill provider-pill-active"><span className="provider-dot" style={{ background: '#10a37f' }} />ChatGPT</div>
              <div className="provider-pill provider-pill-active"><span className="provider-dot" style={{ background: '#c97d3a' }} />Claude</div>
            </div>
          </div>
  
          {/* ── RIGHT — animated demo ── */}
          <div className="hero-right hero-mockup-animate">
            <div className="hero-demo">
              <div className="demo-header">
                <span className="demo-dot" style={{ background: '#ff5f57' }} />
                <span className="demo-dot" style={{ background: '#febc2e' }} />
                <span className="demo-dot" style={{ background: '#28c840' }} />
                <span className="demo-title">PromptForge</span>
              </div>
  
              <div className="demo-body">
                {/* Before */}
                <div className="demo-row">
                  <span className="demo-label demo-label-before">Rough</span>
                  <div className="demo-bubble demo-bubble-before">
                    <span>{beforeText}</span>
                    {(phase === 'typing-before') && <span className="demo-cursor" />}
                  </div>
                </div>
  
                {/* Loading / After */}
                {phase === 'loading' && (
                  <div className="demo-row demo-row-after">
                    <span className="demo-label demo-label-after">Forging</span>
                    <div className="demo-bubble demo-bubble-after">
                      <span className="demo-dots">
                        <span /><span /><span />
                      </span>
                    </div>
                  </div>
                )}
  
                {showAfter && phase !== 'loading' && (
                  <div className="demo-row demo-row-after">
                    <span className="demo-label demo-label-after">Refined</span>
                    <div className="demo-bubble demo-bubble-after">
                      <span>{afterText}</span>
                      {phase === 'typing-after' && <span className="demo-cursor demo-cursor-after" />}
                    </div>
                  </div>
                )}
              </div>
  
              <div className="demo-footer">
                {[0,1,2,3].map(i => (
                  <span key={i} className={`demo-pip${i === idx ? ' active' : ''}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    {preview}
    </div>
  )
}
