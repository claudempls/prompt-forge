import AnimateIn from '@/components/AnimateIn'

const testimonials = [
  {
    quote: "PromptForge cut my prompt iteration time in half. I used to spend 10 minutes refining a prompt — now it's under 90 seconds.",
    name: "Sarah K.",
    role: "Product Designer",
    avatar: "SK",
  },
  {
    quote: "Quick Mode is genuinely magical. ⌥Space from anywhere and my vague ideas turn into precise, detailed prompts instantly.",
    name: "Marcus T.",
    role: "Full-stack Developer",
    avatar: "MT",
  },
  {
    quote: "I was skeptical about $20/mo but the time savings are real. It pays for itself on the first day of the month.",
    name: "Priya M.",
    role: "AI Researcher",
    avatar: "PM",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="section-inner">
        <AnimateIn>
          <div className="section-label">What people say</div>
          <h2 className="section-title">Loved by people who<br /><em>live in AI tools.</em></h2>
        </AnimateIn>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 80}>
              <div className="testimonial-card">
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
