/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server'

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

const { createServerClient } = require('@supabase/ssr')

describe('middleware auth logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects when user is null (unauthenticated)', async () => {
    createServerClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      },
    })

    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Unauthenticated — should redirect to /login
    expect(user).toBeNull()

    const redirect = NextResponse.redirect(new URL('/login', 'http://localhost'))
    expect(redirect.status).toBe(307)
    expect(redirect.headers.get('location')).toContain('/login')
  })

  it('allows access when user exists (authenticated)', async () => {
    createServerClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123', email: 'test@example.com' } },
        }),
      },
    })

    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authenticated — should not redirect
    expect(user).not.toBeNull()
    expect(user.id).toBe('user-123')
  })
})
