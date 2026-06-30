# AGENTS.md — sloppyxbaby

## Project Identity

Public marketing + product site for **SloppyXBaby Prompt Advocate**, hosted on Cloudflare Pages at `https://sloppyxbaby.com`.

## Build & Run

- Install: `npm install`
- Frontend dev: `npm run dev` (Vite, port 5173 by default)
- Full dev (functions): `npm run pages:dev` (Wrangler Pages)
- Lint/type-check: `npm run lint`
- Deploy: `npm run deploy`

## Architecture

- `src/` — React frontend.
- `functions/api/` — Cloudflare Pages Functions (backend API).
- `public/` — Static assets, SEO files (`robots.txt`, `sitemap.xml`, OG image).
- `docs/` — Reference documentation, especially `LLM_CONTEXT_ENGINEERING_TACTICS.md` and `docs/loop-engineering/`.
- `loops/` — Self-improving agent loop instances (`config.yaml`, `skill.md`, `verifier.py`, `state/`).

## Env / Secrets

Secrets live in `~/env_ssot/master.env` on the host and are bound to Pages via Wrangler secrets:

- `SXB_OPENROUTER_FREE_KEY` — OpenRouter free-tier key
- `SXB_OPENAI_API_KEY` — Central OpenAI key for paid credit-pack users
- `SXB_STRIPE_SECRET_KEY` — Stripe secret key
- `SXB_STRIPE_WEBHOOK_SECRET` — Stripe webhook endpoint secret
- `KONG_KONNECT_TOKEN` — Kong Konnect admin PAT
- `SXB_KV_NAMESPACE_ID` — Cloudflare KV namespace for credits/leads

## Coding Conventions

- TypeScript strict mode.
- Cloudflare Pages Functions use the `onRequest` export pattern.
- Keep frontend stateless; persistence goes to KV or Kong.
- No Express server in production. `server.ts` is legacy dev-only and will be removed.

## Design System

- Soft Premium aesthetic from `plan.md`.
- No purple gradients, no `#6366f1` AI-default indigo, no fake stats.
- Tinted neutrals, solid surfaces, low-arousal UI.

## Third-Party Integrations

- **Macroscope**: GitHub App installed for repo monitoring.
- **Kong Konnect**: API gateway for rate limiting and upstream routing.
- **Stripe**: Checkout sessions + webhook fulfillment.
- **OpenRouter**: Free-tier LLM proxy target.
- **OpenAI**: Paid-tier LLM target.
