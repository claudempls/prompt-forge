import AnimateIn from '@/components/AnimateIn'

const faqs = [
  {
    q: 'Do I need an API key?',
    a: 'Not on Pro — we include our own API. On the Free plan you bring your own Gemini, OpenAI, Anthropic, or Groq key. It takes 30 seconds to set up.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'Prompt history is stored locally on your Mac. If you create an account, we optionally sync your learned preferences — but never the actual content of your prompts.',
  },
  {
    q: 'What macOS version do I need?',
    a: 'macOS 13 Ventura or later. Both Apple Silicon and Intel are supported. The app is notarized by Apple.',
  },
  {
    q: 'Can I cancel Pro anytime?',
    a: 'Yes, anytime — no questions asked. Your history and preferences remain accessible on the Free plan after you cancel.',
  },
  {
    q: 'Is Windows or Linux support coming?',
    a: 'Windows is next on our roadmap. Linux support is planned after that. Join the waitlist and we\'ll email you when it ships.',
  },
  {
    q: 'How is this different from just asking ChatGPT to improve my prompt?',
    a: 'PromptForge asks targeted questions to understand your specific situation, learns your preferences over time, and works from any app via Quick Mode — reading your clipboard and pasting results back automatically. ChatGPT can\'t do any of that.',
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
