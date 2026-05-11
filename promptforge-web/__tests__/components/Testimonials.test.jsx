import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Testimonials from '@/components/Testimonials'

jest.mock('@/components/AnimateIn', () => {
  return function AnimateIn({ children }) {
    return <div>{children}</div>
  }
})

describe('Testimonials component', () => {
  it('renders the section heading', () => {
    render(<Testimonials />)
    expect(screen.getByText('What people say')).toBeInTheDocument()
    expect(screen.getByText(/Loved by people who/)).toBeInTheDocument()
  })

  it('renders all three testimonial quotes', () => {
    render(<Testimonials />)
    expect(screen.getByText(/cut my prompt iteration time in half/)).toBeInTheDocument()
    expect(screen.getByText(/Quick Mode is genuinely magical/)).toBeInTheDocument()
    expect(screen.getByText(/skeptical about \$20\/mo/)).toBeInTheDocument()
  })

  it('renders all author names and roles', () => {
    render(<Testimonials />)
    expect(screen.getByText('Sarah K.')).toBeInTheDocument()
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
    expect(screen.getByText('Marcus T.')).toBeInTheDocument()
    expect(screen.getByText('Full-stack Developer')).toBeInTheDocument()
    expect(screen.getByText('Priya M.')).toBeInTheDocument()
    expect(screen.getByText('AI Researcher')).toBeInTheDocument()
  })

  it('renders avatar initials', () => {
    render(<Testimonials />)
    expect(screen.getByText('SK')).toBeInTheDocument()
    expect(screen.getByText('MT')).toBeInTheDocument()
    expect(screen.getByText('PM')).toBeInTheDocument()
  })

  it('renders three testimonial cards', () => {
    render(<Testimonials />)
    const cards = document.querySelectorAll('.testimonial-card')
    expect(cards.length).toBe(3)
  })
})
