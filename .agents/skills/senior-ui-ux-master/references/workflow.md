# Full Design Workflow

End-to-end design workflow for the Arab Perfume Atlas project.
Covers all phases from research through quality gate.

---

## Phase 0: Brief Intake

**Goal:** Understand the design task fully before making any design decisions.

### Checklist

- [ ] Read `docs/brand-guidelines.md` (source of truth for brand)
- [ ] Read `assets/design-tokens.json` (existing token system)
- [ ] Read existing `design-system/arab-perfume-atlas/MASTER.md` if it exists
- [ ] Identify: product type, user persona, platform, stack, language(s)
- [ ] Confirm scope: is this a new page, new component, redesign, or audit?
- [ ] Document decisions in `plans/design-brief-[feature-name].md`

### Design System Generation (new pages/projects)

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py \
  "luxury perfume arabic bilingual ecommerce" \
  --design-system --variance 6 --motion 4 --density 5 \
  -p "Arab Perfume Atlas" --persist --output-dir .
```

---

## Phase 1: Research & Competitive Analysis

**Goal:** Establish informed design decisions grounded in the target market.

### User Research

1. **Define personas** — at minimum:
   - Arabic-speaking primary shopper (mobile-first, luxury-aware)
   - English-speaking browser/shopper (web, discovery-focused)
   - Perfume enthusiast (both languages, high engagement)

2. **Document per persona:**
   - Demographics and cultural context
   - Primary device and usage context (commute, home, work)
   - Goals: what they want to accomplish
   - Pain points: what currently frustrates them
   - Language preference and reading direction

### Competitive Analysis

Analyze 3–5 comparable luxury fragrance or Arabic e-commerce sites:

| Competitor | Strengths | Weaknesses | Design Patterns Worth Noting |
|-----------|-----------|------------|------------------------------|
| [Name] | | | |

Focus on:
- Navigation patterns in both languages
- Product presentation and imagery
- Checkout flow
- Mobile experience
- Bilingual implementation quality

### Information Architecture

1. **Content inventory:** List all content types and their relationships
2. **Card sorting output:** Group and label content categories
3. **Sitemap:** Document full navigation hierarchy as a tree diagram
4. **Navigation hierarchy:** Primary, secondary, tertiary levels

```
Arab Perfume Atlas Sitemap (example):
├── Home
├── Perfumes
│   ├── By Brand
│   ├── By Note (Oud, Rose, Musk...)
│   ├── By Occasion
│   └── By Price Range
├── Collections
├── About (Brand Stories)
├── Search
├── Account
│   ├── Wishlist
│   ├── Orders
│   └── Profile
└── Cart / Checkout
```

**Output:** `plans/research/[feature]-ia.md`

---

## Phase 2: Wireframes & Interaction Design

**Goal:** Define layout and interactions before visual design begins.

### Lo-Fi Wireframing

Use ASCII art or Mermaid diagrams to sketch key screens:

```
Example: Product Listing Page (Mobile, RTL)
┌─────────────────────────────┐
│  [Search bar]    [Filter] ☰ │  ← Header
├─────────────────────────────┤
│  مجموعات العطور             │  ← Section title (AR)
│  Perfume Collections         │  ← Section title (EN)
├─────────────────────────────┤
│  [Img] [Img] [Img]          │  ← 3-col grid
│  Name  Name  Name           │
│  Price Price Price          │
│                             │
│  [Img] [Img] [Img]          │
│  ...                        │
├─────────────────────────────┤
│  [Cart]  [Home]  [Profile]  │  ← Bottom nav
└─────────────────────────────┘
```

### State Mapping

For each interactive component, define all states:

| State | Trigger | Visual Change |
|-------|---------|---------------|
| Default | None | Baseline appearance |
| Hover | Mouse over | Subtle color shift |
| Focus | Tab/click | Focus ring, 3:1 contrast |
| Active/Pressed | Mouse down / tap | Pressed state |
| Loading | Async action | Skeleton or spinner |
| Success | Action complete | Confirmation feedback |
| Error | Action failed | Error indicator + message |
| Disabled | Not interactive | Reduced opacity, no cursor |
| Empty | No content | Illustrated empty state |

### User Journey Maps

For each primary persona, map the complete journey:

```
Persona: Arabic-speaking shopper, mobile
Goal: Find and purchase an Oud perfume

