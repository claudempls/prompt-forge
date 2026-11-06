# PromptForge – Reddit launch plan (v2)

Původní verze: 30. 8. 2026 · Revize: Marketer, 30. 10. 2026
**Stav: NIC NEPOSTOVAT.** Každý post schvaluje Claude zvlášť.

## Co se změnilo proti v1 a proč
1. **Cíl není e-mail, ale aktivace.** Web `/app` už funguje, takže posty vedou na vyzkoušení (1. forge), ne na waitlist. Waitlist zůstává jen pro macOS appku.
2. **Místo 50 subredditů 3 vlny po 4–6 postech** s kill/scale kritérii. 50 postů z jednoho účtu = shadowban a nulová data.
3. **UTM na každý odkaz** (`?utm_source=reddit&utm_campaign=launch1&utm_content=<subreddit>`), jinak nejde poznat, co funguje.
4. **Žádná nepravdivá tvrzení.** Neslibovat vlastní klíče OpenAI/Anthropic/Gemini ani „no account needed“ (viz `COPY-AUDIT.md`).
5. **Validace placení**, ne jen zájmu: v komentářích testovat, za co by lidi zaplatili (Pro 3 USD/měs. je skoro neviditelná cena, otázka je, jestli platí vůbec někdo).

## Blokery před 1. postem (go/no-go)
- [ ] Web běží na produkční doméně a doména `promptforge.ai` je ověřeně naše (jinak všechny odkazy změnit).
- [ ] Opravená copy podle `COPY-AUDIT.md` (body 1–4).
- [ ] Analytika + ukládání `utm_source` u waitlistu a u registrace.
- [ ] `/app` prošlo mobilní kontrolou 375×812 (většina Reddit provozu je z mobilu).
- [ ] Ideálně 1–2 forge bez přihlášení. Pokud ne, v postu férově napsat „needs Google sign-in“.
- [ ] Reddit účet s historií a karmou (nový účet = automatické smazání v polovině subů).

## Ground rules
1. Žádný copy-paste textu. Úvod vždy na míru subredditu.
2. Vždy otevřeně: „I'm building PromptForge.“
3. Hodnota nejdřív, odkaz na konci (nebo jen v komentáři, kde to sub vyžaduje).
4. Self-promo jen v určených vláknech, kde to sub chce.
5. Max 1 post denně, odpovídat na každý komentář do 2 hodin.
6. Žádné alt účty ani domluvené upvoty.

## Vlny a rozhodovací pravidla

**Vlna 1 – feedback od builderů (týden 1):** r/SideProject, r/alphaandbetausers, r/IMadeThis, r/indiehackers, r/microsaas.
**Vlna 2 – power users promptů (týden 2):** r/PromptEngineering, r/ChatGPTPromptGenius, r/ChatGPTCoding (weekly thread), r/AIToolsAndTips (po schválení modů), r/LocalLLaMA (jen technický post: proč Llama 3.3 70B na Groqu).
**Vlna 3 – use-case komunity (týden 3+):** r/copywriting, r/SEO, r/ProductManagement, r/nocode, r/n8n. Jen s konkrétním příkladem prompt před/po z jejich oboru.

**Pokračovat do další vlny, když vlna splní aspoň 2 ze 3:**
- ≥ 150 unikátních návštěv z Redditu,
- ≥ 25 % návštěv dokončí 1. forge,
- ≥ 10 komentářů s konkrétní zpětnou vazbou (ne „nice“).

**Zastavit a předělat positioning, když:** aktivace < 10 % nebo převládá námitka „ChatGPT to umí sám“. Pak upravit hero a otestovat znovu v jiné komunitě, ne přidávat další suby.

## Core post (vlna 1)

Title:

```text
I built a tool that asks you 3 questions before rewriting your prompt. Is that actually better than "improve this prompt"?
```

Body:

```text
I'm building PromptForge. You paste a rough prompt ("write a cold email"), it asks a few quick multiple-choice questions (audience, format, constraints), then rewrites it and shows a before/after quality score.

Why: when I ask ChatGPT to "improve my prompt", it guesses the missing context. I wanted the tool to ask instead.

What's live: web version, 5 free prompts/day (Google sign-in). A macOS app with a global shortcut (Option+Space, rewrites the text field you're in) is coming.

Honest questions:
1. Do the questions feel useful, or like friction?
2. What prompt do you rewrite most often?

Link: https://promptforge.ai/app?utm_source=reddit&utm_campaign=launch1&utm_content=sideproject
Disclosure: I'm the builder.
```

