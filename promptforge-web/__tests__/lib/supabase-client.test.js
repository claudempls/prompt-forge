import { createClient } from '@/lib/supabase/client'

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    })),
  })),
}))

describe('Supabase browser client', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...OLD_ENV,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it('creates a client without throwing', () => {
    expect(() => createClient()).not.toThrow()
  })

  it('returns an object with auth methods', () => {
    const client = createClient()
    expect(client.auth).toBeDefined()
    expect(typeof client.auth.getUser).toBe('function')
    expect(typeof client.auth.signOut).toBe('function')
    expect(typeof client.auth.signInWithOAuth).toBe('function')
  })

  it('returns an object with database query methods', () => {
    const client = createClient()
    expect(typeof client.from).toBe('function')
  })
})

it('reports an initial signed-out session without Supabase configuration', async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  try {
    const client = createClient()
    const callback = jest.fn()
    const { data: { subscription } } = client.auth.onAuthStateChange(callback)
    await Promise.resolve()
    expect(callback).toHaveBeenCalledWith('INITIAL_SESSION', null)
    expect(await client.auth.getUser()).toEqual({ data: { user: null }, error: null })
    subscription.unsubscribe()
    const cancelled = jest.fn()
    client.auth.onAuthStateChange(cancelled).data.subscription.unsubscribe()
    await Promise.resolve()
    expect(cancelled).not.toHaveBeenCalled()
  } finally {
    if (url !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = url
    if (key !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = key
  }
})
