import Link from 'next/link'
import Nav from '@/components/Nav'

const sections = [
  {
    title: 'Early access',
    body: 'PromptForge is a pre-launch product. Joining the waitlist does not guarantee access, availability, uptime, a specific feature set, or a specific launch date.',
  },
  {
    title: 'Acceptable use',
    body: 'Do not use PromptForge to create illegal, harmful, abusive, deceptive, or rights-infringing content. You are responsible for reviewing generated prompts before using them with any AI model.',
  },
  {
    title: 'No professional advice',
    body: 'PromptForge helps structure prompts. It does not provide legal, medical, financial, security, or other professional advice. Use qualified professionals for high-stakes decisions.',
  },
  {
    title: 'Product changes',
    body: 'Features, pricing, branding, supported models, and launch timing may change as the product is developed. Any free tier or early-access offer can be adjusted before launch.',
  },
  {
    title: 'Contact',
    body: 'For questions about these terms, contact hello@promptforge.ai.',
  },
]

export const metadata = {
  title: 'Terms of Service | PromptForge',
  description: 'Terms for PromptForge early access and waitlist use.',
}

export default function TermsPage() {
  return (
    <div className="wrap">
    <Nav />
    <main className="legal-page">
      <div className="legal-inner">
        <Link href="/" className="legal-back">Back to PromptForge</Link>
        <div className="section-label legal-label">Legal</div>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: August 30, 2026</p>
        <div className="legal-list">
          {sections.map(section => (
            <section className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
    </div>
  )
}
