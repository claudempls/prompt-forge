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
    expect(screen.getByText('Your prompts,')).toBeInTheDocument()
    expect(screen.getByText('finally precise.')).toBeInTheDocument()
  })

  it('renders the download button', () => {
    render(<Hero />)
    expect(screen.getByText('Download for Mac — Free')).toBeInTheDocument()
  })

  it('renders the "how it works" link', () => {
    render(<Hero />)
    expect(screen.getByText('See how it works →')).toBeInTheDocument()
  })

  it('renders all AI provider pills', () => {
    render(<Hero />)
    expect(screen.getByText('Gemini')).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
    expect(screen.getByText('Anthropic')).toBeInTheDocument()
    expect(screen.getByText('Groq')).toBeInTheDocument()
  })

  it('renders the eyebrow badge', () => {
    render(<Hero />)
    expect(screen.getByText(/Powered by Gemini Flash/)).toBeInTheDocument()
  })

  it('renders the product mockup window', () => {
    render(<Hero />)
    expect(document.querySelector('.mockup-window')).toBeInTheDocument()
  })

  it('renders the mockup input text', () => {
    render(<Hero />)
    expect(screen.getByText(/Write a cover letter for a senior developer role/)).toBeInTheDocument()
  })

  it('renders the mockup enhanced prompt output', () => {
    render(<Hero />)
    expect(screen.getByText('Enhanced prompt ready')).toBeInTheDocument()
    expect(screen.getByText('9.2 / 10')).toBeInTheDocument()
  })

  it('renders the platform note with Windows coming soon', () => {
    render(<Hero />)
    expect(screen.getByText(/macOS 13/)).toBeInTheDocument()
    expect(screen.getByText(/Windows.*Linux coming soon/)).toBeInTheDocument()
  })

  it('renders the progress indicator showing question 2 of 4', () => {
    render(<Hero />)
    expect(screen.getByText('Question 2 of 4')).toBeInTheDocument()
  })
})
