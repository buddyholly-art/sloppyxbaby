# SloppyXBaby Landing Page Redesign — Design Spec

## 1. Objective

Redesign the `LandingPage.tsx` at sloppyxbaby.com to be:

- Mobile-first and thumb-friendly.
- Distinctly branded with a sassy, editorial personality.
- Premium, not hollow — intentional negative space, tactile surfaces, and a gold dripping “X” brand mark.
- Clear about what to do next, using an intent router where the lucrative prompt-compiler path is dominant.
- SEO-optimized and evidence-based, peacocking ADHD/AuDHD and prompt-engineering research.
- Honest about the full workspace — the 15 internal tools are surfaced, not hidden.

## 2. Audience

**Primary:** ADHD / AuDHD “vibe coders” — developers who use AI to build but struggle with context loss, initiation paralysis, sensory overload, and generic AI output.

**Secondary:** Any distracted builder. The product is ADHD-informed, not ADHD-exclusive. Copy uses inclusive language like “distracted builders” and “brains that lose the thread.”

## 3. Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Nav (floating pill, mobile hamburger)                      │
├─────────────────────────────────────────────────────────────┤
│  Hero / Intent Router                                       │
│  “What brings you here?”                                    │
│  ┌─────────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │ Fix my prompt   │ │ Less generic  │ │ Learn tactics │   │
│  │   (dominant)    │ │               │ │               │   │
│  └─────────────────┘ └───────────────┘ └───────────────┘   │
│  “Not sure? Browse the full story →”                        │
├─────────────────────────────────────────────────────────────┤
│  Chosen-path section (one of three mini-flows)              │
├─────────────────────────────────────────────────────────────┤
│  Gravitas / Evidence strip (rotating expert quote + TCO)    │
├─────────────────────────────────────────────────────────────┤
│  Pricing                                                    │
├─────────────────────────────────────────────────────────────┤
│  Magazine sections (escape hatch)                           │
│  - Manifesto                                                │
│  - Founder truth                                            │
│  - Evidence basis / Expert carousel                         │
│  - “What’s inside the workspace” service grid               │
│  - Tactics teaser                                           │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
└─────────────────────────────────────────────────────────────┘
```

## 4. Visual Language

### Palette

| Role | Value | Usage |
|------|-------|-------|
| Canvas | `#F2F2F0` warm cream | page background |
| Canvas-2 | `#E8E8E5` | secondary surfaces |
| Ink | `#0A0A0A` | headings, primary text |
| Muted | `#57575A` | body, secondary text |
| Sage | `#1F4D3F` | primary CTA, success states |
| Sage glow | `#5A8C7A` | hover, ambient accents |
| Gold | `#D4AF37` | dripping “X” brand mark, premium highlights |
| Neon pink | `#FF2E7D` | hover/focus sparks, cheeky badges |
| Hairline | `rgba(10,10,10,0.08)` | borders |

### Typography

- **Display + body:** Plus Jakarta Sans (400–800).
- **Mono:** JetBrains Mono for tags, code, metrics.
- Hero H1: `clamp(40px, 6vw, 72px)`, `letter-spacing: -0.035em`, `line-height: 1.05`.
- Body minimum `16px` on mobile.
- Eyebrow tags: mono, uppercase, `letter-spacing: 0.18em`, `11px`.

### Surfaces & Texture

- Subtle paper-grain overlay so empty space feels intentional, not hollow.
- Double-bezel cards (`card-shell` + `card-core`) remain.
- Gold dripping “X” mark: a single SVG with a slow, looping drip animation. Keep it restrained — no cartoonish wobble.
- Neon pink reserved for hover states, focus rings, and small “slop-free zone” badges.

## 5. Sections

### 5.1 Nav

- Floating pill nav, sticky at `top: 16px` on desktop.
- On mobile: hamburger menu or compact pill that scrolls horizontally.
- Links: Tactics, Workspace, Pricing.

### 5.2 Intent Router Hero

**Headline**

> Your ideas are good. Your prompts are sloppy. Let’s clean them up.

**Subhead**

