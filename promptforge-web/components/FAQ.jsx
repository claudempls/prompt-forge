import AnimateIn from '@/components/AnimateIn'
import { ANON_FREE_FORGES, FREE_DAILY_FORGES, PRO_MONTHLY_PRICE } from '@/lib/plans'

const faqs = [
  {
    q: 'Is PromptForge free?',
    a: `Yes. Your first ${ANON_FREE_FORGES} prompts need no account. After that, sign in with Google for ${FREE_DAILY_FORGES} free prompts a day. Pro (${PRO_MONTHLY_PRICE}/month) removes the daily limit.`,
  },
  {
    q: 'How is this different from just asking ChatGPT to improve my prompt?',
    a: 'ChatGPT guesses what you meant. PromptForge asks first (audience, format, constraints), so the rewrite is based on your answers, not assumptions. You also get a before/after score showing what was missing.',
  },
  {
    q: 'Do I need an API key?',
    a: 'No. The web app runs on our Groq account. The Mac app can optionally use your own free Groq key.',
  },
  {
    q: 'Which AI does the rewritten prompt work with?',
    a: 'Any. The output is plain text you paste into ChatGPT, Claude, Gemini, a local LLM or anything else.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'If you sign in, your prompts are saved to your history so you can reuse them. Do not paste passwords, API keys or sensitive personal data.',
  },
  {
    q: 'Is there a Mac app?',
    a: 'It is being prepared for release. It adds a global ⌥ Space shortcut that improves the text in whatever app you are typing in. Leave your email below and we will send one message when it ships.',
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
