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
    expect(screen.getByText('Which AI does the rewritten prompt work with?')).toBeInTheDocument()
    expect(screen.getByText('Is PromptForge free?')).toBeInTheDocument()
    expect(screen.getByText('Do I need an API key?')).toBeInTheDocument()
    expect(screen.getByText('Is my data stored anywhere?')).toBeInTheDocument()
    expect(screen.getByText('Is there a Mac app?')).toBeInTheDocument()
    expect(screen.getByText(/How is this different from just asking ChatGPT/)).toBeInTheDocument()
  })

  it('renders answer about API key', () => {
    render(<FAQ />)
    expect(screen.getByText(/The web app runs on our Groq account/)).toBeInTheDocument()
  })

  it('renders answer about early access', () => {
    render(<FAQ />)
    expect(screen.getByText(/send one message when it ships/)).toBeInTheDocument()
  })

  it('renders answer about platform support', () => {
    render(<FAQ />)
    expect(screen.getByText(/It is being prepared for release/)).toBeInTheDocument()
  })

  it('renders six faq-item elements', () => {
    render(<FAQ />)
    const items = document.querySelectorAll('.faq-item')
    expect(items.length).toBe(6)
  })
})
