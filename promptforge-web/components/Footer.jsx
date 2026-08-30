import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer-logo">PromptForge</Link>
      <div className="footer-links">
        <Link href="/privacy" className="footer-link">Privacy</Link>
        <Link href="/terms" className="footer-link">Terms</Link>
        <a href="https://github.com/claudempls/prompt-forge" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:hello@promptforge.ai" className="footer-link">Contact</a>
      </div>
      <span className="footer-copy">© 2026 PromptForge. All rights reserved.</span>
    </footer>
  )
}
