import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Pricing from '@/components/Pricing'

jest.mock('@/components/AnimateIn', () => {
  return function AnimateIn({ children }) {
    return <div>{children}</div>
  }
})

describe('Pricing component', () => {
  it('renders Free and Pro plans', () => {
    render(<Pricing />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('shows correct prices', () => {
    render(<Pricing />)
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$20')).toBeInTheDocument()
  })

  it('renders download and upgrade buttons', () => {
    render(<Pricing />)
    expect(screen.getByText('Download free')).toBeInTheDocument()
    expect(screen.getByText('Get Pro — $20/mo')).toBeInTheDocument()
  })

  it('renders feature lists', () => {
    render(<Pricing />)
    expect(screen.getByText('Unlimited sessions')).toBeInTheDocument()
    expect(screen.getByText(/Priority support/)).toBeInTheDocument()
  })

  it('renders Most popular badge on Pro', () => {
    render(<Pricing />)
    expect(screen.getByText('Most popular')).toBeInTheDocument()
  })

  it('renders cancel anytime guarantee', () => {
    render(<Pricing />)
    expect(screen.getByText(/Cancel anytime/)).toBeInTheDocument()
  })

  it('renders the time savings note', () => {
    render(<Pricing />)
    expect(screen.getByText(/40\+ minutes per week/)).toBeInTheDocument()
  })

  it('renders plan descriptions', () => {
    render(<Pricing />)
    expect(screen.getByText(/Bring your own API key/)).toBeInTheDocument()
    expect(screen.getByText(/No key management/)).toBeInTheDocument()
  })
})