## Value-first post (vlna 2, r/PromptEngineering a spol.)

Title:

```text
The 6 things missing from most prompts I've seen (checklist from building a prompt rewriter)
```

Body: checklist (audience, goal, format, length, constraints, example) se 2 reálnými před/po ukázkami z hero dema. Odkaz jen v posledním řádku nebo v komentáři: „I turned this checklist into a tool, link if anyone wants it.“

## Short comment version

```text
Disclosure: I'm building PromptForge. The approach I'm testing: instead of rewriting your prompt blindly, it asks 2–3 questions about what's missing first. Curious what you do when a prompt keeps giving vague output?
```

## Backlog: 50 subredditů (nepostovat najednou)

Tabulka zůstává jako zásobník. Postuje se jen podle vln níže. Pravidla každého subu ověřit v den postu.

| # | Subreddit | Priority | Safer post type | Suggested title or angle |
|---:|---|---|---|---|
| 1 | r/PromptEngineering | High | Value-first guide | "What I learned turning vague requests into reusable prompts" |
| 2 | r/ChatGPTPromptGenius | High | Full usable prompt plus disclosure | "A prompt checker template I am using before I paste into ChatGPT" |
| 3 | r/PromptDesign | High | Discussion | "Prompt design is mostly deciding what context is missing" |
| 4 | r/aipromptprogramming | High | Tool feedback | "Would a prompt scoring step help AI coding workflows?" |
| 5 | r/ChatGPT | Medium | Discussion, not ad | "What is your fastest way to fix vague ChatGPT output?" |
| 6 | r/ClaudeAI | Medium | Claude workflow angle | "Do you rewrite prompts differently for Claude than ChatGPT?" |
| 7 | r/GeminiAI | Medium | Gemini workflow angle | "Prompt structure differences that matter in Gemini" |
| 8 | r/OpenAI | Medium | Technique post | "Prompt quality checks before model choice" |
| 9 | r/LocalLLaMA | Medium | Local LLM angle | "Do prompt templates help more when running smaller local models?" |
| 10 | r/artificial | Medium | Free AI tools thread or discussion | "Free tools that improve AI workflow without replacing the model" |
| 11 | r/ArtificialInteligence | Medium | Monthly promo thread or discussion | "Testing a free prompt workflow tool, looking for feedback" |
| 12 | r/AI_Agents | Medium | Context-rich discussion | "Prompt quality becomes agent quality once tools and memory are involved" |
| 13 | r/AIToolsAndTips | High | Mod-approved useful post | "Free prompt audit checklist plus tool preview" |
| 14 | r/ChatGPTCoding | High | Weekly self-promotion thread | "Free prompt optimizer for AI coding workflows" |
| 15 | r/MachineLearning | Low | Self-promotion thread only | "Prompt evaluation helper for applied LLM workflows" |
| 16 | r/learnmachinelearning | Low | Learning resource | "How I structure prompts when learning ML concepts with AI" |
| 17 | r/deeplearning | Low | Technical discussion | "Prompt templates for repeatable experiment summaries" |
| 18 | r/LanguageTechnology | Medium | NLP workflow | "Prompt structure as lightweight evaluation criteria" |
| 19 | r/singularity | Low | Broad discussion | "Are prompt tools still useful as models improve?" |
| 20 | r/SideProject | High | Launch feedback | "I built a free early-access prompt tool, looking for brutal feedback" |
| 21 | r/SaaS | High | Builder story | "I am validating a free prompt tool before building the paid product" |
| 22 | r/microsaas | High | Micro-SaaS feedback | "PromptForge: small prompt tool, email waitlist only, what would you charge for later?" |
| 23 | r/SaaSStartups | High | Founder feedback | "Testing traffic-first launch page for a free AI prompt tool" |
| 24 | r/indiehackers | High | Build-in-public | "Trying to validate PromptForge before overbuilding it" |
| 25 | r/startups | Medium | Feedback thread if required | "Pre-launch validation for a prompt workflow tool" |
| 26 | r/Startup_Ideas | Medium | Idea validation | "Would you use a prompt scoring tool before asking AI?" |
| 27 | r/startupideas | Medium | Idea validation | "PromptForge: prompt quality checks as a small SaaS idea" |
| 28 | r/alphaandbetausers | High | Beta invite | "Free beta users wanted for PromptForge" |
| 29 | r/IMadeThis | High | Direct project showcase | "I made a simple tool for improving AI prompts before launch" |
| 30 | r/ProductHunters | Medium | Launch prep | "Feedback before a Product Hunt launch for an AI prompt tool" |
| 31 | r/EntrepreneurRideAlong | Medium | Journey post | "Trying to prove demand for a small AI tool with Reddit traffic first" |
| 32 | r/Entrepreneur | Low | Story without direct link unless allowed | "How would you validate a free AI utility without paid ads?" |
| 33 | r/smallbusiness | Low | Use-case question | "Do small business owners actually use AI prompts for website copy?" |
| 34 | r/growmybusiness | Medium | Growth experiment | "Testing a free AI prompt tool as a lead magnet" |
| 35 | r/ProductManagement | Medium | Product workflow | "Would PMs use prompt templates for specs, research, and stakeholder updates?" |
| 36 | r/UXDesign | Low | UX feedback | "Feedback on a low-friction waitlist for an AI workflow tool" |
| 37 | r/design_critiques | Medium | Page critique | "Critique the landing page for a free prompt tool" |
| 38 | r/marketing | Medium | AI marketing workflow | "What prompt workflows actually save marketers time?" |
| 39 | r/AskMarketing | Medium | Question first | "How would you position a free prompt tool without sounding like AI spam?" |
| 40 | r/DigitalMarketing | Medium | Practical workflow | "Prompt checks for SEO, ads, and content briefs" |
| 41 | r/SEO | Medium | SEO prompt angle | "Do SEO teams use prompt templates for briefs and audits?" |
| 42 | r/bigseo | Low | Advanced SEO process | "Prompt quality criteria for repeatable SEO audits" |
| 43 | r/content_marketing | Medium | Content workflow | "Prompt structures for turning one brief into multiple content formats" |
| 44 | r/copywriting | Medium | Writing quality | "Can prompt structure reduce generic AI copy?" |
| 45 | r/freelanceWriters | Low | Tool skepticism angle | "Do writers want prompt tools, or is that just more AI noise?" |
| 46 | r/nocode | High | Promoted flair or monthly launch post | "Free prompt tool for people building with no-code AI apps" |
| 47 | r/automation | Medium | Workflow discussion | "Prompt quality as the first step in AI automation reliability" |
| 48 | r/rpa | Medium | Business process angle | "Prompt templates for AI-assisted RPA documentation" |
| 49 | r/n8n | Medium | Workflow builders | "Prompt templates for documenting and testing AI workflow nodes" |
| 50 | r/Notion | Low | Template angle | "Prompt templates for Notion-based planning and research" |

