export default function QuickMode() {
  return (
    <section id="quick">
      <div className="section-inner">
        <div className="section-label">Quick Mode</div>

        <div className="quick-showcase">
          {/* Window mockup */}
          <div>
            <div className="quick-window">
              <div className="quick-input-row">
                <div className="quick-icon">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 8L3.5 2 6.5 5.5 8 3.5 9 6" stroke="#c97d3a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="quick-input-text">Make me a landing page for my new SaaS</span>
                <span className="quick-kbd">↵</span>
              </div>

              <div className="quick-question">
                <div className="quick-progress">
                  <div className="quick-prog-dot" style={{ background: '#c97d3a' }}></div>
                  <div className="quick-prog-dot" style={{ background: 'rgba(201,125,58,0.35)' }}></div>
                  <div className="quick-prog-dot" style={{ background: 'rgba(28,26,23,0.08)' }}></div>
                  <div className="quick-prog-dot" style={{ background: 'rgba(28,26,23,0.08)' }}></div>
                  <div className="quick-prog-dot" style={{ background: 'rgba(28,26,23,0.08)' }}></div>
                </div>
                <div className="quick-q-text">What&apos;s the primary goal of this landing page?</div>
                <div className="quick-options">
                  <div className="quick-opt sel">
                    <span className="quick-opt-num">1</span>
                    <span className="quick-dot sel"></span>
                    Collect email signups
                  </div>
                  <div className="quick-opt">
                    <span className="quick-opt-num">2</span>
                    <span className="quick-dot unsel"></span>
                    Drive trial signups
                  </div>
                  <div className="quick-opt">
                    <span className="quick-opt-num">3</span>
                    <span className="quick-dot unsel"></span>
                    Explain the product
                  </div>
                  <div className="quick-opt">
                    <span className="quick-opt-num">4</span>
                    <span className="quick-dot unsel"></span>
                    Book a demo
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="quick-info">
            <div>
              <div className="section-label">⌥ Space — anywhere, anytime</div>
              <h3>Improve any prompt<br />without leaving <em>your flow.</em></h3>
            </div>
            <p>Press Option+Space from any app. PromptForge detects what&apos;s in your active text field, asks what it needs to know, and pastes the improved prompt back — automatically.</p>
            <div className="quick-steps">
              <div className="quick-step">
                <div className="quick-step-num">1</div>
                <p><strong>Press ⌥ Space</strong> — the overlay opens at the bottom of your screen.</p>
              </div>
              <div className="quick-step">
                <div className="quick-step-num">2</div>
                <p><strong>Your active text field is read automatically.</strong> Or type a new prompt.</p>
              </div>
              <div className="quick-step">
                <div className="quick-step-num">3</div>
                <p><strong>Answer questions with keyboard.</strong> Press 1–6 to select, Enter to advance.</p>
              </div>
              <div className="quick-step">
                <div className="quick-step-num">4</div>
                <p><strong>Enhanced prompt is pasted</strong> back into your original app automatically.</p>
              </div>
            </div>
            <div className="shortcut-badge">
              <kbd>⌥</kbd><kbd>Space</kbd>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px' }}>to activate Quick Mode</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