> A context-engineering workspace built from ADHD/AuDHD research. Low-arousal, high-clarity, and designed for brains that lose the thread.

**Cards**

Three tappable cards. The first is visually dominant (larger, gold accent border).

1. **“Fix my sloppy prompt”**
   - Sub: *Paste the brain dump. We turn scattered thoughts into a clean, machine-readable spec — whether you’re distracted, exhausted, or just not a prompt engineer.*
   - CTA: *Try it free*
   - Leads to: inline prompt input + generate button.

2. **“Make my AI output less generic”**
   - Sub: *Stop sounding like every AI slop template. We inject your constraints, voice, and guardrails so the model sounds like you.*
   - CTA: *See the difference*
   - Leads to: before/after slop slider + tactics teaser.

3. **“Learn the tactics”**
   - Sub: *Get the free cheatsheet. Built on working-memory research used in ADHD support — and useful for anyone whose context window is smaller than ChatGPT’s.*
   - CTA: *Send me the cheatsheet*
   - Leads to: email capture form.

**Escape hatch**

> Not sure? Browse the full story →

Scrolls to the magazine sections.

### 5.3 Chosen-path section

Only one path renders at a time based on the selected card. The section is revealed with a smooth scroll and a reveal animation.

- **Fix my prompt:** large textarea, model selector (if available), “Generate” button, result card showing the advocate prompt and score.
- **Less generic:** side-by-side before/after cards showing a “sloppy prompt” and the “baby-smooth” version.
- **Learn tactics:** email input + submit, plus a preview of three tactics from `LLM_CONTEXT_ENGINEERING_TACTICS.md`.

### 5.4 Gravitas / Evidence strip

A compact, rotating banner that peacocks expertise.

**Format:**

> “ADHD is an executive function deficit. Guidance must be externalized, visual, and rollback-safe.”
> — Russell Barkley, Medical University of South Carolina
>
> SloppyXBaby turns that into the **SSOT Auditor** and **Risk Dashboard**.

**Experts to rotate**

| Expert | Institution | Quote ties to |
|--------|-------------|---------------|
| Russell Barkley | Medical University of South Carolina | SSOT Auditor, Risk Dashboard, guardrails |
| Alan Baddeley | University of York Working Memory Model | Memory Vault, session restoration |
| Winnie Dunn | University of Kansas Medical Center | Low-arousal UI, sensory-safe design |
| CAST UDL Guidelines | CAST Center for Applied Special Technology | One clear default next step |
| Andrej Karpathy | OpenAI / Tesla | TCO board, cost/cache/maintenance calculus |

**TCO consequence card**

Beside or below the quote, show one TCO vector (Money / Space / Maintenance) from `authoritySsot.ts` tied to the active expert.

### 5.5 Pricing

Keep the three-tier pricing cards, but visually crown the Credit Pack.

- **Free Taste** — $0, 10 generations/day.
- **Credit Pack** — $5, 50 premium generations, GPT-4 class models.
- **Bring Your Own Key** — free, full workspace access.

Mobile: swipeable carousel instead of a tall vertical stack.

### 5.6 Magazine sections (escape hatch)

For visitors who chose “Browse the full story,” the page continues with high-gravitas editorial content.

#### 5.6.1 Manifesto

Headline: *Built for distracted builders.*

Body:

> Everyone is distracted. Notifications, context switching, and shiny-object syndrome make every builder’s working memory smaller than the model they’re prompting. SloppyXBaby is a context-engineering workspace designed from ADHD/AuDHD research — externalized memory, sensory-safe surfaces, and one clear next step — so you can vibe-code without the slop.

#### 5.6.2 Founder truth

A high-contrast editorial block that explains *why* this exists. Authentic, not polished into corporate speak.

> *“Vibe coding is an AuDHD recipe for disaster in the most addictive pill. Shiny-thing syndrome, but make EVERYTHING shiny?! So if we care so much about it, how does it turn into AI slop? I have ADHD and autism and I spent 2 years and hundreds monthly on AI, and this is what I came up with to write good, Karpathy-level code.”*
>
> — SloppyXBaby founder

