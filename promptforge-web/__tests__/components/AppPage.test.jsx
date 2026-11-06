import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import AppPage from '@/app/app/page'
import { createClient } from '@/lib/supabase/client'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('@/components/Nav', () => () => <nav />)
jest.mock('@/lib/supabase/client', () => ({ createClient: jest.fn() }))

const user = { id: 'user-1' }
let client

beforeEach(() => {
  jest.useFakeTimers()
  const query = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockResolvedValue({ count: 0, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: { plan: 'free' }, error: null }),
  }
  client = {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => query),
  }
  createClient.mockReturnValue(client)
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ remaining: 2 }) })
})

afterEach(() => {
  jest.useRealTimers()
  delete global.fetch
})

async function settle() {
  await act(async () => {})
}

it('opens the anonymous editor even when no auth event arrives', async () => {
  render(<AppPage />)
  expect(screen.getByText('Loading editor…')).toBeInTheDocument()
  await settle()
  expect(screen.getByRole('button', { name: /Forge my prompt/ })).toBeInTheDocument()
  expect(screen.queryByText('Loading editor…')).not.toBeInTheDocument()
})

it('times out after eight seconds, ignores late auth results, and retries', async () => {
  let resolveUser
  client.auth.getUser.mockImplementationOnce(() => new Promise(resolve => { resolveUser = resolve }))
  render(<AppPage />)
  await settle()
  await act(async () => { jest.advanceTimersByTime(8000) })
  expect(screen.getByRole('alert')).toHaveTextContent('Loading took too long')
  await act(async () => { resolveUser({ data: { user: null }, error: null }) })
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  await settle()
  expect(screen.getByRole('button', { name: /Forge my prompt/ })).toBeInTheDocument()
})

it('shows an error and retry button on authentication failure', async () => {
  client.auth.getUser.mockResolvedValue({ data: null, error: { message: 'Session unavailable' } })
  render(<AppPage />)
  await settle()
  expect(screen.getByRole('alert')).toHaveTextContent('Session unavailable')
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
})

it('shows an error if loading the profile fails', async () => {
  client.auth.getUser.mockResolvedValue({ data: { user }, error: null })
  client.from().maybeSingle.mockResolvedValue({ data: null, error: { message: 'Profile unavailable' } })
  render(<AppPage />)
  await settle()
  expect(screen.getByRole('alert')).toHaveTextContent('Profile unavailable')
})

it.each(['timeout', 'failure', 'body timeout'])('recovers from API %s with a retry control', async (kind) => {
  client.auth.getUser.mockResolvedValue({ data: { user }, error: null })
  render(<AppPage />)
  await settle()
  if (kind === 'failure') global.fetch.mockRejectedValue(new Error('API unavailable'))
  else if (kind === 'body timeout') global.fetch.mockResolvedValue({ json: () => new Promise(() => {}) })
  else global.fetch.mockImplementation(() => new Promise(() => {}))
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Write a useful prompt' } })
  fireEvent.click(screen.getByRole('button', { name: /Forge my prompt/ }))
  await settle()
  if (kind !== 'failure') await act(async () => { jest.advanceTimersByTime(8000) })
  expect(screen.getByRole('alert')).toHaveTextContent(kind === 'failure' ? 'API unavailable' : 'Loading took too long')
  global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ questions: [{ q: 'Who is the reader?', options: ['Developers'] }] }) })
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  await settle()
  expect(screen.getByText('Who is the reader?')).toBeInTheDocument()
})

it('treats a missing stored auth session as signed out', async () => {
  client.auth.getUser.mockResolvedValue({ data: { user: null }, error: { name: 'AuthSessionMissingError' } })
  render(<AppPage />)
  await settle()
  expect(screen.getByRole('button', { name: /Forge my prompt/ })).toBeInTheDocument()
})


it('offers Google login after the anonymous limit and uses server remaining', async () => {
  render(<AppPage />)
  await settle()
  expect(screen.getByText('2 free tries left — sign in for 5/day')).toBeInTheDocument()
  global.fetch.mockResolvedValue({ ok: false, status: 403, json: async () => ({ error: 'Sign in for more', code: 'LIMIT_ANON', remaining: 0 }) })
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Write a letter' } })
  fireEvent.click(screen.getByRole('button', { name: /Forge my prompt/ }))
  await settle()
  expect(screen.getByText('0 free tries left — sign in for 5/day')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sign in with Google' })).toHaveStyle({ minHeight: '44px' })
  expect(client.from).not.toHaveBeenCalled()
})
