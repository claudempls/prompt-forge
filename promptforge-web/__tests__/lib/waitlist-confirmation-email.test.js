import {
  renderWaitlistConfirmationEmail,
  renderWaitlistConfirmationText,
} from '@/lib/email/waitlist-confirmation'

describe('waitlist confirmation email', () => {
  it('renders the confirmation HTML', () => {
    const html = renderWaitlistConfirmationEmail('test@example.com')

    expect(html).toContain('PromptForge early access')
    expect(html).toContain('Thanks for joining.')
    expect(html).toContain('test@example.com')
    expect(html).toContain('What happens next:')
  })

  it('escapes the email address in HTML', () => {
    const html = renderWaitlistConfirmationEmail('bad@example.com"><script>')

    expect(html).toContain('bad@example.com&quot;&gt;&lt;script&gt;')
    expect(html).not.toContain('bad@example.com"><script>')
  })

  it('renders plain text fallback', () => {
    const text = renderWaitlistConfirmationText('test@example.com')

    expect(text).toContain('Thanks for joining PromptForge.')
    expect(text).toContain('test@example.com')
  })
})
