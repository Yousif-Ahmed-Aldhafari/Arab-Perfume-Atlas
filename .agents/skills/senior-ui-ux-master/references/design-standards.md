# Design Standards

Mandatory design standards for the Arab Perfume Atlas project.
These are non-negotiable and override any generic recommendation from any tool or model.

---

## Core Philosophy

Design for this project serves a **luxury Arabic perfume marketplace**. The audience is bilingual
(Arabic primary, English secondary), culturally aware, and expects visual refinement comparable to
high-end fragrance branding. Every design decision must reflect:

1. **Cultural resonance** — Arabic calligraphic traditions, geometric patterns, warm-gold accents inform
   the aesthetic vocabulary without being pastiche.
2. **Functional elegance** — Usability is never sacrificed for decoration. Visual restraint signals
   luxury better than ornamentation.
3. **Bilingual integrity** — Arabic RTL and English LTR layouts are equal citizens; neither is an
   afterthought translation of the other.
4. **System thinking** — Every new element is a reusable component with documented states; one-off
   styling is prohibited.

---

## Anti-Patterns (Strictly Prohibited)

These patterns read as generic AI-generated output and are banned:

### Visual Anti-Patterns

| Anti-Pattern | Why It's Banned |
|-------------|----------------|
| Cream background (#F4F1EA) + terracotta accent (#D97757) | Anthropic Claude interaction palette; signals AI output |
| Near-black background + acid-green or vermilion accent | Overused dark theme default |
| Broadsheet layout with hairline rules and dense newspaper columns | Template chrome, not a choice |
| Identical rounded cards with uniform rgba(0,0,0,.1) shadow + gradient wash | SaaS card-kit default |
| Tracked-out ALL-CAPS eyebrow label above every heading | Template chrome |
| Meta strings joined with middle dots: A · B · C | Template chrome |
| WORD — fragment labels with spaced em dash | Template chrome |
| Tinted near-black (#0B0B0B, #111) instead of true black | Template default |
| Monospace face for all small data labels | Overused pattern |
| Arrow (→) appended to all links and button text | Template chrome |
| Fade-and-slide-up entrance on each scroll section | AI-generated motion default |
| Hover transitions on every card simultaneously | Undifferentiated interaction |
| Emojis (🎨 🚀 ⚙️) as navigation or system icons | Font-dependent, unthemeable |
| Unnecessary gradient washes as pure decoration | Low signal-to-noise |
| Identical box-shadow on every element | No hierarchy information |

### Typography Anti-Patterns

| Anti-Pattern | Why It's Banned |
|-------------|----------------|
| Accenting a single word in a headline with italic/bold/color | Cheap emphasis; signals template |
| ALL-CAPS for labels regardless of content | Loses hierarchy meaning |
| Unnecessary label above content that explains itself | Noise |
| Three or more typefaces in one layout | Incoherent personality |
| Viewport-relative font sizes (vw units) for body text | Breaks accessibility scaling |

### Code Anti-Patterns

| Anti-Pattern | Why It's Banned |
|-------------|----------------|
| Hardcoded hex colors in components | Prevents theming; breaks design system |
| Hardcoded px values for spacing outside the token scale | Breaks spacing rhythm |
| Per-screen `!important` overrides | Signals design system failure |
| Inline styles for anything other than truly dynamic values | Unmaintainable |
| Replicating a component instead of extending the existing one | Component sprawl |

---

## Mandatory Positive Standards

### Visual Standards

- **One hero element** — spend visual boldness in one place per page; keep everything else quiet
- **Token-driven** — every color, spacing value, border-radius, shadow, and font references a CSS
  variable from `assets/design-tokens.css`
- **Maximum 2 typefaces** — one for display/heading, one for body; must be clearly distinct in personality
- **Line length** — ≤ 80 characters for body text; serif can extend slightly, with more line-height
- **Motion purpose** — non-user-triggered motion only to draw attention; a single orchestrated
  moment lands better than scattered effects
- **Safe zones for banners** — critical content in central 70–80%; never cut by platform chrome
- **Icon system** — Phosphor Icons (`@phosphor-icons/react`) as primary; Heroicons as fallback;
  consistent stroke weight and size tokens

### Component Standards

- **Composable architecture** — build from primitives (shadcn/ui + Radix UI); never from scratch
  when a primitive exists
- **State coverage** — every interactive component documents: default, hover, focus, active,
  disabled, loading, error states
- **Responsive** — every component is mobile-first; test at 375px, 768px, 1024px, 1440px
- **Bilingual** — every component works in both RTL (Arabic) and LTR (English) using CSS logical
  properties; no left/right overrides

### Content Standards

- **Active voice** — CTAs say exactly what happens: "Save changes," not "Submit"
- **Consistent vocabulary** — same button label used throughout the full flow
- **Failure states** — explain what went wrong and how to fix it; no vague error messages
- **Empty states** — are invitations to act, not voids

---

## Token System Rules

The three-layer token architecture from `design-system` is enforced:

```
Primitive layer   →  Raw values (never used directly in components)
     ↓
Semantic layer    →  Purpose aliases (--color-primary, --spacing-md)
     ↓
Component layer   →  Component-specific (--button-bg, --card-padding)
```

**Correct:**
```css
background: var(--button-bg);
color: var(--color-on-primary);
padding: var(--button-padding-y) var(--button-padding-x);
```

**Wrong:**
```css
background: #2C1810;
color: #FFFFFF;
padding: 12px 24px;
```

---

## Color System

The Arab Perfume Atlas palette must reflect luxury fragrance aesthetics:
- **Deep, warm neutrals** — not generic gray; lean warm (brown-black, warm ivory)
- **Gold accents** — precise, restrained; not every element, only hierarchy signifiers
- **Arabic ink** — a near-black with warmth for primary text
- **Semantic tokens** — primary, secondary, accent, surface, background, border, text, error,
  success, warning — all defined in `assets/design-tokens.json`

Validate palette choices:
```bash
node .agents/skills/brand/scripts/extract-colors.cjs --palette
```

---

## Typography System

Arabic and English typography are defined separately and paired:

| Role | Arabic Requirement | English Requirement |
|------|-------------------|---------------------|
| Display | Covers full Arabic Unicode block; calligraphic or geometric personality | Distinct from body; unique personality |
| Heading | Good weight range (400–700); legible at 18–48px | Pairs with Arabic display |
| Body | High legibility at 14–18px; ≥1.6 line-height for Arabic | ≥1.5 line-height |
| UI/Label | Clear at 11–14px; never ALL-CAPS | Sentence case |

**Minimum sizes:**
- Body: 16px web / 14pt mobile
- Label: 12px web / 11pt mobile
- Never below 11px/pt for any visible text

---

## Spacing System

Based on 4dp/px base unit with named scale:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon padding, micro gaps |
| `--space-2` | 8px | Component internal padding |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Standard padding |
| `--space-6` | 24px | Section sub-gaps |
| `--space-8` | 32px | Card padding, larger gaps |
| `--space-12` | 48px | Section spacing |
| `--space-16` | 64px | Major section breaks |
| `--space-24` | 96px | Page-level sections |

No arbitrary spacing values outside this scale without a documented exception.
