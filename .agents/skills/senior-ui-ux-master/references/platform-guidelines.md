# Platform Design Guidelines

Reference for Apple Human Interface Guidelines (HIG), Google Material Design 3 (MD3), and
web accessibility standards (WCAG 2.2 AA) as applied to the Arab Perfume Atlas project.

---

## Apple Human Interface Guidelines

Source: https://developer.apple.com/design/human-interface-guidelines/

### Touch Targets

- **Minimum:** 44 × 44 pt for all interactive elements
- Expand the hit area beyond the visual element when needed using padding
- Never shrink visual icon to meet sizing — expand invisible tappable area

### Typography — SF Pro

| Style | Weight | Size |
|-------|--------|------|
| Large Title | Regular | 34pt |
| Title 1 | Regular | 28pt |
| Title 2 | Regular | 22pt |
| Title 3 | Regular | 20pt |
| Headline | Semibold | 17pt |
| Body | Regular | 17pt |
| Callout | Regular | 16pt |
| Subhead | Regular | 15pt |
| Footnote | Regular | 13pt |
| Caption 1 | Regular | 12pt |
| Caption 2 | Regular | 11pt |

> For Arabic: use a compatible Arabic typeface that harmonizes with SF Pro at the same optical sizes.

### Dynamic Type

- All text must scale with system font size settings
- Never use fixed pixel font sizes in native iOS views
- Test at Accessibility → Larger Text → maximum setting
- Layouts must reflow gracefully; not clip or overflow at large type sizes

### Safe Areas

```swift
// Always respect safe area insets for:
// - Status bar (top)
// - Home indicator / gesture area (bottom)
// - Notch / Dynamic Island
safeAreaInsets.top
safeAreaInsets.bottom
```

- Fixed headers must clear the status bar
- Bottom CTAs must clear the home indicator
- Never place interactive content in notch region

### Navigation Patterns

| Pattern | Use When |
|---------|----------|
| Tab Bar | 2–5 top-level destinations; always visible |
| Navigation Stack | Hierarchical content; push/pop |
| Modal Sheet | Focused tasks; discardable |
| Split View | iPad; primary + detail layout |

- Tab bar: maximum 5 items; use "More" for additional items
- Use SF Symbols for tab bar icons (or equivalent semantic icons)
- Back button always labeled with previous screen title or "Back"

### HIG Color

