---
name: senior-ui-ux-master
description: >-
  Senior UI/UX orchestration skill acting as Product Designer, UX Designer, Design System Architect,
  and Creative Director. Activates for any design, interface, component, branding, accessibility, or
  visual quality task. Orchestrates all installed design skills (ui-ux-pro-max, frontend-design,
  ui-styling, design, design-system, brand, banner-design, slides, web-design-guidelines,
  generative_ui) with a full professional workflow: user research, IA, interaction design,
  wireframing, visual identity, typography, color theory, responsive/adaptive design, Arabic RTL +
  English LTR, dark/light modes, Apple HIG, Material Design 3, WCAG 2.2 AA, micro-interactions,
  usability testing, visual regression, and quality gate scoring (target ≥ 90/100).
argument-hint: "[design-task] [platform] [context]"
license: MIT
metadata:
  author: arab-perfume-atlas
  version: "1.0.0"
---

# Senior UI/UX Master

> **Roles active:** Senior Product Designer · Senior UI/UX Designer · Design System Architect · Creative Director

Orchestration skill for all design, interface, branding, and visual quality work in this project.
Read this file fully before beginning any design task. Load referenced sub-files when their domain is relevant to the task.

---

## Verified Installed Skills (All Confirmed Accessible)

| Skill | Version | Responsibility in this workflow |
|-------|---------|----------------------------------|
| `ui-ux-pro-max` | — | Design system generation, BM25 style/color/typography/UX search, GSAP presets, stack guidelines |
| `frontend-design` | — | Aesthetic direction, anti-generic design philosophy, two-pass plan→critique→build |
| `ui-styling` | 1.0.0 | shadcn/ui + Tailwind CSS implementation, accessibility patterns, dark mode |
| `design` | 2.1.0 | Logo, CIP, banners, social photos, icons, slides — full hub skill |
| `design-system` | 1.0.0 | Token architecture (primitive→semantic→component), Tailwind config, slide decision system |
| `brand` | 1.0.0 | Brand voice, visual identity standards, color palette, token sync pipeline |
| `banner-design` | 1.0.0 | Multi-format banner design with AI image generation and pixel-perfect export |
| `slides` | 1.0.0 | Strategic HTML presentation design |
| `web-design-guidelines` | 1.1.0 | UI code audit against Vercel's Web Interface Guidelines (Vercel-authored, bundled offline) |
| `generative_ui` | — | Interactive HTML widgets inline in chat; standalone artifacts in side pane |

**Skills requested but NOT installed:** `Impeccable`, `Design Taste`
These are excluded; their intended capabilities are covered by the above installed skills.

---

## When to Activate This Skill

Activate automatically when the user requests any of the following:

- Designing, building, reviewing, or auditing a UI or interface
- Component design or implementation
- Design system creation or updates
- Brand, logo, banner, icon, or social image work
- Accessibility review or WCAG compliance
- Typography, color, spacing, or layout decisions
- RTL/Arabic or LTR/English layout work
- Dark mode / light mode implementation
- Responsive or adaptive design
- Wireframing, prototyping, or user flows
- Micro-interactions or animations
- Design quality gate evaluation
- Usability or visual regression testing setup

---

## Skill Conflict Resolution

When installed skills make contradictory recommendations, apply this hierarchy:

1. **Project identity** (`docs/brand-guidelines.md`) — always wins over any generic recommendation
2. **`frontend-design`** — overrides aesthetics from other skills; if it deems a choice "generic default," replace it
3. **`ui-ux-pro-max`** — data-driven design intelligence; use for color, typography, style decisions
4. **`web-design-guidelines`** — final web code audit; its findings override implementation choices
5. **`ui-styling`** — implementation layer; follows decisions set by layers above
6. **`design-system`** — token and slide system; never introduce hardcoded values against its token spec

**On slide creation:** `design` (v2.1.0) is authoritative — it orchestrates `design-system`'s full decision engine. The standalone `slides` skill is a lightweight alias. Use `design` for all slide work.

