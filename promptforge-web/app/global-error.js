'use client'

export default function GlobalError({ reset }) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
          gap: '16px',
          background: '#070710',
          color: '#e8e4dc',
          fontFamily: 'Inter, sans-serif',
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Something went wrong.</h1>
          <p style={{ fontSize: '15px', color: '#7a7a8c' }}>An unexpected error occurred.</p>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              background: '#c97d3a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
