import Link from 'next/link'
import Nav from '@/components/Nav'

const sections = [
  {
    title: 'What we collect',
    body: 'The waitlist asks for your email address. If analytics are added later, they should be configured to collect only what is needed to understand launch traffic and site performance.',
  },
  {
    title: 'How we use it',
    body: 'Your email is used to send launch access and relevant PromptForge product updates. You can ask to be removed from the list at any time.',
  },
  {
    title: 'What not to submit',
    body: 'Do not submit API keys, passwords, private documents, secrets, or sensitive personal data through PromptForge preview forms.',
  },
  {
    title: 'Sharing',
    body: 'We do not sell waitlist emails. We may use infrastructure providers to host the site, process form submissions, store waitlist entries, or send email.',
  },
  {
    title: 'Contact',
    body: 'For privacy questions or removal requests, contact hello@promptforge.ai.',
  },
]

export const metadata = {
  title: 'Privacy Policy | PromptForge',
  description: 'Privacy policy for the PromptForge early-access waitlist.',
}

export default function PrivacyPage() {
  return (
    <div className="wrap">
    <Nav />
    <main className="legal-page">
      <div className="legal-inner">
        <Link href="/" className="legal-back">Back to PromptForge</Link>
        <div className="section-label legal-label">Privacy</div>
        <h1 className="legal-title">Privacy Policy</h1>
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
