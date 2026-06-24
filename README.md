# sloppyxbaby.com

**SloppyXBaby Prompt Advocate** — a conversion-focused, anti-AI-slop prompt engineering workspace for developers who are tired of generic LLM output.

Live at: https://sloppyxbaby.com

## What It Does

- **Free Taste**: Paste a sloppy prompt, get a structured, context-engineered prompt back.
- **LLM Context Engineering Tactics**: Built-in guidance from the research-backed tactics doc (XML delimiters, context positioning, Chain-of-Verification, uncertainty calibration, dynamic context editing).
- **Paid Upgrade**: Stripe credit packs or bring-your-own OpenAI key for premium model access.

## Tech Stack

- Frontend: Vite + React 19 + Tailwind CSS 4
- Hosting: Cloudflare Pages
- API: Cloudflare Pages Functions (`/functions/api/*`)
- Gateway: Kong Konnect (rate limiting + free/paid upstream routing)
- Payments: Stripe Checkout + Cloudflare KV credit tracking
- Repo Monitoring: [Macroscope](https://app.macroscope.com)

## Local Development

```bash
npm install
npm run dev        # Vite dev server (frontend only)
npm run pages:dev  # Wrangler Pages dev (frontend + functions)
```

## Deploy

```bash
npm run deploy
```

## Repo Guide for Agents

See [`AGENTS.md`](./AGENTS.md) for build commands, env conventions, and contribution rules.
