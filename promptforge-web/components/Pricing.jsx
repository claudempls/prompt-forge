import AnimateIn from '@/components/AnimateIn'
import { ANON_FREE_FORGES, FREE_DAILY_FORGES, PRO_MONTHLY_PRICE, PRO_YEARLY_PRICE, YEARLY_CHECKOUT_AVAILABLE } from '@/lib/plans'

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
          <p className="section-sub">Try it without an account. Pay only if you hit the daily limit.</p>
        </AnimateIn>

        <div className="pricing-grid">
          {/* Free */}
          <AnimateIn delay={60}>
            <div className="pricing-card">
              <div>
                <div className="pricing-name">Free</div>
                <div className="pricing-price">€0<span> / forever</span></div>
                <p className="pricing-desc">Enough for occasional use.</p>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature"><CheckIcon />{ANON_FREE_FORGES} prompts without an account</div>
                <div className="pricing-feature"><CheckIcon />{FREE_DAILY_FORGES} prompts a day with Google sign-in</div>
                <div className="pricing-feature"><CheckIcon />Before/after quality score</div>
                <div className="pricing-feature"><CheckIcon />No API key needed</div>
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
                <div className="pricing-name" style={{ color: 'var(--accent-soft)' }}>Pro</div>
                <div className="pricing-price">{PRO_MONTHLY_PRICE}<span> / month</span></div>
                <p className="pricing-desc">{YEARLY_CHECKOUT_AVAILABLE ? `or ${PRO_YEARLY_PRICE} / year. ` : ''}For people who prompt every day.</p>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature"><CheckIcon />Unlimited prompts</div>
                <div className="pricing-feature"><CheckIcon />Everything in Free</div>
                <div className="pricing-feature"><CheckIcon />No API key needed</div>
              </div>
              <a href="/upgrade" className="btn btn-primary" style={{ textAlign: 'center', justifyContent: 'center', fontSize: '13px' }}>
                Get Pro — {PRO_MONTHLY_PRICE}/mo
              </a>
              <p className="pricing-guarantee">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cancel anytime
              </p>
            </div>
          </AnimateIn>
        </div>

      </div>
    </section>
  )
}
