# PromptForge – audit copy a waitlist CTA (landing)

Autor: Marketer · 30. 10. 2026 · zdroj: `app/page.js`, `components/*.jsx`, `app/layout.js`, `app/api/waitlist`

## Verdikt
Landing prodává dvě věci najednou a část textu slibuje funkce, které produkt nemá. Hlavní problém není styl, ale **konflikt CTA**: hero sbírá e-maily na „early access, který se teprve otevře“, a hned vedle je tlačítko „Try the demo“ na `/app`, které už funguje. Návštěvník z Redditu dostane signál „produkt ještě není“ a zároveň „produkt už je“. To snižuje obě konverze.

## Kritické (opravit před launchem)

| # | Kde | Problém | Oprava |
|---|---|---|---|
| 1 | `Hero.jsx` eyebrow + `WaitlistForm` | Waitlist na produkt, který už běží na `/app`. Waitlist je tření navíc a na Redditu působí jako sběr e-mailů. | Primární CTA = vyzkoušet hned. Waitlist jen pro **macOS appku** (ta opravdu nevyšla). |
| 2 | `Hero.jsx` „Works with“ pills + `Features.jsx` „4 AI providers, one app… Use your own Gemini, OpenAI, Anthropic or Groq API key“ | Kód volá jen Groq (`llama-3.3-70b-versatile`). Vlastní klíč OpenAI/Anthropic/Gemini nejde zadat. Nepravdivé tvrzení = komentáře na Redditu „it's just a Llama wrapper“ a ztráta důvěry. | Změnit na „Prompts work in ChatGPT, Claude, Gemini and local LLMs“ (výstup je text, takže to platí). Pills přejmenovat na „Paste into“. |
| 3 | `Features.jsx` „Or subscribe to Pro“ vs. `FAQ.jsx` „this launch page is only collecting interest“ | Rozpor: Pro existuje (`/upgrade`, limit v `api/refine`), FAQ tvrdí opak. | FAQ přepsat podle reality: free = 5 forgí denně (po přihlášení přes Google), Pro = 3 USD/měs. neomezeně (limit ověřen v `api/refine/route.js`). |
| 4 | `Features.jsx` „Learns your preferences“, „Personalization dashboard“, „Full prompt history… diff… scores“ | Ověřené jen v desktopové appce. Na webu je historie, personalizaci jsem nenašel. | Označit „macOS app“ badge, nebo z webového landingu vyřadit. |
| 5 | Waitlist bez zdroje | `api/waitlist` ukládá jen e-mail, na webu není žádná analytika. Reddit launch tak nepůjde vyhodnotit po subredditech. | Ukládat `source` z `?utm_source=` (sloupec `source text` ve `waitlist`) + jednoduchá analytika (Vercel Analytics / Plausible). **Bez toho nespouštět launch.** |

## Doporučená nová copy (EN, cílovka Reddit)

**Eyebrow:** `Free · 5 prompts a day` (místo „Free early access opens soon“)

**H1:** `Stop rewriting prompts.` / `<em>Answer 3 questions instead.</em>`
Proč: současné „Better prompts, before you ask“ je abstraktní. Mechanismus (otázky → přesný prompt) je jediné, co odlišuje od „just ask ChatGPT to improve it“.

**Sub:** `Paste a rough idea. PromptForge asks what's missing, then rewrites it into a precise prompt for ChatGPT, Claude, Gemini or your local LLM — with a before/after quality score.`

**Primární CTA:** `Forge my first prompt →` → `/app`
**Sekundární:** `See how it works` → `/#how`
**Mikrocopy pod CTA:** `5 free forges a day. Sign in with Google, no API key.`

> Pozor: `/api/refine` vrací `401` bez přihlášení, takže FAQ „Do I need an API key? Not for… the public demo“ a dojem „try the demo“ zavádí. Největší páka na aktivaci z Redditu: **1–2 forge bez přihlášení** (podle IP/cookie), login až u třetího. Návrh pro @Programie, impact vysoký, náklad nízký.

**Waitlist (přesunout do sekce QuickMode + finální CTA):**
- Nadpis: `Get the Mac app first`
- Text: `⌥ Space from any app, improved prompt pasted back. We'll email you once when the signed build is ready.`
- Tlačítko: `Email me the Mac app` (místo „Notify me“ — říká, co dostanu)
- Poznámka: `One email at launch. Nothing else.`

**Finální CTA sekce (`CTA.jsx`):** H2 `Your next prompt is 30 seconds away.` + primární `/app`, waitlist na Mac appku jako druhý řádek.

**FAQ „How is this different from asking ChatGPT to improve my prompt?“** (nejdůležitější námitka):
`ChatGPT guesses what you meant. PromptForge asks first — audience, format, constraints — so the rewrite is based on your answers, not assumptions. You also see a score of what was missing.`

## Meta
- `title`: `PromptForge – turn rough ideas into precise AI prompts` (současný je OK, ale „waste the next AI response“ je delší a slabší pro SERP)
- `og:description`: sjednotit s hero sub, ne „Free early access…“
- Doména `promptforge.ai` je v copy i v Reddit plánu, vlastnictví neověřené → ověřit, jinak je každý odkaz mrtvý.

## Metrika, kterou landing optimalizuje
Ne počet e-mailů. **Aktivace = návštěvník dokončí 1. forge na `/app`.** Cíl pro launch: ≥ 25 % unikátních návštěv z Redditu dokončí forge, ≥ 5 % se vrátí do 7 dnů. E-maily na Mac appku jsou sekundární signál.
