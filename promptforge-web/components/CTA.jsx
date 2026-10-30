import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

export default function CTA() {
  return (
    <section className="cta-section" id="waitlist">
      <div className="section-label" style={{ display: 'inline-block' }}>Start now</div>
      <h2 className="section-title">Your next prompt is<br /><em>30 seconds away.</em></h2>
      <p className="section-sub">No account and no API key for your first prompts.</p>
      <div className="cta-actions">
        <Link href="/app" className="btn btn-primary btn-lg">Forge my first prompt →</Link>
      </div>
      <p className="section-sub" style={{ marginTop: '32px' }}>
        Want the Mac app? Press ⌥ Space in any app and get the improved prompt pasted back. We&apos;ll email you once when the signed build is ready.
      </p>
      <WaitlistForm compact />
    </section>
  )
}