- Use semantic system colors (`systemBackground`, `label`, `secondaryLabel`, etc.)
- Support both light and dark mode — test both
- Never rely on color alone to convey information
- Avoid pure black (#000000) in dark mode — use `systemBackground` which is #1C1C1E

### HIG Motion

- Respect `UIAccessibility.isReduceMotionEnabled`
- Use spring physics for transitions (not linear easing)
- Entry is slower than exit (exit should be ~30% faster)
- Shared element transitions for spatial continuity

---

## Google Material Design 3

Source: https://m3.material.io/

### Touch Targets

- **Minimum:** 48 × 48 dp for all interactive elements
- State layer extends beyond visual bounds using padding

### Material You Color System

MD3 generates a full color scheme from a single seed color using the HCT color space:

| Token Role | Light | Dark | Usage |
|-----------|-------|------|-------|
| `primary` | — | — | Key actions, main interactive elements |
| `on-primary` | — | — | Text/icons on primary surface |
| `primary-container` | — | — | Prominent container for primary content |
| `on-primary-container` | — | — | Text/icons on primary-container |
| `secondary` | — | — | Less prominent components |
| `surface` | — | — | Base surface of components |
| `surface-variant` | — | — | Alternative surface for distinction |
| `on-surface` | — | — | Text/icons on surface |
| `outline` | — | — | Borders, dividers |

For this project, seed the MD3 color system from the brand's primary gold/warm neutral.

### MD3 Elevation (Tonal, Not Shadow-Based)

MD3 uses tonal overlays instead of drop shadows for elevation:

| Level | Overlay Opacity | Usage |
|-------|----------------|-------|
| 0 | 0% | Base surface |
| 1 | 5% | Cards, surfaces |
| 2 | 8% | Elevated cards |
| 3 | 11% | Modals, drawers |
| 4 | 12% | Navigation drawers |
| 5 | 14% | App bars when scrolled |

> For the perfume atlas: use elevation sparingly. Luxury aesthetics favor flat or subtly tonal
> surfaces over heavy shadow-based depth.

### MD3 Typography Scale

| Role | Weight | Size | Line Height |
|------|--------|------|------------|
| Display Large | 400 | 57sp | 64sp |
| Display Medium | 400 | 45sp | 52sp |
| Display Small | 400 | 36sp | 44sp |
| Headline Large | 400 | 32sp | 40sp |
| Headline Medium | 400 | 28sp | 36sp |
| Headline Small | 400 | 24sp | 32sp |
| Title Large | 400 | 22sp | 28sp |
| Title Medium | 500 | 16sp | 24sp |
| Title Small | 500 | 14sp | 20sp |
| Body Large | 400 | 16sp | 24sp |
| Body Medium | 400 | 14sp | 20sp |
| Body Small | 400 | 12sp | 16sp |
| Label Large | 500 | 14sp | 20sp |
| Label Medium | 500 | 12sp | 16sp |
| Label Small | 500 | 11sp | 16sp |

### MD3 Motion Tokens

```
Duration tokens:
  short1: 50ms    short2: 100ms   short3: 150ms   short4: 200ms
  medium1: 250ms  medium2: 300ms  medium3: 350ms  medium4: 400ms
  long1: 450ms    long2: 500ms    long3: 550ms    long4: 600ms
  extra-long1: 700ms  extra-long2: 800ms  extra-long3: 900ms  extra-long4: 1000ms

Easing tokens:
  emphasized:          cubic-bezier(0.2, 0, 0, 1.0)
  emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0)
  emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15)
  standard:            cubic-bezier(0.2, 0, 0, 1.0)
  standard-decelerate: cubic-bezier(0, 0, 0, 1.0)
  standard-accelerate: cubic-bezier(0.3, 0, 1.0, 1.0)
```

### MD3 Component Patterns

| Component | Shape | Elevation |
|-----------|-------|-----------|
| FAB | Large rounded (28dp) | Level 3 |
| Card | Medium rounded (12dp) | Level 1 |
| Chip | Full rounded | Level 0 |
| Dialog | Extra large rounded (28dp) | Level 3 |
| Bottom Sheet | Large rounded top (28dp) | Level 1 |
| Navigation Bar | None | Level 2 |

---

## WCAG 2.2 AA Accessibility

Source: https://www.w3.org/TR/WCAG22/

### Contrast Requirements (Success Criteria 1.4.3, 1.4.11)

| Content Type | Minimum Contrast | Recommended |
|-------------|-----------------|-------------|
| Normal text (<18pt / 14pt bold) | 4.5:1 | 7:1 (AAA) |
| Large text (≥18pt / ≥14pt bold) | 3:1 | 4.5:1 |
| UI components and graphics | 3:1 | 4.5:1 |
| Inactive/disabled elements | No requirement | — |
| Decorative elements | No requirement | — |
| Logos | No requirement | — |

**Measuring contrast:**
```bash
# Use browser DevTools accessibility panel
# Or install the axe DevTools browser extension
# Target tool: Colour Contrast Analyser (desktop app)
```

### Keyboard Navigation (SC 2.1.1, 2.4.3, 2.4.7)

- Every interactive element reachable by Tab / Shift+Tab
- Focus order matches visual/logical reading order
- Focus indicator visible and ≥3:1 contrast against adjacent colors (SC 2.4.11)
- No keyboard traps (SC 2.1.2)
- Skip navigation link for main content regions (SC 2.4.1)
- All mouse operations have keyboard equivalents

### Pointer and Touch (SC 2.5.3, 2.5.5, 2.5.8)

- Touch targets ≥ 24×24 CSS px (SC 2.5.8 AA); ≥ 44×44 aspirational (SC 2.5.5 AAA)
- 24px spacing between touch targets if targets are smaller than 44×44
- No motion-only interactions (SC 2.5.4)
- No drag-required interactions without an alternative (SC 2.5.7 AA)

### Content (SC 1.1.1, 1.3.1, 1.4.1, 1.4.4)

- All non-decorative images have descriptive `alt` text
- Decorative images use `alt=""` and `role="presentation"`
- Color is NOT the only means of conveying information (SC 1.4.1)
- Text resizable to 200% without loss of content (SC 1.4.4)
- No horizontal scrolling at 320px width (SC 1.4.10 — Reflow)

### Forms (SC 1.3.5, 3.3.1, 3.3.2, 3.3.4)

- All form inputs have associated visible labels (not just placeholder)
- Error messages identify the field and describe the error (SC 3.3.1)
- Required fields identified before submission (SC 3.3.2)
- Autocomplete attributes on common inputs (SC 1.3.5)
- Error prevention: confirm before irreversible actions (SC 3.3.4)

### ARIA

```html
<!-- Use semantic HTML first; ARIA only to supplement -->

<!-- Role examples -->
<nav aria-label="Main navigation">
<main>
<aside aria-label="Related content">
<button aria-expanded="false" aria-controls="menu">Menu</button>

<!-- Live regions for dynamic content -->
<div role="status" aria-live="polite">Item added to cart</div>
<div role="alert" aria-live="assertive">Error: Session expired</div>

<!-- Hide decorative icons from screen readers -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Icon buttons need accessible names -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>
```

### Animation (SC 2.3.3)

```css
/* Always respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### New in WCAG 2.2 (not in 2.1)

| SC | Description | Level |
|----|-------------|-------|
| 2.4.11 | Focus Not Obscured (Minimum) — focus indicator not fully hidden by sticky content | AA |
| 2.4.12 | Focus Not Obscured (Enhanced) — focus indicator not hidden at all | AAA |
| 2.4.13 | Focus Appearance — focus indicator meets minimum size and contrast | AAA |
| 2.5.7 | Dragging Movements — alternative to drag for all drag operations | AA |
| 2.5.8 | Target Size (Minimum) — touch targets ≥ 24×24 CSS px | AA |
| 3.2.6 | Consistent Help — help mechanisms in consistent location | A |
| 3.3.7 | Redundant Entry — no re-entry of information within same process | A |
| 3.3.8 | Accessible Authentication (Minimum) — no cognitive test required | AA |

---

## Platform Decision Matrix

| Scenario | Use Apple HIG | Use Material Design 3 | Use WCAG 2.2 AA |
|----------|--------------|----------------------|-----------------|
| iOS native app | ✅ Primary | — | ✅ Required |
| Android native app | — | ✅ Primary | ✅ Required |
| React Native (cross-platform) | ✅ iOS surfaces | ✅ Android surfaces | ✅ Required |
| Progressive Web App | ✅ Optional reference | ✅ Optional reference | ✅ Required |
| Web (desktop + mobile) | Reference for touch | Reference for motion | ✅ Required |
| Figma design file | Reference for specs | Reference for tokens | Reference for checks |
