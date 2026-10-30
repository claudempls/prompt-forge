import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Pricing from '@/components/Pricing'
import { PRO_MONTHLY_PRICE } from '@/lib/plans'

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
    expect(screen.getByText('€0')).toBeInTheDocument()
    expect(screen.getByText(PRO_MONTHLY_PRICE)).toBeInTheDocument()
  })

  it('renders download and upgrade buttons', () => {
    render(<Pricing />)
    expect(screen.getByText('Start free')).toHaveAttribute('href', '/app')
    expect(screen.getByText(`Get Pro — ${PRO_MONTHLY_PRICE}/mo`)).toHaveAttribute('href', '/upgrade')
  })

  it('renders feature lists', () => {
    render(<Pricing />)
    expect(screen.getByText('Unlimited prompts')).toBeInTheDocument()
    expect(screen.getByText('Everything in Free')).toBeInTheDocument()
  })

  it('emphasizes the Pro card', () => {
    render(<Pricing />)
    expect(screen.getByText('Pro').closest('.pricing-card')).toHaveClass('featured')
  })

  it('renders cancel anytime guarantee', () => {
    render(<Pricing />)
    expect(screen.getByText(/Cancel anytime/)).toBeInTheDocument()
  })

  it('explains when a paid plan is useful', () => {
    render(<Pricing />)
    expect(screen.getByText(/Pay only if you hit the daily limit/)).toBeInTheDocument()
  })

  it('renders plan descriptions', () => {
    render(<Pricing />)
    expect(screen.getByText(/Enough for occasional use/)).toBeInTheDocument()
    expect(screen.getByText(/For people who prompt every day/)).toBeInTheDocument()
  })
})
