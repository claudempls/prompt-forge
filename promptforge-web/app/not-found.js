import Link from 'next/link'

export default function NotFound() {
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
          color: 'rgba(201,125,58,0.25)',
        }}>404</div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          Page not found.
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '340px' }}>
          This page doesn&apos;t exist or was moved.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">← Go home</Link>
          <Link href="/app" className="btn btn-ghost">Try the forge</Link>
        </div>
      </main>
    </div>
  )
}
