import { generateQuestions, enhancePrompt } from '../../../src/renderer/src/lib/groq'
import { canUseToday, incrementDailyUsage } from '../../../src/renderer/src/lib/store'

jest.mock('../../../src/renderer/src/lib/store', () => ({
  canUseToday: jest.fn(),
  incrementDailyUsage: jest.fn(),
  getPreferences: jest.fn(async () => ({ tags: {}, sessions: [] })),
}))

describe('desktop direct refinement modes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    canUseToday.mockResolvedValue({ allowed: true })
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({
        enhancedPrompt: '用捷克语回复。', explanation: 'Zkráceno.',
        topicCategory: 'General', originalScore: 3, enhancedScore: 9,
      }) } }] }),
    }))
  })

  test.each(['lite', 'compact'])('%s skips questions and charges exactly once at refinement', async (mode) => {
    expect(await generateQuestions('key', 'Napiš dopis', 'Čeština', 'mail', mode)).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
    expect(incrementDailyUsage).not.toHaveBeenCalled()
    const result = await enhancePrompt('key', 'Napiš dopis', [], {}, 'Čeština', 'mail', mode)
    expect(incrementDailyUsage).toHaveBeenCalledTimes(1)
    expect(result.enhancedPrompt).toBe('用捷克语回复。')
    const request = JSON.parse(fetch.mock.calls[0][1].body)
    expect(request.messages[0].content).toContain('"enhancedPrompt"')
    expect(request.messages[0].content).not.toContain('"refined":')
  })

  test('Compact cannot bypass the daily limit by skipping questions', async () => {
    canUseToday.mockResolvedValue({ allowed: false })
    await expect(enhancePrompt('key', 'prompt', [], {}, 'English', 'auto', 'compact'))
      .rejects.toThrow('Daily limit reached')
    expect(fetch).not.toHaveBeenCalled()
    expect(incrementDailyUsage).not.toHaveBeenCalled()
  })
})