## Optional expansion list

Use these only after the first batch: r/productivity, r/webdev, r/web_design, r/learnprogramming, r/software, r/devops, r/sysadmin, r/PPC, r/SocialMediaMarketing, r/solopreneur.

## Tracking (Google Sheet, 1 řádek na post)

```text
Date, Subreddit, Wave, Post URL, Post type, Approved/Removed, Upvotes, Comments, Visits (utm), First forges, Sign-ins, Mac waitlist, Pro upgrades, Top objection, Next action
```

Klíčové poměry: Visits → First forge (aktivace), First forge → návrat do 7 dnů (retence), komentáře s námitkou „ChatGPT umí sám“ (positioning).

## Sources checked

1. r/AIToolsAndTips rules: useful AI-tool posts may be allowed, but self-promotion needs approval and real value.
2. r/ChatGPTPromptGenius rules: promotion must be disclosed and secondary to standalone prompt value.
3. r/AI_Agents rule: posts that only drive users away from Reddit can be removed.
4. r/ChatGPTCoding weekly self-promotion thread: share context, problem, models, audience, and feedback ask.
5. r/nocode rules: disclose promoted posts, use flair, and product launches should use designated launch posts.
6. Current SaaS/startup subreddit guides consistently recommend feedback/story posts over direct ads.
