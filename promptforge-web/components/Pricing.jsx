import AnimateIn from '@/components/AnimateIn'

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5l3 3 6-6" stroke="#c97d3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="section-inner">
        <AnimateIn>
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple, honest <em>pricing.</em></h2>
          <p className="section-sub">Start on the web with no API key, or use your own free Groq key in the desktop app.</p>
        </AnimateIn>

        <div className="pricing-grid">
          {/* Free */}
          <AnimateIn delay={60}>
            <div className="pricing-card">
              <div>
                <div className="pricing-name">Free</div>
                <div className="pricing-price">$0<span> / forever</span></div>
                <p className="pricing-desc">Use the web app with no key, or bring your own free Groq API key on desktop.</p>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature"><CheckIcon />Desktop: your own free Groq API key</div>
                <div className="pricing-feature"><CheckIcon />Unlimited sessions</div>
                <div className="pricing-feature"><CheckIcon />Quick Mode (⌥ Space from any app)</div>
                <div className="pricing-feature"><CheckIcon />Full history &amp; personalization</div>
                <div className="pricing-feature"><CheckIcon />Llama 3.3 70B powered by Groq</div>
              </div>
              <a href="/app" className="btn btn-ghost" style={{ textAlign: 'center', justifyContent: 'center', fontSize: '13px' }}>
                Start free
              </a>
            </div>
          </AnimateIn>

          {/* Pro */}
          <AnimateIn delay={120}>
            <div className="pricing-card featured">
              <div>
                <div className="pricing-badge">Most popular</div>
                <div className="pricing-name" style={{ color: 'var(--accent-soft)' }}>Pro</div>
                <div className="pricing-price">$3<span> / month</span></div>
                <p className="pricing-desc">No key management. Prompt refinement powered by Groq.</p>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature"><CheckIcon />Groq API included — no key needed</div>
                <div className="pricing-feature"><CheckIcon />Llama 3.3 70B for fast prompt refinement</div>
                <div className="pricing-feature"><CheckIcon />Preference sync across all your Macs</div>
                <div className="pricing-feature"><CheckIcon />Priority support with &lt;4h response time</div>
                <div className="pricing-feature"><CheckIcon />Early access to new features</div>
              </div>
              <a href="/upgrade" className="btn btn-primary" style={{ textAlign: 'center', justifyContent: 'center', fontSize: '13px' }}>
                Get Pro — $3/mo
              </a>
              <p className="pricing-guarantee">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cancel anytime · No questions asked
              </p>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={160}>
          <div className="pricing-note">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Average user saves <strong>40+ minutes per week</strong> on prompt refinement. Pro pays for itself in the first hour.
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