Step 1: Lands on home → sees featured Oud collection (AR)
Step 2: Taps collection → product grid (filtered: Oud)
Step 3: Taps product → product detail page
Step 4: Selects size → adds to cart
Step 5: Reviews cart → proceeds to checkout
Step 6: Enters address → selects payment → confirms
Step 7: Receives order confirmation (AR)

Friction points: [document any identified]
Opportunities: [document improvements]
```

**Output:** `plans/wireframes/[page-name]-[language].md`

---

## Phase 3: Visual Design System

**Goal:** Establish the complete visual language before building.

### Design System Generation

Refer to Phase 0 command. After generation:

1. **Review output** — verify style matches brand brief
2. **Critique against `frontend-design`** — flag any generic defaults in the output
3. **Revise** — replace generic choices with brief-specific ones
4. **Persist** — save to `design-system/arab-perfume-atlas/MASTER.md`

### Token Architecture

Three-layer system (never skip layers):

```
Primitive:  --color-gold-500: #C9A84C;
Semantic:   --color-accent: var(--color-gold-500);
Component:  --price-tag-color: var(--color-accent);
```

Generate and validate:
```bash
node .agents/skills/design-system/scripts/generate-tokens.cjs \
  --config assets/design-tokens.json -o assets/design-tokens.css

node .agents/skills/design-system/scripts/validate-tokens.cjs --dir src/
```

### Typography System

Define tokens for both Arabic and Latin scripts:

```css
/* Arabic display */
--font-arabic-display: 'Noto Naskh Arabic', serif;

/* Latin display */
--font-latin-display: '[Chosen Typeface]', serif;

/* Arabic body */
--font-arabic-body: 'Noto Sans Arabic', sans-serif;

/* Latin body */
--font-latin-body: '[Chosen Typeface]', sans-serif;
```

### Color System

Define full semantic token set:
- Primary, on-primary, primary-container
- Secondary, on-secondary
- Accent (gold tones for luxury signals)
- Surface levels (1–5)
- Background (light and dark)
- Border, divider
- Text: primary, secondary, disabled, inverse
- Feedback: error, warning, success, info (and their containers)

---

## Phase 4: Implementation

**Goal:** Build the design correctly from the first commit.

### Pre-Code Checklist

- [ ] Design system MASTER.md exists and is current
- [ ] All tokens defined in `assets/design-tokens.json`
- [ ] `assets/design-tokens.css` generated and committed
- [ ] `frontend-design` two-pass plan complete (palette, type, layout, principles)
- [ ] Plan critique done — no generic defaults remaining
- [ ] RTL strategy documented in `plans/design-brief-[feature].md`

### shadcn/ui Setup

```bash
npx shadcn@latest init   # configure with project framework
npx shadcn@latest add button card dialog form input label badge
```

### Component Development Order

1. Design tokens (CSS variables)
2. Base typography (heading, body, label styles)
3. Layout primitives (container, grid, stack)
4. Interactive primitives (button, link, input)
5. Composite components (card, form, navigation)
6. Page-level layouts

### RTL Implementation

Apply logical properties throughout. See `references/rtl-ltr-guide.md`.

```tsx
// Example RTL-aware component
function ProductCard({ product, locale }) {
  return (
    <article
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
      className="flex gap-4 p-[var(--space-4)]"
    >
      <img className="shrink-0 size-24" src={product.image} alt="" />
      <div className="text-start space-y-2">
        <h3 className="text-[var(--font-size-title)]">
          {product.name[locale]}
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          {product.brand}
        </p>
        <p className="text-[var(--color-accent)] font-semibold" dir="ltr">
          {product.price}
        </p>
      </div>
    </article>
  )
}
```

---

## Phase 5: Accessibility

**Goal:** Meet WCAG 2.2 AA without exception.

### Audit Workflow

1. **Automated:** Run axe DevTools (browser extension) on each page
2. **Contrast:** Measure every text/background pair with Colour Contrast Analyser
3. **Keyboard:** Tab through every interactive element; document path
4. **Screen reader:** VoiceOver (macOS/iOS) or NVDA (Windows) walkthrough
5. **Motion:** Enable OS reduced-motion; verify no forced animations
6. **Zoom:** Increase browser font size to 200%; verify no content loss

### Web-Design-Guidelines Audit

```bash
# Read the bundled rules
cat .agents/skills/web-design-guidelines/references/command.md

