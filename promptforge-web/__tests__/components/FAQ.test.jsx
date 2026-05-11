import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import FAQ from '@/components/FAQ'

jest.mock('@/components/AnimateIn', () => {
  return function AnimateIn({ children }) {
    return <div>{children}</div>
  }
})

describe('FAQ component', () => {
  it('renders the section heading', () => {
    render(<FAQ />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByText('Common')).toBeInTheDocument()
  })

  it('renders all six FAQ questions', () => {
    render(<FAQ />)
    expect(screen.getByText('Do I need an API key?')).toBeInTheDocument()
    expect(screen.getByText('Is my data stored anywhere?')).toBeInTheDocument()
    expect(screen.getByText('What macOS version do I need?')).toBeInTheDocument()
    expect(screen.getByText('Can I cancel Pro anytime?')).toBeInTheDocument()
    expect(screen.getByText('Is Windows or Linux support coming?')).toBeInTheDocument()
    expect(screen.getByText(/How is this different from just asking ChatGPT/)).toBeInTheDocument()
  })

  it('renders answer about API key', () => {
    render(<FAQ />)
    expect(screen.getByText(/Not on Pro — we include our own API/)).toBeInTheDocument()
  })

  it('renders answer about cancellation', () => {
    render(<FAQ />)
    expect(screen.getByText(/Yes, anytime — no questions asked/)).toBeInTheDocument()
  })

  it('renders answer about Windows', () => {
    render(<FAQ />)
    expect(screen.getByText(/Windows is next on our roadmap/)).toBeInTheDocument()
  })

  it('renders six faq-item elements', () => {
    render(<FAQ />)
    const items = document.querySelectorAll('.faq-item')
    expect(items.length).toBe(6)
  })
})
