# AuDHD Prompt Advocate — Anti-Slop Redesign Plan

## Objective
Full visual overhaul of the AuDHD Vibe Coding Prompt Advocate from dark-mode AI-dashboard slop to Apple-tier Soft Premium aesthetic, while removing all Gemini easter eggs and making the app LLM-agnostic.

## Source Design System (Soft Premium — from SKILL (4).md + example.html)

### Palette
- **Canvas**: `#F2F2F0` (warm silver-grey) or `#FDFBF7` (warm cream)
- **Canvas-2**: `#E8E8E5`
- **Ink**: `#0A0A0A` (zinc-950 off-black) — replaces all pure black
- **Ink-2**: `#18181B`
- **Muted**: `#57575A`
- **Accent**: `#1F4D3F` (deep sage) — REPLACES all `#6366f1` indigo
- **Accent-glow**: `#5A8C7A`
- **Hairline**: `rgba(10,10,10,0.08)` / `rgba(10,10,10,0.12)`
- **Innerlight**: `rgba(255,255,255,0.65)`

### Typography
- **Display + Body**: Plus Jakarta Sans (400-800) — REPLACES Inter + Space Grotesk
- **Mono**: JetBrains Mono (400-500) — keep, but elevated
- **Display sizing**: `clamp(48px, 7vw, 96px)`, `letter-spacing: -0.035em`, `line-height: 0.96`, weight 700+
- **Eyebrow tags**: mono, uppercase, `letter-spacing: 0.2em`, `text-[10px]`

### Surfaces
- **Double-bezel mandatory**: outer shell (`p-1.5`, hairline border, soft outer shadow) + inner core (concentric smaller radius)
- **Squircle radii**: `28px-40px` on major surfaces (`rounded-[2rem]` to `rounded-[2.5rem]`)
- **Shadows**: diffuse, wide-spread, low-opacity only (`0 20px 40px -15px rgba(0,0,0,0.05)`)
- **Borders**: `border-black/5` / `ring-1 ring-black/5` — NO generic 1px solid gray

### CTAs
- **Button-in-button**: full pill (`rounded-full px-6 py-3`), trailing arrow inside its own circular wrapper flush-right
- Active: outer scales `0.98`, inner icon translates `(+1px, -1px)` and `scale(1.05)`

### Motion
- **Default ease**: `cubic-bezier(0.32, 0.72, 0, 1)` minimum 700ms
- **Spring**: `cubic-bezier(0.16, 1.16, 0.3, 1)`
- **Scroll entry**: `translateY(16px) blur(8px) opacity(0)` → `translateY(0) blur(0) opacity(1)` via IntersectionObserver
- **NO**: `linear`, `ease-in-out`, animating width/height/top/left

### Ambient
- One slow-drifting radial mesh blob behind hero, `opacity <= 0.18`, `pointer-events: none`, fixed

---

## Banned from Current Design (per user's own anti-slop rules + skill)
- `#6366f1` indigo / purple gradients / AI-default glows
- Inter, Space Grotesk, Roboto, Helvetica fonts
- Generic 1px solid gray borders
- `shadow-md`, `shadow-lg`, hard drop shadows
- Edge-to-edge sticky navbars (use floating glass pill)
- Gradient text (`text-transparent bg-clip-text bg-gradient-to-r`)
- Hero-metric cliches (big number + small label + sparkline)
- Nested cards (cards-within-cards)
- Emojis in UI (remove all 🧠 ⚡ 🔒 etc. from headers/buttons/labels)
- `text-[9px]` / `text-[10px]` dense uppercase tracking-widest spam
- `h-screen` (use `min-h-[100dvh]`)
- Bounce/elastic animations
- Pure black `#000`
- Gemini-specific branding, "Gemini" references, Google AI branding
- Fake metrics / fake stats

---

## Execution Stages

### Stage 1: Foundation (index.css, index.html, App.tsx)
- Replace entire color system in index.css
- Replace font imports (Plus Jakarta Sans + JetBrains Mono)
- Redesign App.tsx shell: floating pill nav, cream canvas, ambient mesh
- Redesign stage selector buttons with double-bezel pattern
- Remove emojis, gradient text, indigo accents
- Make LLM-agnostic (remove Gemini branding)

### Stage 2: View Components (parallel batches)
Batch 1 (independent):
- **LlmOsPromptCompiler.tsx** — Main prompt compiler workspace
- **LlmOsCoreInterface.tsx** — Chat interface

Batch 2 (independent):
- **DataFlywheelGuard.tsx** — Security scanner
- **DataFlywheelAcademy.tsx** — Educational sandbox

Batch 3 (independent):
- **VibeRepoCenter.tsx** + **VibeOnboardingScaffold.tsx** + **VibeRepoArchitect.tsx** — Repo scaffolding
- **RiskMitigationDashboard.tsx** — Risk dashboard

Batch 4 (independent):
- **SovereignInsight.tsx** — Quote banner
- **GravitasBoard.tsx** — TCO metrics
- **RefinementLoop.tsx** — Refinement loop
- **MemoryManager.tsx** — Memory vault
- **ImpulsivityShield.tsx** — SSOT auditor
- **SkeletonViewer.tsx** — File tree viewer

### Stage 3: Utility/Server Updates
- **server.ts** — Remove Gemini-specific system prompt language, make LLM-agnostic
- **types.ts** — No visual changes needed
- **authoritySsot.ts** — Update colors if any
- **skillSpectorEngine.ts** — No visual changes
- **googleDrive.ts** — No visual changes

---

## LLM Agnosticism Changes
- Replace "Gemini" references with generic "LLM" / "model"
- Remove Google AI branding
- Remove "Karpathy" worship language (keep the principles, lose the hero worship)
- Make API key references generic
- Remove any model-specific easter eggs
