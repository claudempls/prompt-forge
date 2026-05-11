import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer-logo">PromptForge</Link>
      <div className="footer-links">
        <span className="footer-link footer-link-soon">Privacy <span className="footer-soon-tag">soon</span></span>
        <span className="footer-link footer-link-soon">Terms <span className="footer-soon-tag">soon</span></span>
        <a href="https://github.com/matysekprogramuje/promptforge-web" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:hello@promptforge.app" className="footer-link">Contact</a>
      </div>
      <span className="footer-copy">© 2026 PromptForge. All rights reserved.</span>
    </footer>
  )
}