# Apply to implementation files (adjust pattern to project structure)
# Output format: file:line — finding
```

**Document all findings in:** `plans/accessibility/[feature]-audit.md`

---

## Phase 6: Responsive & Adaptive

**Goal:** Flawless experience from 375px to 1440px+ in both RTL and LTR.

### Test Matrix

| Breakpoint | Device Equivalent | LTR Tested | RTL Tested |
|-----------|------------------|-----------|-----------|
| 375px | iPhone SE | ☐ | ☐ |
| 390px | iPhone 15 | ☐ | ☐ |
| 768px | iPad portrait | ☐ | ☐ |
| 1024px | iPad landscape / small laptop | ☐ | ☐ |
| 1440px | Desktop | ☐ | ☐ |

### Screenshot Protocol

```bash
# Using chrome-devtools skill or DevTools device emulation:
# Capture at each breakpoint, both directions
# Save to: plans/screenshots/[feature]/[breakpoint]-[dir].png
```

---

## Phase 7: Quality Gate

**Goal:** Verify the design meets the 90/100 minimum score.

1. Load `references/quality-gate.md`
2. Complete the Score Sheet Template for the feature
3. Run all automated checks listed in the quality gate
4. Record screenshots and tool outputs as evidence
5. If score < 90: document required fixes, resolve, re-evaluate
6. File score sheet in `plans/quality-gate/[feature]-score.md`

---

## Phase 8: Usability & Visual Regression Testing

**Goal:** Catch issues that automated tools miss.

### Usability Testing

1. Define 3–5 test tasks (one per primary user journey)
2. Run with 3+ test participants (or document as self-evaluation walkthrough)
3. Record completion rate, time-on-task, error rate, satisfaction
4. File findings in `plans/usability/[feature]-test.md`
5. Create tickets for each issue found

### Visual Regression Testing

For each significant feature delivery:

1. **Baseline:** Take reference screenshots at all breakpoints + both directions
2. **After changes:** Retake screenshots
3. **Diff:** Compare visually (or use tools like Percy, BackstopJS, Chromatic)
4. **Review:** Flag unexpected changes; approve intentional changes

```bash
# Manual baseline capture (adjust URL and dimensions)
node .agents/skills/chrome-devtools/scripts/screenshot.js \
  --url "http://localhost:3000/[page]" \
  --width 375 --height 812 \
  --output "plans/screenshots/baseline/[page]-375.png"
```

---

## Deliverables Checklist

For each design task, deliver:

- [ ] `plans/design-brief-[feature].md` — brief and decisions
- [ ] `plans/research/[feature]-personas.md` — user research (if new feature)
- [ ] `plans/wireframes/[feature].md` — lo-fi wireframes
- [ ] `design-system/arab-perfume-atlas/MASTER.md` — updated if system changed
- [ ] `assets/design-tokens.css` — regenerated if tokens changed
- [ ] Implementation (component files) — no hardcoded values
- [ ] `plans/accessibility/[feature]-audit.md` — accessibility findings
- [ ] `plans/screenshots/[feature]/` — breakpoint screenshots
- [ ] `plans/quality-gate/[feature]-score.md` — quality gate score sheet
