import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

jest.mock('next/link', () => {
  return function Link({ href, children, className }) {
    return <a href={href} className={className}>{children}</a>
  }
})

describe('Footer component', () => {
  it('renders the PromptForge logo', () => {
    render(<Footer />)
    expect(screen.getByText('PromptForge')).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/2026 PromptForge/)).toBeInTheDocument()
  })

  it('renders Privacy and Terms links', () => {
    render(<Footer />)
    expect(screen.getByText('Privacy')).toHaveAttribute('href', '/privacy')
    expect(screen.getByText('Terms')).toHaveAttribute('href', '/terms')
  })

  it('renders GitHub link pointing to the real repo', () => {
    render(<Footer />)
    const githubLink = screen.getByText('GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/claudempls/prompt-forge')
  })

  it('renders Contact as a mailto link', () => {
    render(<Footer />)
    const contactLink = screen.getByText('Contact')
    expect(contactLink).toHaveAttribute('href', 'mailto:hello@promptforge.ai')
  })
})
