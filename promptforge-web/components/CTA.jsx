import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

export default function CTA() {
  return (
    <section className="cta-section" id="waitlist">
      <div className="section-label" style={{ display: 'inline-block' }}>Join the launch list</div>
      <h2 className="section-title">Try PromptForge<br /><em>when it opens.</em></h2>
      <p className="section-sub">Leave your email for free early access. The first launch message will include the demo, the roadmap, and the exact free tier limits.</p>
      <WaitlistForm compact />
      <div className="cta-actions">
        <Link href="/app" className="btn btn-ghost btn-lg">Try the demo</Link>
      </div>
    </section>
  )
}
