import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

jest.mock('next/link', () => {
  return function Link({ href, children, className, style }) {
    return <a href={href} className={className} style={style}>{children}</a>
  }
})

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  })),
}))

describe('Nav component', () => {
  it('renders the PromptForge logo', () => {
    render(<Nav />)
    expect(screen.getByText('PromptForge')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Nav />)
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Quick Mode')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('shows Sign in and Download when no user is logged in', () => {
    render(<Nav />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
  })

  it('logo links to home page', () => {
    render(<Nav />)
    const logoLink = screen.getByText('PromptForge').closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })
})
