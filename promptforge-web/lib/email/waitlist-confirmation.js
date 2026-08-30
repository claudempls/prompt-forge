const resendEndpoint = 'https://api.resend.com/emails'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function renderWaitlistConfirmationEmail(email) {
  const safeEmail = escapeHtml(email)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to PromptForge</title>
  </head>
  <body style="margin:0;background:#070710;color:#ece9e3;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070710;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#10101a;border:1px solid rgba(255,255,255,0.1);border-radius:22px;overflow:hidden;">
            <tr>
              <td style="padding:34px 34px 18px;">
                <div style="display:inline-block;color:#e09a5a;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:22px;">PromptForge early access</div>
                <h1 style="margin:0;color:#ece9e3;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:0.98;font-weight:600;">Thanks for joining.</h1>
                <p style="margin:22px 0 0;color:rgba(236,233,227,0.74);font-size:15px;line-height:1.7;">
                  You are on the PromptForge launch list as <strong style="color:#ece9e3;">${safeEmail}</strong>.
                </p>
                <p style="margin:16px 0 0;color:rgba(236,233,227,0.74);font-size:15px;line-height:1.7;">
                  We will send one launch email when early access opens. The first release is focused on turning rough ideas into clearer prompts, checking missing context, and making prompts easier to reuse across AI tools.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 34px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(201,125,58,0.08);border:1px solid rgba(201,125,58,0.22);border-radius:16px;padding:0;">
                  <tr>
                    <td style="padding:18px 20px;color:#ece9e3;font-size:14px;line-height:1.65;">
                      <strong style="color:#e09a5a;">What happens next:</strong><br>
                      1. We finish the public early-access build.<br>
                      2. You get the launch link by email.<br>
                      3. You can try the free version and reply with feedback.
                    </td>
                  </tr>
                </table>
                <p style="margin:22px 0 0;color:rgba(236,233,227,0.48);font-size:12px;line-height:1.6;">
                  You received this because you joined the PromptForge waitlist. If this was not you, ignore this email or contact hello@promptforge.ai.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function renderWaitlistConfirmationText(email) {
  return `Thanks for joining PromptForge.

You are on the launch list as ${email}.

We will send one launch email when early access opens. The first release is focused on turning rough ideas into clearer prompts, checking missing context, and making prompts easier to reuse across AI tools.

If this was not you, ignore this email or contact hello@promptforge.ai.`
}

export async function sendWaitlistConfirmation(email) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.WAITLIST_FROM_EMAIL || 'PromptForge <hello@promptforge.ai>'

  if (!apiKey) {
    return { skipped: true, reason: 'RESEND_API_KEY is not configured' }
  }

  const response = await fetch(resendEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'You are on the PromptForge launch list',
      html: renderWaitlistConfirmationEmail(email),
      text: renderWaitlistConfirmationText(email),
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Resend failed with ${response.status}: ${details}`)
  }

  return { skipped: false }
}
