# PromptForge

PromptForge turns rough ideas into precise AI prompts. It asks a few clarifying questions, then rewrites the prompt and scores its quality before and after. The AI runs on Groq (`llama-3.3-70b-versatile`).

## What's in this repo

| Path | What it is |
|---|---|
| `src/` | macOS desktop app (Electron, electron-vite, React, TypeScript, Tailwind) |
| `promptforge-web/` | Landing page and web app (Next.js 14, Supabase, Stripe, Groq). See its own README. |
| `shared/prompts/` | System prompts shared by the desktop app and the web API |

## Modes

`lite` polishes the prompt without asking questions, `standard` asks 3–5 questions, `expert` asks 6–10, and `compact` produces the lowest-token output with no questions. On the web you can type a prefix like `/expert` to pick a mode.

## Desktop app

```bash
npm ci
npm run dev      # start the app in dev mode
npm run build    # production build into out/
npm run dist     # build a .dmg into release/ (macOS only)
```

On first launch the app asks for your own Groq API key, which is stored locally. Sign-in works with Google (through Supabase) or email and password. `Alt+Space` opens Quick Mode, which improves the prompt and copies the result to the clipboard.

## Web

```bash
cd promptforge-web
npm ci
cp .env.local.example .env.local   # fill in the keys
npm run dev                        # http://localhost:3000
npm test
```

Deployment and the Supabase and Stripe setup are covered in `promptforge-web/README.md`.
