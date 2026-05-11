'use client'

export default function Error({ reset }) {
  return (
    <div className="wrap">
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        gap: '16px',
      }}>
        <div style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: '96px',
          fontWeight: 700,
          lineHeight: 1,
          color: 'rgba(224,112,112,0.2)',
        }}>!</div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          Something went wrong.
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '340px' }}>
          An unexpected error occurred. Try again or go back home.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>Try again</button>
          <a href="/" className="btn btn-ghost">← Go home</a>
        </div>
      </main>
    </div>
  )
}
