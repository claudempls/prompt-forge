import { parseModelJson, buildQuestionsSystemPrompt, buildRefinementSystemPrompt, buildPreferencesContext } from '@shared/prompts'

describe('shared prompt contracts', () => {
  test.each(['lite', 'standard', 'expert', 'compact'])('%s preserves intent and response fields on both platforms', (mode) => {
    for (const desktop of [false, true]) {
      const prompt = buildRefinementSystemPrompt(mode, { desktop })
      expect(prompt).toContain('NO HALLUCINATED SPECIFICS')
      expect(prompt).toContain('SELF-CONTAINED OUTPUT')
      expect(prompt).toContain("PRESERVE THE USER'S INTENT")
      expect(prompt).toContain(desktop ? '"enhancedPrompt"' : '"refined"')
      expect(prompt).not.toContain(desktop ? '"refined_score"' : '"enhancedScore"')
    }
  })

  test('Compact preserves Chinese encoding and the original-language reply directive', () => {
    const prompt = buildRefinementSystemPrompt('compact', { desktop: true })
    expect(prompt).toContain('PRESERVING EVERY INSTRUCTION')
    expect(prompt).toContain('WRITE IN SIMPLIFIED CHINESE')
    expect(prompt).toContain('Czech original     → 用捷克语回复。')
    expect(prompt).toContain("mode's language rules take precedence over preferences")
  })

  test.each(['lite', 'compact'])('%s produces no questions', (mode) => {
    expect(buildQuestionsSystemPrompt(mode)).toContain('{"questions":[]}')
  })

  test.each(['standard', 'expert'])('%s adapts question fields without losing hardened rules', (mode) => {
    const prompt = buildQuestionsSystemPrompt(mode, { desktop: true, category: 'mail' })
    expect(prompt).toContain('DO NOT assume context')
    expect(prompt).toContain('NEVER ask about things the user already specified')
    expect(prompt).toContain('Recipient & Relationship')
    expect(prompt).toContain('"id":"q1","text"')
    expect(prompt).not.toContain('"q":')
  })

  test('personalization includes saved tags only with past sessions', () => {
    const tags = { tone: ['professional'] }
    expect(buildPreferencesContext('Čeština', { tags, sessions: [] })).not.toContain('professional')
    const context = buildPreferencesContext('Čeština', { tags, sessions: [{}] })
    expect(context).toContain('tone: professional')
    expect(context).toContain('Respond in language: Čeština.')
  })
})


test.each([
  '```json\n{"text":"value"}\n```',
  'Commentary: {"text":"a } brace and \\"quote\\"", "nested":{"a":1}} trailing {"ignored":true}',
])('parses fenced or surrounded model JSON: %s', (text) => {
  expect(parseModelJson(text)).toHaveProperty('text')
})
