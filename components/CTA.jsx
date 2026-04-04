import Link from 'next/link'

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="section-label" style={{ display: 'inline-block' }}>Get started today</div>
      <h2 className="section-title">Stop writing bad prompts.<br /><em>Start forging great ones.</em></h2>
      <p className="section-sub">Try the web app free — or upgrade to Pro for unlimited forges.</p>
      <div className="cta-actions">
        <Link href="/upgrade" className="btn btn-primary btn-lg">
          Get Pro — $3/mo
        </Link>
        <Link href="/app" className="btn btn-ghost btn-lg">Try the web app →</Link>
      </div>
    </section>
  )
}
