/** @jest-environment node */
import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getUsage, assertCanForge, recordForge } from '@/lib/usage'
import { POST as questions } from '@/app/api/questions/route'
import { POST as refine } from '@/app/api/refine/route'
import Groq from 'groq-sdk'

jest.mock('next/headers', () => ({ cookies: jest.fn() }))
jest.mock('@/lib/supabase/admin', () => ({ createAdminClient: jest.fn() }))
jest.mock('@/lib/supabase/server', () => ({ createClient: jest.fn() }))
jest.mock('groq-sdk', () => jest.fn())

const anonId = '12345678-1234-4234-8234-123456789012'
let user, plan, counts, admin, store, queries, complete
const env = { ...process.env }
const request = (body = {}) => ({
  headers: new Headers({ 'x-forwarded-for': '203.0.113.1, 10.0.0.1' }),
  json: async () => ({ prompt: 'Write a letter', ...body }),
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers().setSystemTime(new Date('2026-10-30T23:59:00Z'))
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.test'
  process.env.USAGE_SALT = 'secret'
  process.env.GROQ_API_KEY = 'test'
  user = null; plan = 'free'; counts = {}; queries = []
  store = { get: jest.fn(() => ({ value: anonId })), set: jest.fn() }
  cookies.mockReturnValue(store)
  createClient.mockReturnValue({ auth: { getUser: async () => ({ data: { user }, error: null }) } })
  admin = {
    from: jest.fn((table) => {
      const query = { table, filters: {} }
      queries.push(query)
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn((column, value) => { query.filters[column] = value; return chain }),
        gte: jest.fn((column, value) => { query.since = value; return chain }),
        maybeSingle: async () => ({ data: { plan }, error: null }),
        then: (resolve) => resolve({ count: counts[Object.keys(query.filters).find(k => k !== 'kind')] ?? 0, error: null }),
      }
      return chain
    }),
    rpc: jest.fn().mockResolvedValue({ data: 1, error: null }),
  }
  createAdminClient.mockReturnValue(admin)
  complete = jest.fn().mockResolvedValue({ choices: [{ message: { content: '```json\n{"refined":"A better prompt"}\n```' } }] })
  Groq.mockImplementation(() => ({ chat: { completions: { create: complete } } }))
})
afterEach(() => { process.env = { ...env }; jest.useRealTimers() })

test.each(['anon_id', 'ip_hash'])('anonymous lifetime limit enforced by %s independently', async (column) => {
  counts[column] = 2
  await expect(assertCanForge(request())).rejects.toMatchObject({ status: 403, code: 'LIMIT_ANON', remaining: 0 })
  expect(queries.every(q => !q.since)).toBe(true)
  expect(admin.rpc).not.toHaveBeenCalled()
})

test('anonymous remaining uses stricter identity and hashes the first forwarded IP', async () => {
  counts.ip_hash = 1
  const usage = await assertCanForge(request())
  expect(usage.remaining).toBe(1)
  expect(usage.ipHash).toBe(createHash('sha256').update('203.0.113.1secret').digest('hex'))
  expect(await recordForge(usage)).toBe(1)
  expect(admin.rpc).toHaveBeenCalledWith('record_forge', { p_user_id: null, p_anon_id: anonId, p_ip_hash: usage.ipHash })
})

test('missing cookie gets a server-created secure year-long identity', async () => {
  store.get.mockReturnValue(undefined)
  await getUsage(request())
  expect(store.set).toHaveBeenCalledWith('pf_anon', expect.any(String), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 31536000,
  })
})

test('free gets five per UTC day, independently of prompt history', async () => {
  user = { id: 'user' }; counts.user_id = 4
  expect((await assertCanForge(request())).remaining).toBe(1)
  expect(queries.find(q => q.table === 'usage_events').since).toBe('2026-10-30T00:00:00.000Z')
  counts.user_id = 5
  await expect(assertCanForge(request())).rejects.toMatchObject({ code: 'LIMIT_FREE', status: 403 })
  expect(admin.from).not.toHaveBeenCalledWith('prompt_history')
})

test('pro is unlimited but still records successful forges', async () => {
  user = { id: 'user' }; plan = 'pro'; counts.user_id = 100
  admin.rpc.mockResolvedValue({ data: null, error: null })
  const usage = await assertCanForge(request())
  expect(usage.remaining).toBeNull()
  expect(queries.map(q => q.table)).toEqual(['profiles'])
  expect(await recordForge(usage)).toBeNull()
})

test('questions check without recording, including modes which skip questions', async () => {
  complete.mockResolvedValue({ choices: [{ message: { content: '{"questions":[{"q":"Who?","options":["Team"]}]}' } }] })
  for (const mode of ['lite', 'standard']) {
    const response = await questions(request({ mode }))
    expect(response.status).toBe(200)
    expect((await response.json()).remaining).toBe(2)
  }
  expect(admin.rpc).not.toHaveBeenCalled()
  counts.ip_hash = 2
  const response = await questions(request())
  expect(response.status).toBe(403)
  expect(await response.json()).toMatchObject({ code: 'LIMIT_ANON', remaining: 0 })
})

test('refine records once only after valid output and returns authoritative remaining', async () => {
  const response = await refine(request())
  expect(response.status).toBe(200)
  expect(await response.json()).toMatchObject({ refined: 'A better prompt', remaining: 1 })
  expect(admin.rpc).toHaveBeenCalledTimes(1)
  expect(complete).toHaveBeenCalledWith(expect.objectContaining({ model: 'openai/gpt-oss-20b', reasoning_effort: 'low', response_format: { type: 'json_object' } }))
})

test('signed-in users get the 120b model, anonymous users the 20b model', async () => {
  user = { id: 'user' }; counts.user_id = 0
  admin.rpc.mockResolvedValue({ data: 4, error: null })
  expect((await refine(request())).status).toBe(200)
  expect(complete).toHaveBeenLastCalledWith(expect.objectContaining({ model: 'openai/gpt-oss-120b' }))
})

test('failed generation does not count and concurrent final limit returns 403', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {})
  complete.mockRejectedValueOnce(new Error('provider failed'))
  expect((await refine(request())).status).toBe(500)
  expect(admin.rpc).not.toHaveBeenCalled()
  admin.rpc.mockResolvedValue({ data: null, error: { message: 'LIMIT_ANON' } })
  const response = await refine(request())
  expect(response.status).toBe(403)
  expect(await response.json()).toMatchObject({ code: 'LIMIT_ANON', remaining: 0 })
  log.mockRestore()
})

test('missing service credentials fails open in development, closed in production', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  process.env.NODE_ENV = 'development'
  expect((await assertCanForge(request())).remaining).toBe(2)
  expect(warn).toHaveBeenCalled()
  process.env.NODE_ENV = 'production'
  await expect(assertCanForge(request())).rejects.toMatchObject({ status: 503 })
  warn.mockRestore()
})
