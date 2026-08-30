import AnimateIn from '@/components/AnimateIn'

const faqs = [
  {
    q: 'What happens when I join the waitlist?',
    a: 'You get one launch email when early access opens. The email will explain the demo, free tier limits, and roadmap.',
  },
  {
    q: 'Is PromptForge free?',
    a: 'The early-access version is being built around a free tier. Paid features may come later, but this launch page is only collecting interest for access.',
  },
  {
    q: 'Do I need an API key?',
    a: 'Not for the waitlist or the public demo. Some advanced versions may support your own API key later, but it is not required to join.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'The waitlist stores your email address. Do not submit passwords, API keys, private documents, or sensitive personal data into preview forms.',
  },
  {
    q: 'Is this only for macOS?',
    a: 'The desktop app is macOS-first, but the web demo and waitlist work in the browser. Platform support may expand after launch.',
  },
  {
    q: 'How is this different from just asking ChatGPT to improve my prompt?',
    a: 'The goal is to make prompt quality visible before you spend a model response. PromptForge focuses on missing context, constraints, structure, and reusable workflows.',
  },
]

export default function FAQ() {
  return (
    <section id="faq">
      <div className="section-inner faq-inner">
        <AnimateIn>
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Common <em>questions.</em></h2>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="faq-q">
                  {item.q}
                  <svg className="faq-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <p className="faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
