'use client'
import { useState, useEffect, useRef } from 'react'
import AnimateIn from '@/components/AnimateIn'

const DEMOS = [
  {
    input: 'Write a cover letter for a senior developer role at Stripe',
    question: 'What tone should the letter have?',
    options: ['Professional and formal', 'Confident and direct', 'Warm and personal'],
    answerIdx: 1,
    score: '9.2 / 10',
    output: 'Write a compelling, confident cover letter for a Senior Software Engineer at Stripe. Lead with a specific insight about Stripe\'s infrastructure philosophy. Quantify impact in each role. Close with a direct ask.',
  },
  {
    input: 'Explain machine learning to a non-technical audience',
    question: 'Who is the primary reader?',
    options: ['Executive / decision maker', 'Product manager', 'General public'],
    answerIdx: 0,
    score: '9.5 / 10',
    output: 'Explain machine learning to a C-suite executive in under 150 words. Use a business analogy, avoid all math. Focus on ROI implications and one concrete real-world example they\'d recognise.',
  },
  {
    input: 'Write landing page copy for my SaaS product',
    question: 'What is the core value proposition?',
    options: ['Save time / automate', 'Increase revenue', 'Reduce errors / risk'],
    answerIdx: 0,
    score: '9.4 / 10',
    output: 'Write conversion-focused landing page copy for a B2B SaaS tool. Outcome-driven headline. Subheadline tackles the #1 objection. Three benefit bullets. CTA uses action verb + time commitment under 30 seconds.',
  },
]

const PHASES = ['typing', 'questions-in', 'selecting', 'processing', 'result', 'reading', 'reset']
const TYPE_SPEED = 38
const SELECT_DELAY = 320
const PROCESS_TIME = 900
const OUTPUT_SPEED = 22
const READ_TIME = 2600
const RESET_TIME = 500

