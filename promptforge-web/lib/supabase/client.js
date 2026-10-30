import { createBrowserClient } from '@supabase/ssr'

function makeStub() {
  const stub = {
    auth: {
      onAuthStateChange: (callback) => {
        let active = true
        queueMicrotask(() => {
          if (active) callback('INITIAL_SESSION', null)
        })
        return { data: { subscription: { unsubscribe: () => { active = false } } } }
      },
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithOAuth: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithOtp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
    },
    from: () => {
      const chain = {
        select: () => chain,
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
        eq: () => chain,
        gte: () => chain,
        lte: () => chain,
        order: () => chain,
        limit: () => chain,
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        then: (resolve) => resolve({ data: [], error: null, count: 0 }),
      }
      return chain
    },
  }
  return stub
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return makeStub()
  return createBrowserClient(url, key)
}