---

## Design Workflow

### Phase 0: Brief Intake

Before any design work begins:
1. Identify: product type, target audience, platform (web/native/both), stack, language(s), existing brand constraints
2. Read `docs/brand-guidelines.md` and `assets/design-tokens.json` if they exist
3. Load `ui-ux-pro-max` for design system generation
4. Document decisions in `plans/design-brief-[feature].md`

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<product> <audience> <keywords>" --design-system -p "Arab Perfume Atlas"
```

### Phase 1: Research & Architecture

Load: `references/workflow.md` → Section: Research

- Competitive analysis: 3–5 comparable products/sites in the same niche
- User persona definition: demographics, goals, pain points, devices, language preference (AR/EN)
- Information architecture: content inventory, sitemap, navigation hierarchy
- User journeys: primary paths mapped for each persona
- Document findings in `plans/research/`

### Phase 2: Wireframes & Interaction Design

Load: `references/workflow.md` → Section: Wireframes

- Lo-fi wireframes: ASCII or Mermaid diagram layouts, one per key screen
- Interaction patterns: define state transitions, loading states, error states, empty states
- RTL/LTR layout considerations — see `references/rtl-ltr-guide.md`
- Prototype flow: define clickable prototype paths before implementation

### Phase 3: Visual Design System

Load: `references/design-standards.md`

**Step 3a — Design System Generation:**
```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "luxury perfume arabic bilingual ecommerce" --design-system --variance 6 --motion 4 --density 5 -p "Arab Perfume Atlas" --persist --output-dir .
```

**Step 3b — Brand Token Sync:**
```bash
node .agents/skills/brand/scripts/inject-brand-context.cjs
node .agents/skills/brand/scripts/sync-brand-to-tokens.cjs
```

**Step 3c — Token Generation:**
```bash
node .agents/skills/design-system/scripts/generate-tokens.cjs --config assets/design-tokens.json -o assets/design-tokens.css
node .agents/skills/design-system/scripts/validate-tokens.cjs --dir src/
```

**Token compliance rule:** Every color, spacing, font, radius, shadow value MUST reference a CSS variable from `assets/design-tokens.css`. No hardcoded values in components.

### Phase 4: Implementation

Load: `ui-styling` for component layer | `frontend-design` for aesthetic direction

**Implementation checklist (apply before writing code):**
1. Run `frontend-design` two-pass plan: define palette (4–6 hex), typefaces (≤2), layout concept, ASCII wireframe, principles
2. Critique plan against brief — revise any "generic default" choices
3. Implement with shadcn/ui + Tailwind; use design tokens throughout
4. Apply RTL support per `references/rtl-ltr-guide.md`
5. Dark/light mode: semantic token pairs, never hardcoded per-theme values
6. Platform compliance per `references/platform-guidelines.md` (Apple HIG + Material Design 3)
7. Animations: load GSAP presets from `ui-ux-pro-max` at appropriate `--motion` tier

### Phase 5: Accessibility Pass

Load: `references/workflow.md` → Section: Accessibility

- WCAG 2.2 AA required; AAA aspirational
- Contrast minimums: 4.5:1 body text, 3:1 large text and UI components
- Keyboard navigation: logical tab order, visible focus indicators
- Screen reader: semantic HTML, ARIA labels, live regions for dynamic content
- Motion: `prefers-reduced-motion` respected; no mandatory animations
- Forms: labels, error messages, inline validation

**Audit command:**
```bash
# After implementation: audit with web-design-guidelines
# Read: .agents/skills/web-design-guidelines/references/command.md
# Apply to: src/**/*.{html,tsx,jsx,vue,svelte}
```

### Phase 6: Responsive & Adaptive Design

- Mobile-first: 375px → 768px → 1024px → 1440px
- Breakpoints via Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch targets ≥ 44px (iOS) / 48dp (Android)
- Safe areas respected on mobile
- RTL layout tested separately at each breakpoint
- Typography scales adapt (no viewport font-size hacks)

### Phase 7: Quality Gate

Load: `references/quality-gate.md`

Run quality gate evaluation after every significant design delivery.
Score must reach ≥ 90/100 with evidence (screenshots, contrast measurements, audit output).
Do NOT fabricate scores — only report verified measurements.

### Phase 8: Usability & Visual Regression

Load: `references/workflow.md` → Section: Testing

- Usability: define test scenarios, record findings, create issue tickets
- Visual regression: take reference screenshots before changes; diff after
- Use `generative_ui` for in-chat visual inspection widgets when helpful
- Use `chrome-devtools` skill for pixel-accurate screenshots if available

---

## Design Standards (Non-Negotiable)

See full standards: `references/design-standards.md`

**Anti-patterns to avoid unconditionally:**
- Generic card-grid layouts with uniform shadows and border-radius everywhere
- Cream backgrounds (#F4F1EA) + terracotta accent (#D97757) — AI-generated default
- Near-black + acid-green — overused dark theme default
- ALL-CAPS tracked labels above every heading
- Middle-dot-joined meta strings (A · B · C)
- Spaced em-dash labels (WORD — fragment)
- Fade-and-slide-up on every scroll section
- Hover transitions on every card
- Emojis as structural icons

**Mandatory standards:**
- One primary visual element carries personality — everything else serves it
- Design tokens for all values — no hardcoded hex, px, or font-family in components
- Reusable component architecture from day one
- Bilingual support (AR right-to-left + EN left-to-right) in every layout decision
- Two typefaces maximum; clearly distinct if using two
- Line length ≤ 80 characters for body text

---

## Arabic RTL + English LTR

See full guide: `references/rtl-ltr-guide.md`

Quick rules:
- Use `dir="rtl"` and `lang="ar"` on Arabic sections
- CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of left/right
- Tailwind RTL variant: `rtl:` prefix; configure `dir` on `<html>` element
- Icon direction: directional icons (arrows, chevrons) must flip in RTL
- Text alignment: `text-start` / `text-end` instead of `text-left` / `text-right`
- Number formatting: Arabic-Indic numerals for Arabic content when appropriate
- Font selection: ensure Arabic typeface covers full Unicode Arabic block

---

## Platform Compliance Summary

See full reference: `references/platform-guidelines.md`

| Platform | Key Requirements |
|----------|-----------------|
| Apple HIG | 44pt touch targets, SF Pro hierarchy, Dynamic Type, safe areas, bottom nav ≤5 items |
| Material Design 3 | 48dp touch targets, Material You color tokens, elevation with tonal surfaces, motion tokens |
| Web (WCAG 2.2 AA) | 4.5:1 contrast, keyboard nav, focus visible, no timing required, error identification |

---

## Quality Gate

See full rubric: `references/quality-gate.md`

| Criterion | Points | Measurement Method |
|-----------|--------|--------------------|
| Visual design | 20 | Screenshot review, anti-pattern check, frontend-design audit |
| User experience | 20 | Journey completion, error handling, information hierarchy |
| Consistency | 15 | Token usage audit, component reuse check, validate-tokens.cjs |
| Accessibility | 15 | Contrast measurements, keyboard test, screen reader test, WCAG checklist |
| Responsiveness | 10 | Multi-breakpoint screenshots (375px, 768px, 1024px, 1440px) |
| Brand identity | 10 | Brand guideline compliance, token alignment |
| Interaction design | 5 | State coverage, micro-interaction review |
| Implementation quality | 5 | Code review, no hardcoded values, component architecture |
| **Total** | **100** | **Minimum passing score: 90** |

---

## References

| Topic | File |
|-------|------|
| Full Design Workflow | `references/workflow.md` |
| Design Standards | `references/design-standards.md` |
| RTL/LTR Guide | `references/rtl-ltr-guide.md` |
| Platform Guidelines | `references/platform-guidelines.md` |
| Quality Gate Rubric | `references/quality-gate.md` |
