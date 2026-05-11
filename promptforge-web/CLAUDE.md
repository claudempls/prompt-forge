# PromptForge — CLAUDE.md

## Project Overview
Landing page + web app for PromptForge — a macOS app that transforms rough prompts into precise AI instructions.

**Stack:** Next.js 14 (App Router) · Supabase (Auth + DB) · Vercel deployment

---

## Project Structure

```
app/                    Next.js App Router pages
  layout.js             Root layout, Google fonts (Cormorant Garamond + Inter)
  globals.css           All CSS — dark theme, CSS variables
  page.js               Landing page (assembles section components)
  login/page.js         Google OAuth login
  dashboard/page.js     Protected user dashboard (SSR)
  auth/callback/route.js  Supabase OAuth callback handler

components/             React components
  Nav.jsx               Client component — handles auth state
  Hero.jsx              Landing hero section
  HowItWorks.jsx        3-step explainer
  Features.jsx          Feature grid
  QuickMode.jsx         Quick Mode showcase
  Pricing.jsx           Pricing cards (Free / Pro)
  CTA.jsx               Call to action section
  Footer.jsx            Footer links
  SignOutButton.jsx      Client component — sign out with router.refresh()

lib/supabase/
  client.js             Browser Supabase client (createBrowserClient)
  server.js             Server Supabase client (createServerClient + cookies)

middleware.js           Protects /dashboard — redirects to /login if not authenticated
supabase/schema.sql     DB tables + RLS policies (run in Supabase SQL editor)
static/                 Original static HTML/CSS version (reference only)
__tests__/              Jest tests
```

---

## Design Language
- **Dark theme** — background `#070710`, surface `#10101a`
- **Accent** — amber `#c97d3a` / `#e09a5a`
- **Typography** — Cormorant Garamond (headings, serif) + Inter (body)
- **CSS variables** defined in `app/globals.css` `:root`
- Do not switch to light theme unless explicitly asked

---

## Supabase

### Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profile, auto-created on signup via trigger |
| `waitlist` | Email list signups |
| `prompt_history` | User's recent prompts (max shown: 5) |

### Auth
- Google OAuth only
- Callback: `/auth/callback`
- Protected routes: `/dashboard/*` (via middleware)

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Used by Stripe webhook to bypass RLS
```
Add to `.env.local` locally and Vercel environment variables for production.

---

## Stripe

### Flow
1. User clicks "Upgrade to Pro" → `/upgrade` page
2. Clicks "Subscribe" → POST `/api/stripe/create-checkout` → creates Stripe Checkout Session
3. User pays on Stripe → webhook fires → `profiles.plan` set to `'pro'`
4. Cancelled subscription → `profiles.plan` set back to `'free'`

### Routes
| Route | Purpose |
|-------|---------|
| `GET /upgrade` | Upgrade landing page |
| `GET /upgrade/success` | Post-payment success page |
| `POST /api/stripe/create-checkout` | Creates Stripe Checkout Session (auth required) |
| `POST /api/stripe/webhook` | Handles Stripe events (no auth — uses webhook secret) |

### Environment Variables
```
STRIPE_SECRET_KEY=sk_test_...           # From dashboard.stripe.com → API keys
STRIPE_WEBHOOK_SECRET=whsec_...        # From dashboard.stripe.com → Webhooks
STRIPE_PRO_PRICE_ID=price_...          # Create a $3/month recurring price in Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### Stripe Setup Checklist
1. Create product "PromptForge Pro" in Stripe → Pricing: $3/month recurring → copy `price_...` ID
2. Create webhook endpoint pointing to `https://your-app.vercel.app/api/stripe/webhook`
3. Subscribe to events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
4. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Schema Migration
Run `supabase/migrations/001_stripe_and_model_used.sql` in the Supabase SQL editor to add Stripe columns to `profiles`.

---

## Development

```bash
npm run dev       # localhost:3000
npm test          # Jest — 18 tests across 5 suites
npm test:watch    # Watch mode
npm run build     # Production build
```

---

## Deployment (Vercel)
1. Push to GitHub
2. Import repo in Vercel
3. Add env variables in Vercel → Settings → Environment Variables
4. Add production redirect URL in Supabase:
   `Authentication → URL Configuration → https://your-app.vercel.app/auth/callback`

---

## Supabase MCP Server

Claude Code has the Supabase MCP server configured. This gives direct DB access from within Claude Code conversations.

```bash
# Already added — no need to re-run
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase --access-token <token>
```

Use it to:
- Query tables directly (`profiles`, `waitlist`, `prompt_history`)
- Run schema migrations without opening the Supabase dashboard
- Inspect RLS policies and auth configuration

To run the schema for the first time, use the MCP server or paste `supabase/schema.sql` into the Supabase SQL editor.

---

## Known Limitations / TODO
- "Upgrade to Pro", "Terms", "Privacy Policy" links point to `#` — not yet implemented
- No Stripe integration yet (subscription management)
- No `error.js` / `not-found.js` custom error pages
- No email sending for waitlist
