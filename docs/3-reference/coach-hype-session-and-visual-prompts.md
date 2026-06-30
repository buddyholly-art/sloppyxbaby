---
title: Coach Hype Session Handoff and Visual Prompt Kit
doc_id: reference-coach-hype-session-visual-prompts
triadic_leg: diataxis
diataxis_mode: lookup
canonical_path: docs/3-reference/coach-hype-session-and-visual-prompts.md
status: active
owner: shared
last_reviewed: 2026-06-30
canonical: true
related_docs:
  - docs/LLM_CONTEXT_ENGINEERING_TACTICS.md
  - docs/WORKLOG.md
---

# Coach Hype Session Handoff and Visual Prompt Kit

Session date: **2026-06-30**. Covers the Claude-session resume work, React port of Open Designer artifacts, Coach Hype persona infusion, deploys, and image-generation prompts for compositing Oliver's photo into Coach Hype graphics.

## Session outcomes

| Commit | Summary | Live |
|--------|---------|------|
| `24d5568` | Builder's Code page (`/the-code`) + AuDHD landing infusion | [sloppyxbaby.com/the-code](https://sloppyxbaby.com/the-code) |
| `a8c2407` | Deep links, redirects, metadata fixes, fake stats removed | [sloppyxbaby.com](https://sloppyxbaby.com) |
| `ca946ff` | Coach Hype Smart Friend persona across landing + Code | both URLs |

### Key discovery

Open Designer `.dc.html` artifacts (`The Builders Code.dc.html`, `sloppyxbaby.dc.html`) were **never committed to git**. All work was ported into the React app:

- `src/pages/BuildersCodePage.tsx` — 12-concept runnable self-audit at `/the-code`
- `src/pages/LandingPageManual.tsx` — AuDHD hero, evidence carousel, mission section
- `src/lib/coachHype.ts` — mission, pain points, Builder concept lessons
- `src/components/CoachHypeLesson.tsx` — lesson card UI (CH monogram)
- `src/components/CoachHypeMission.tsx` — landing `#mission` section
- `src/App.tsx` — route + legacy redirects (`/prompt-compiler`, `/ssot-auditor`, etc. → `/app?stage=…`)
- `src/Workspace.tsx` — reads `?stage=` for deep links

### Persona rules (Coach Hype)

Voice source: Smart Friend comedic persona (`ai_comedic_persona_gdrive copy.txt`). Cognitive thesis source: `AuDHD and LLM Cognitive Analogs (1).md`.

**Do:**

- Relatable hook → optional tangent → cited pivot
- Every stat tied to a named source (Barkley, Liu, CatAttack, monotropism, Baron-Cohen, etc.)
- Tagline: *"Smart friend energy. Zero toxic positivity. Every punchline lands on a citation."*

**Do not:**

- Toxic motivational-speaker / hustle-bro rhetoric
- Purple gradients, `#6366f1` indigo, fake aggregate ratings
- Unsourced stats or vibes-only claims

### Design tokens (graphics + UI)

| Token | Value | Use |
|-------|-------|-----|
| Canvas | `#F2F2F0` / `#FDFBF7` | Backgrounds |
| Ink | `#0A0A0A` | Text, outlines |
| Sage | `#1F4D3F` | Primary accent |
| Gold | `#D4AF37` | Coach Hype badge, highlights |
| Pink | `#FF2E7D` | Sparingly, CTA accent |
| Hairline | `rgba(10,10,10,0.08)` | Borders |

Typography in product: Plus Jakarta Sans (display/body), JetBrains Mono (stats/cites).

---

## Visual compositing prompt kit

Use these prompts with `image_gen` (new scene) or `image_edit` (composite Oliver's reference photo into scene). All scenes reserve a **right-third or lower-right composition zone** (~35% width) for the human cutout.

### Character brief (Coach Hype in scenes)

Coach Hype is a **Smart Friend teacher**, not a gym coach. Warm, slightly irreverent, research-literate. Visual identity:

- Small **CH** gold monogram badge (matches `CoachHypeLesson.tsx`)
- Palette: cream canvas, sage accents, gold highlights, ink typography
- Setting: editorial / studio / classroom-meets-workshop — never stadium, never neon hustle
- Expression: engaged explainer, one eyebrow optionally raised, approachable not performative

### Scene A — Citation Desk

**Aspect:** 16:9 (hero) or 4:5 (social)

**Scene prompt:**

```
Editorial illustration, soft premium aesthetic. Warm cream studio (#FDFBF7) with sage (#1F4D3F) accents and gold (#D4AF37) highlights. A minimalist teacher's citation desk: stacked research papers with visible author names (Barkley, Liu, Baddeley), a small gold CH monogram plaque, JetBrains Mono-style stat callouts on cards. Left two-thirds filled with desk and typography; right third intentionally empty negative space with subtle floor shadow for compositing a person. Soft diffused lighting, no purple, no indigo #6366f1, no motivational poster clichés. Photoreal-adjacent 3D render or high-end editorial photo style.
```

**Composite (`image_edit`):**

```
Place the subject from the reference photo into the empty right-third of the scene, standing beside the citation desk, waist-up, facing slightly left toward the desk. Match warm cream lighting, soft shadow on floor, natural scale. Preserve subject identity exactly. Output PNG with transparent background around subject only if cutout mode; otherwise blend into scene.
```

### Scene B — Attention Tunnel

**Aspect:** 16:9

**Scene prompt:**

```
Abstract monotropism visualization on warm silver-grey canvas (#F2F2F0). A single luminous sage-green attention tunnel converging to center; peripheral elements blurred and greyed. Floating mid-context text fragments fading out (lost-in-the-middle metaphor). Gold CH badge floating near tunnel mouth. Left and center busy; right 35% clean negative space for human compositing. Calm, low-arousal, Apple-tier soft premium — no cyberpunk neon, no purple gradients.
```

**Composite (`image_edit`):**

```
Insert subject from reference at right edge, pointing or gesturing toward the attention tunnel, engaged explainer pose. Match soft ambient light, subtle rim light from tunnel. Identity preserved. No stadium, no headset mic.
```

### Scene C — Value Pivot Stage

**Aspect:** 1:1 (carousel) or 4:5

**Scene prompt:**

```
Minimal stage set: cream backdrop, single sage podium with gold trim, small CH monogram. Three beat markers on floor labeled subtly Hook / Tangent / Pivot in mono typography. Spotlight soft, not harsh. Right side open for speaker compositing. Smart-friend comedy-club-meets-lecture-hall energy, never toxic positivity slogans on walls.
```

**Composite (`image_edit`):**

```
Composite subject at podium or just right of it, mid-gesture teaching pose, warm smile, conversational not shouting. Lighting matches soft spotlight. Preserve face and hair exactly.
```

### Scene D — Builder's Code Audit

**Aspect:** 16:9

**Scene prompt:**

```
Workshop table top-down angled view: twelve concept cards arranged in grid (Externalized Memory, Context Hygiene, etc.), each with sage border and gold corner notch. Checklist clipboard, pen, coffee cup. Canvas warm cream, ink text, mono stat footnotes. Lower-right quadrant cleared for standing figure compositing. Clean, tactile, builder aesthetic — not corporate stock photo.
```

**Composite (`image_edit`):**

```
Place subject standing lower-right, looking at concept cards on table, thoughtful builder energy. Scale to table height, soft shadow, identity preserved.
```

### Scene E — Cutout only (transparent PNG)

For stickers, nav avatars, lesson card thumbnails.

**Cutout prompt (`image_edit`):**

```
Extract the person from the reference image as a clean waist-up cutout. Transparent background (alpha channel). Soft natural edge, no halos, no green spill. Preserve identity, clothing, and expression exactly. Neutral warm studio lighting on subject. No background elements. PNG output.
```

**Chroma-key fallback:**

```
Isolate subject on pure #00FF00 green screen background for chroma keying. Waist-up framing, even lighting, no green in clothing or hair. Subject centered.
```

Post-process: remove green in Figma/Photoshop or `rembg` if model cannot emit true alpha.

---

## Negative prompt block (all scenes)

```
purple gradient, indigo #6366f1, neon cyberpunk, stadium crowd, headset microphone, 
toxic positivity, hustle culture, fake statistics, stock photo smile, aggressive 
bodybuilding coach, lens flare spam, busy cluttered background, watermark, text gibberish, 
extra fingers, distorted face, anime style, low resolution
```

## Composition zones

| Format | Safe zone for human | Text-safe zone |
|--------|---------------------|----------------|
| 16:9 hero | Right 35%, vertically centered | Left 60% |
| 4:5 social | Lower-right 40% | Upper-left 55% |
| 1:1 carousel | Right 38% | Left 55% |
| CH avatar | Center crop, 512×512 | N/A |

## Code references

Persona data and copy live in code (SSOT for shipped product):

- `src/lib/coachHype.ts` — `COACH_HYPE_MISSION`, `COACH_HYPE_PAIN_POINTS`, `BUILDER_CONCEPTS`
- `src/components/CoachHypeLesson.tsx` — lesson card pattern
- `src/components/CoachHypeMission.tsx` — landing mission section

## Outstanding (carried forward)

- Stripe webhook signing secret still needed at `https://sloppyxbaby.com/api/webhook/stripe`
- Macroscope GitHub App authorization deferred

## Worklog

Machine-readable entries appended to `worklog/log.jsonl` on 2026-06-30 (event types: `note`, `milestone`, `fix`, `deploy`, `action`).