export default function HowItWorks() {
  return (
    <section id="how">
      <div className="section-inner">
        <div className="section-label">How it works</div>
        <h2 className="section-title">Three steps to a <em>stronger prompt</em></h2>
        <p className="section-sub">No prompt engineering knowledge required. Just describe what you want, then let PromptForge make the missing context visible.</p>

        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="3" width="14" height="12" rx="2" stroke="#c97d3a" strokeWidth="1.4"/>
                <path d="M5 7h8M5 10h5" stroke="#c97d3a" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Write your rough idea</h3>
            <p>Type any vague prompt, like "make me a website", "write a cover letter", or "analyze my data". It does not have to be good.</p>
          </div>

          <div className="step">
            <div className="step-num">02</div>
            <div className="step-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#c97d3a" strokeWidth="1.4"/>
                <path d="M9 5.5v4l2.5 2" stroke="#c97d3a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Answer a few smart questions</h3>
            <p>PromptForge asks only what it needs to know through specific questions shown one at a time as simple choice cards.</p>
          </div>

          <div className="step">
            <div className="step-num">03</div>
            <div className="step-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2l2 4 4.5.5-3.25 3.25.75 4.5L9 12 5 14.25l.75-4.5L2.5 6.5 7 6z" stroke="#c97d3a" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Get a precise, powerful prompt</h3>
            <p>Your prompt is transformed and ready to paste. The launch version will focus on structure, constraints, missing context, and reusable workflows.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
