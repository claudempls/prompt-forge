# PromptForge Web

This is the landing page (waitlist) and web app for PromptForge, built with Next.js 14 (App Router), Supabase (Google OAuth and Postgres), Groq, Stripe and Resend. The AI system prompts are imported from `../shared/prompts` through the `@shared` alias.

## Pages and API

| Route | Purpose |
|---|---|
| `/` | Landing page with the waitlist form |
| `/app` | Web version of the prompt tool (free plan is limited to 5 prompts a day) |
| `/dashboard` | Prompt history (requires sign-in) |
| `/login` | Google sign-in |
| `/upgrade`, `/upgrade/success` | Pro upgrade through Stripe Checkout |
| `/privacy`, `/terms` | Legal pages |
| `POST /api/questions`, `POST /api/refine` | Clarifying questions and refinement (Groq) |
| `GET /api/history` | User's prompt history |
| `POST /api/waitlist` | Saves a waitlist signup and sends a confirmation email |
| `POST /api/stripe/create-checkout`, `POST /api/stripe/webhook` | Pro subscription |

## Development

```bash
npm ci
cp .env.local.example .env.local
npm run dev     # http://localhost:3000
npm test        # Jest
npm run build
```

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side usage, Stripe webhook and waitlist
GROQ_API_KEY=
GROQ_MODEL=                          # optional; defaults to openai/gpt-oss-120b
GROQ_ANON_MODEL=                     # optional; signed-out users, defaults to openai/gpt-oss-20b
USAGE_SALT=                          # random server-only secret for anonymous IP hashing
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=                # €4.99/month recurring price
STRIPE_PRO_YEARLY_PRICE_ID=         # €39/year recurring price (POST /api/stripe/create-checkout {"interval":"year"})
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=                     # optional; without it the signup is saved and email_sent is false
WAITLIST_FROM_EMAIL="PromptForge <hello@promptforge.ai>"
```

Usage is enforced by the server: anonymous visitors get 2 lifetime forges (secure HTTP-only cookie plus salted IP hash), signed-in free users get 5 per UTC day, and Pro is unlimited. Only successful refinements count; questions and deletable history do not. Missing service-role configuration allows requests with a warning in development and returns 503 in production. Anonymous usage also requires `USAGE_SALT`. Deploy behind a trusted proxy that replaces `x-forwarded-for`. The anonymous cookie requires HTTPS.

## Supabase

Run `supabase/schema.sql` and then `supabase/migrations/001_stripe_and_model_used.sql` and `supabase/migrations/002_lock_plan_and_server_usage.sql` in the SQL editor. Add `https://<domain>/auth/callback` to the redirect URLs.

## Stripe

Create a "PromptForge Pro" product at $3/month and copy its `price_...` ID. Point a webhook at `https://<domain>/api/stripe/webhook` with the events `checkout.session.completed`, `customer.subscription.updated` and `customer.subscription.deleted`.

## Deployment (Vercel)

Import the repo into Vercel with Root Directory `promptforge-web` and keep "Include files outside the root directory" turned on, because the build needs `../shared`. Then fill in the environment variables.
