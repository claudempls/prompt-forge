import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AnimateIn from '@/components/AnimateIn'

// Mock IntersectionObserver
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()
const mockUnobserve = jest.fn()

beforeEach(() => {
  global.IntersectionObserver = jest.fn(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
  }))
})

describe('AnimateIn component', () => {
  it('renders children', () => {
    render(<AnimateIn><p>Hello</p></AnimateIn>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies fade-up class by default', () => {
    const { container } = render(<AnimateIn><span>Test</span></AnimateIn>)
    expect(container.firstChild).toHaveClass('fade-up')
  })

  it('applies additional className if provided', () => {
    const { container } = render(<AnimateIn className="my-class"><span>Test</span></AnimateIn>)
    expect(container.firstChild).toHaveClass('my-class')
    expect(container.firstChild).toHaveClass('fade-up')
  })

  it('calls IntersectionObserver observe on mount', () => {
    render(<AnimateIn><span>Test</span></AnimateIn>)
    expect(mockObserve).toHaveBeenCalled()
  })

  it('adds in-view class when intersection fires', () => {
    let observerCallback
    global.IntersectionObserver = jest.fn((cb) => {
      observerCallback = cb
      return { observe: mockObserve, disconnect: mockDisconnect }
    })

    const { container } = render(<AnimateIn><span>Test</span></AnimateIn>)
    observerCallback([{ isIntersecting: true }])
    expect(container.firstChild).toHaveClass('in-view')
  })
})
