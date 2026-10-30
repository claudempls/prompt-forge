// Single source of truth for plan copy shown on the landing and /upgrade.
// Keep in sync with the server-side limits in app/api/refine and app/api/questions.
export const ANON_FREE_FORGES = 2
export const FREE_DAILY_FORGES = 5 // decision 3 in ROADMAP.md (3/day) is still pending
export const PRO_MONTHLY_PRICE = '€4.99'
export const PRO_YEARLY_PRICE = '€39'
// Flip to true once the yearly Stripe price ID is wired into /api/stripe/create-checkout.
export const YEARLY_CHECKOUT_AVAILABLE = false
