import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

jest.mock('next/link', () => {
  return function Link({ href, children, className }) {
    return <a href={href} className={className}>{children}</a>
  }
})

describe('Hero component', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByText('Better prompts,')).toBeInTheDocument()
    expect(screen.getByText('before you ask.')).toBeInTheDocument()
  })

  it('renders the waitlist form', () => {
    render(<Hero />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByText('Notify me')).toBeInTheDocument()
  })

  it('renders the "how it works" link', () => {
    render(<Hero />)
    expect(screen.getByText('See how it works')).toBeInTheDocument()
  })

  it('renders target model pills', () => {
    render(<Hero />)
    expect(screen.getByText('Writes prompts for')).toBeInTheDocument()
    expect(screen.getByText('Gemini')).toBeInTheDocument()
    expect(screen.getByText('ChatGPT')).toBeInTheDocument()
    expect(screen.getByText('Claude')).toBeInTheDocument()
    expect(screen.getByText('local LLMs')).toBeInTheDocument()
  })

  it('renders the eyebrow badge', () => {
    render(<Hero />)
    expect(screen.getByText(/Free early access opens soon/)).toBeInTheDocument()
  })

  it('renders the product mockup window', () => {
    render(<Hero />)
    expect(document.querySelector('.hero-demo')).toBeInTheDocument()
  })

  it('renders all demo progress pips', () => {
    render(<Hero />)
    expect(document.querySelectorAll('.demo-pip').length).toBe(4)
  })
})
