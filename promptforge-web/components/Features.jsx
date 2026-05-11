export default function Features() {
  return (
    <section id="features">
      <div className="section-inner">
        <div className="section-label">Features</div>
        <h2 className="section-title">Built for people who use AI<br /><em>every single day.</em></h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M8.5 2l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L3.5 5.5 7 5z" stroke="#c97d3a" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Learns your preferences</h3>
            <p>After every session, PromptForge extracts what it learned about you — design taste, tone, complexity level — and uses it next time. The more you use it, the fewer questions you get.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="8.5" r="6.5" stroke="#c97d3a" strokeWidth="1.3"/>
                <path d="M8.5 5v3.5l2 2" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Full prompt history</h3>
            <p>Every session saved. See a word-level diff of what changed between your original and the enhanced prompt, with before/after quality scores.</p>
          </div>

          <div
            className="feature-card wide"
            style={{ background: 'linear-gradient(130deg, rgba(201,125,58,0.05) 0%, var(--surface) 50%)' }}
          >
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="feature-icon">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M8.5 1v11M5 9l3.5 3.5L12 9" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 15h15" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>4 AI providers, one app</h3>
                <p>Use your own Gemini, OpenAI, Anthropic or Groq API key. Or subscribe to Pro and use our API — no key management, just better prompts.</p>
              </div>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="feature-icon">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <circle cx="8.5" cy="6.5" r="2.8" stroke="#c97d3a" strokeWidth="1.3"/>
                    <path d="M2 15c0-3.6 2.9-6.5 6.5-6.5S15 11.4 15 15" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Personalization dashboard</h3>
                <p>See exactly what PromptForge knows about you. Edit or delete any preference. Full transparency, full control.</p>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M2 13L6 4.5 10 9l3.5-4L17 13" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Prompt quality score</h3>
            <p>Every enhanced prompt comes with a before/after quality score (1–10), so you can see exactly how much better your prompt got.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <rect x="2" y="2" width="13" height="13" rx="2" stroke="#c97d3a" strokeWidth="1.3"/>
                <path d="M5.5 8.5l2 2 4-4" stroke="#c97d3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Multiple languages</h3>
            <p>PromptForge speaks your language. Choose from English, Czech, Chinese, Spanish, and 6 more — questions and results in your preferred language.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