export default function AppPreview() {
  const [demoIdx, setDemoIdx] = useState(0)
  const [phase, setPhase] = useState('typing')
  const [typedInput, setTypedInput] = useState('')
  const [optionsVisible, setOptionsVisible] = useState([false, false, false])
  const [highlighted, setHighlighted] = useState(-1)
  const [selected, setSelected] = useState(-1)
  const [processingDot, setProcessingDot] = useState(0)
  const [typedOutput, setTypedOutput] = useState('')
  const t = useRef(null)

  const demo = DEMOS[demoIdx]

  const clear = () => clearTimeout(t.current)

  useEffect(() => {
    clear()

    if (phase === 'typing') {
      setTypedInput('')
      setOptionsVisible([false, false, false])
      setHighlighted(-1)
      setSelected(-1)
      setTypedOutput('')

      let i = 0
      const type = () => {
        i++
        setTypedInput(demo.input.slice(0, i))
        if (i < demo.input.length) {
          t.current = setTimeout(type, TYPE_SPEED)
        } else {
          t.current = setTimeout(() => setPhase('questions-in'), 500)
        }
      }
      t.current = setTimeout(type, 400)
    }

    if (phase === 'questions-in') {
      demo.options.forEach((_, i) => {
        t.current = setTimeout(() => {
          setOptionsVisible(v => v.map((val, idx) => idx <= i ? true : val))
        }, i * 140)
      })
      t.current = setTimeout(() => setPhase('selecting'), demo.options.length * 140 + 300)
    }

    if (phase === 'selecting') {
      // scan through options then land on answer
      const steps = [0, 1, 2, 0, 1, 2, demo.answerIdx]
      steps.forEach((idx, step) => {
        t.current = setTimeout(() => {
          setHighlighted(idx)
          if (step === steps.length - 1) {
            setSelected(idx)
            setTimeout(() => setPhase('processing'), 300)
          }
        }, step * SELECT_DELAY)
      })
    }

    if (phase === 'processing') {
      let d = 0
      const tick = () => {
        d = (d + 1) % 3
        setProcessingDot(d)
        t.current = setTimeout(tick, 220)
      }
      t.current = setTimeout(tick, 0)
      t.current = setTimeout(() => setPhase('result'), PROCESS_TIME)
    }

    if (phase === 'result') {
      let i = 0
      const type = () => {
        i++
        setTypedOutput(demo.output.slice(0, i))
        if (i < demo.output.length) {
          t.current = setTimeout(type, OUTPUT_SPEED)
        } else {
          t.current = setTimeout(() => setPhase('reading'), 200)
        }
      }
      t.current = setTimeout(type, 100)
    }

    if (phase === 'reading') {
      t.current = setTimeout(() => setPhase('reset'), READ_TIME)
    }

    if (phase === 'reset') {
      t.current = setTimeout(() => {
        setDemoIdx(i => (i + 1) % DEMOS.length)
        setPhase('typing')
      }, RESET_TIME)
    }

    return clear
  }, [phase, demoIdx])

  const isProcessing = phase === 'processing'
  const showOutput = phase === 'result' || phase === 'reading'

  return (
    <section className="app-preview">
      <div className="section-inner">
        <AnimateIn>
          <div className="app-preview-label">
            <span className="hero-eyebrow-dot" />
            See it in action
          </div>
        </AnimateIn>

        <AnimateIn delay={80}>
          <div className="hero-mockup">
            <div className="mockup-glow" aria-hidden="true" />
            <div className="mockup-window">

              {/* Title bar */}
              <div className="mockup-bar">
                <div className="mockup-traffic">
                  <span style={{ background: '#ff5f57' }} />
                  <span style={{ background: '#febc2e' }} />
                  <span style={{ background: '#28c840' }} />
                </div>
                <div className="mockup-bar-title">
                  <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                    <path d="M1 9.5L3.5 3 6.5 6.5 8.5 4l2 4" stroke="#c97d3a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="2.5" r="1.1" fill="#e09a5a"/>
                  </svg>
                  PromptForge
                </div>
                <div style={{ width: '52px' }} />
              </div>

              {/* Input row */}
              <div className="mockup-input-row">
                <div className="mockup-input-icon" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 9 9" fill="none">
                    <path d="M1 8L3.5 2 6.5 5.5 8 3.5 9 6" stroke="#c97d3a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="mockup-input-text">
                  {typedInput}
                  {phase === 'typing' && <span className="mockup-cursor" aria-hidden="true" />}
                </span>
              </div>

              {/* Progress */}
              <div className="mockup-progress-row">
                <div className="mockup-prog-dots">
                  {[0,1,2,3].map(i => (
                    <span key={i} className={`mockup-prog-dot${i <= 1 ? ' filled' : ''}`} />
                  ))}
                </div>
                <span className="mockup-prog-label">Question 2 of 4</span>
              </div>

              {/* Question */}
              <div className="mockup-question-area">
                <div
                  className="mockup-q-label"
                  style={{
                    opacity: phase === 'typing' ? 0 : 1,
                    transform: phase === 'typing' ? 'translateY(6px)' : 'translateY(0)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                  }}
                >
                  {demo.question}
                </div>

                <div className="mockup-opts">
                  {demo.options.map((opt, i) => (
                    <div
                      key={`${demoIdx}-${i}`}
                      className={`mockup-opt${selected === i ? ' sel' : highlighted === i ? ' hl' : ''}`}
                      style={{
                        opacity: optionsVisible[i] ? 1 : 0,
                        transform: optionsVisible[i] ? 'translateY(0)' : 'translateY(10px)',
                        transition: `opacity 0.3s ease, transform 0.3s ease, border-color 0.2s, background 0.2s`,
                      }}
                    >
                      <span className="mockup-opt-num">{i + 1}</span>
                      <span className={`mockup-opt-radio${selected === i ? ' sel' : ''}`} />
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing / Output */}
              <div className="mockup-output">
                {isProcessing && (
                  <div className="mockup-processing">
                    <span className="mockup-proc-label">Forging prompt</span>
                    <span className="mockup-proc-dots">
                      {[0,1,2].map(i => (
                        <span key={i} className={`mockup-proc-dot${processingDot === i ? ' active' : ''}`} />
                      ))}
                    </span>
                  </div>
                )}

                {showOutput && (
                  <div style={{ animation: 'mockupFadeUp 0.4s ease both' }}>
                    <div className="mockup-output-header">
                      <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                        <path d="M2 5.5l2.5 2.5 5-5" stroke="#6dbf7f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Enhanced prompt ready</span>
                      <span className="mockup-score">{demo.score}</span>
                    </div>
                    <p className="mockup-output-text">
                      {typedOutput}
                      {phase === 'result' && <span className="mockup-out-cursor" />}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={140}>
          <p className="hero-platform-note" style={{ textAlign: 'center', marginTop: '20px' }}>
            macOS 13+ · Apple Silicon &amp; Intel ·
            <span className="platform-coming">Windows &amp; Linux coming soon</span>
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}
