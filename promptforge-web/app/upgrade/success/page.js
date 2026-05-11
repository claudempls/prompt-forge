import Link from 'next/link'
import Nav from '@/components/Nav'

export default function UpgradeSuccessPage() {
  return (
    <div className="wrap">
      <Nav />
      <main className="upgrade-main">
        <div className="upgrade-inner" style={{ alignItems: 'center', textAlign: 'center' }}>

          <div className="upgrade-success-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M5 14l6 6 12-12" stroke="#6dbf7f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="upgrade-title" style={{ marginTop: '20px' }}>
            Welcome to <em>Pro!</em>
          </h1>
          <p className="upgrade-sub" style={{ maxWidth: '380px' }}>
            Your plan has been upgraded. Enjoy unlimited forges and all Pro features.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/app" className="btn btn-primary btn-lg">
              Start forging
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/dashboard" className="btn btn-ghost btn-lg">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