This block sits between the hero and the evidence strip, or as the first magazine section. It turns the product from a tool into a mission.

#### 5.6.3 Evidence basis

Expand the rotating expert quotes into a static grid of 4–5 authority cards, each with:

- Expert name + institution
- Pull quote
- One sentence linking the research to a workspace feature

#### 5.6.4 What’s inside the workspace

A bento grid grouping the 15 workspace tools:

**Start**
- Prompt Compiler
- Agent Interface Chat
- Repo Scaffold
- Repo Architect

**Protect**
- Security Scanner
- Risk Dashboard
- SSOT Auditor
- Refinement Loop

**Remember**
- Memory Vault
- File Tree Viewer
- Vector RAG

**Level up**
- Working Memory Playground
- Cost Board
- Quote Banner
- Onboarding Scaffold

Each card has a one-line description and a link to `/app`.

#### 5.6.5 Tactics teaser

Headline: *The tactics that separate decent prompts from great ones.*

List 4–5 tactics from `LLM_CONTEXT_ENGINEERING_TACTICS.md` with micro-copy:

- XML Structural Delimiters
- Context Positioning & Decay
- Chain-of-Verification
- Anti-Sycophancy
- Uncertainty Calibration

CTA: *Read the full tactics guide →* (links to `/tactics`)

## 6. Mobile Behavior

- Hero cards stack vertically. The first card is full-width and slightly taller.
- Textareas and inputs get `min-h-[48px]`, `16px` font, and full-width touch targets.
- Sticky bottom CTA appears after a card is selected: *“Fix my prompt — $5 for 50 premium runs”*.
- Pricing cards become a swipeable carousel.
- Ambient mesh is simplified on mobile (one blob, lower opacity).
- Nav collapses to a hamburger or horizontal-scroll pill.
- No horizontal page scroll.

## 7. Interactions & Motion

- Gold drip SVG: slow, continuous loop (`18s` cycle). Pause on `prefers-reduced-motion`.
- Intent cards: lift + subtle gold glow on hover/focus; selected card gets a persistent gold border.
- Scroll reveals: elements fade up (`translateY(16px) blur(4px) opacity(0)` → none) via IntersectionObserver.
- Sticky CTA: morphs label based on selected intent.
- Button micro-interactions: scale `0.98` on active, icon nudges on hover.

## 8. SEO & Metadata

- **Title:** *SloppyXBaby — Prompt Engineering for Distracted Builders*
- **Meta description:** *Paste a sloppy prompt and get a structured, context-engineered prompt back. Built from ADHD/AuDHD research for builders who are tired of generic AI slop.*
- **OG title:** *SloppyXBaby — Prompt Engineering for Distracted Builders*
- **OG description:** *Fix sloppy prompts, stop generic AI output, and learn evidence-based context engineering tactics.*
- **Keywords:** prompt engineering, fix my prompt, anti ai slop, prompt compiler, ADHD productivity, AuDHD, context engineering, working memory, executive function.

## 9. Content Sources

- Expert quotes and TCO vectors: `src/lib/authoritySsot.ts`
- Prompt tactics: `docs/LLM_CONTEXT_ENGINEERING_TACTICS.md`
- Additional quotes: `functions/api/quotes.ts`
- ADHD research corpus: `~/Documents/ADHD_Unified_V3/` and `~/Documents/Playground/ADHD & Neuro-Adaptive EBP Framework_sources/`

## 10. Implementation Notes

- File to edit: `src/pages/LandingPage.tsx`.
- Reuse existing Tailwind theme tokens in `src/index.css`.
- Add new CSS classes only if necessary; prefer existing `card-shell`, `card-core`, `btn-pill`, `btn-ghost`, `eyebrow` utilities.
- The gold drip “X” should be an inline SVG to avoid external asset dependencies.
- Keep the existing API endpoints (`/api/generate-prompt`, `/api/checkout`, `/api/lead`).
- New route behavior: clicking an intent card updates local state and smooth-scrolls to the chosen-path section.
- Add a `useEffect` IntersectionObserver for scroll reveals, mirroring the pattern in `Workspace.tsx`.
