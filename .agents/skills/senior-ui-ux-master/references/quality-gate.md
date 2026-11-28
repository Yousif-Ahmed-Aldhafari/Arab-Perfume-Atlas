# Design Quality Gate

Scoring rubric for evaluating every completed design in the Arab Perfume Atlas project.
Target: **≥ 90 / 100**. Minimum passing score for shipping.

> [!IMPORTANT]
> Do NOT fabricate scores. Every score must be backed by a specific, verifiable measurement,
> observation, or test result. If a measurement cannot be taken (e.g., no screenshot available),
> note it as "not verified" and do not score that sub-criterion.

---

## Evaluation Rubric

### 1. Visual Design — 20 points

Evaluates aesthetic quality, distinctiveness, and visual craft.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Anti-pattern check: none of the banned patterns present | 5 | Review against `references/design-standards.md` anti-pattern list |
| Distinctive aesthetic: not generic or templated | 5 | Compare to `frontend-design` calibration list; note specific differentiators |
| Visual hierarchy: clear primary/secondary/tertiary levels | 5 | Eye-track the design — is the primary CTA the first thing noticed? |
| Craft: typography, spacing, alignment executed precisely | 5 | Measure alignment in DevTools; check spacing against token scale |

**Evidence required:** Screenshot(s) of the design; specific observations for each sub-criterion.

---

### 2. User Experience — 20 points

Evaluates usability, flow, and user-centered design quality.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Primary user journey completes without confusion | 6 | Walk through the primary flow end-to-end; note any friction points |
| All states handled: loading, error, empty, success | 5 | Check each interactive component for complete state coverage |
| Information hierarchy matches user mental model | 5 | Does content order match what users need first? |
| Cognitive load is minimized | 4 | Count decisions required per screen; flag screens with >3 primary actions |

**Evidence required:** Journey walkthrough notes; screenshot of each state if available.

---

### 3. Consistency — 15 points

Evaluates system coherence and design token compliance.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Token compliance: no hardcoded values | 6 | Run `node .agents/skills/design-system/scripts/validate-tokens.cjs --dir src/` |
| Component reuse: same pattern used for same purpose | 5 | Audit DOM for duplicate component implementations |
| Visual language is consistent: icons, spacing, type | 4 | Spot-check 5 random screens for spacing and icon consistency |

**Evidence required:** `validate-tokens.cjs` output; list of any hardcoded values found.

---

### 4. Accessibility — 15 points

Evaluates WCAG 2.2 AA compliance.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Color contrast ≥ 4.5:1 for normal text | 4 | Measure with browser DevTools or axe; list each pair tested |
| Keyboard navigation complete and logical | 4 | Tab through entire interface; note any traps or skipped elements |
| Screen reader: semantic HTML + ARIA correct | 4 | Run axe DevTools; list violations |
| Reduced motion respected | 3 | Enable OS reduced-motion; verify no forced animations |

**Evidence required:** Specific contrast ratios measured; axe report; keyboard test walkthrough.

---

### 5. Responsiveness — 10 points

Evaluates multi-device and multi-breakpoint quality.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| 375px (small phone) renders correctly | 3 | Screenshot at 375px; no overflow, no clipping |
| 768px (tablet portrait) renders correctly | 2 | Screenshot at 768px |
| 1024px (tablet landscape / small desktop) renders correctly | 2 | Screenshot at 1024px |
| 1440px (desktop) renders correctly | 2 | Screenshot at 1440px |
| RTL layout verified at ≥ 1 breakpoint | 1 | Screenshot with `dir="rtl"` at 375px |

**Evidence required:** Screenshots at each breakpoint tested.

---

### 6. Brand Identity — 10 points

Evaluates alignment with Arab Perfume Atlas brand standards.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Brand color palette used correctly | 4 | Compare with `docs/brand-guidelines.md`; verify via `extract-colors.cjs` |
| Brand typography applied correctly | 3 | Verify font-family tokens match brand spec |
| Brand voice in copy (if applicable) | 3 | Review all copy against voice framework in `brand` skill |

**Evidence required:** Color comparison output; font-family values from DevTools.

---

### 7. Interaction Design — 5 points

Evaluates micro-interactions, motion, and feedback quality.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Interactive elements have clear feedback (hover/press/focus) | 2 | Manually test each interactive element |
| Motion is purposeful and non-generic | 2 | Verify animations have a reason; check against `frontend-design` motion guidance |
| Transition timing follows platform motion tokens | 1 | Inspect transition-duration values; compare to MD3 or HIG tokens |

**Evidence required:** List of interactive elements tested; specific animation timing values.

---

### 8. Implementation Quality — 5 points

Evaluates code quality and developer experience.

| Sub-criterion | Max | How to Measure |
|--------------|-----|----------------|
| Component architecture is composable and reusable | 2 | Review component directory; count unique vs. reused components |
| No inline styles for non-dynamic values | 2 | Search codebase: `grep -r "style={{" src/` for unexpected inline styles |
| TypeScript types are correct (if applicable) | 1 | `tsc --noEmit` returns no errors |

**Evidence required:** grep output or component audit; TypeScript output.

---

## Score Sheet Template

Copy this for each evaluation:

```
## Quality Gate Evaluation: [Feature/Page Name]
Date: [YYYY-MM-DD]
Evaluator: Senior UI/UX Master Skill

### Scores

| Criterion               | Score | Max | Evidence |
|------------------------|-------|-----|---------|
| Visual Design           |       | 20  |         |
| User Experience         |       | 20  |         |
| Consistency             |       | 15  |         |
| Accessibility           |       | 15  |         |
| Responsiveness          |       | 10  |         |
| Brand Identity          |       | 10  |         |
| Interaction Design      |       | 5   |         |
| Implementation Quality  |       | 5   |         |
| **TOTAL**              |       | 100 |         |

### Pass / Fail: [PASS ≥90 / FAIL <90]

### Issues Found
[List any sub-criteria scored below their expected level with specific evidence]

### Required Fixes Before Shipping
[List mandatory fixes for any criterion below minimum threshold]
```

---

## Scoring Thresholds

| Score | Status | Action |
|-------|--------|--------|
| 95–100 | Exceptional | Ship; document as reference implementation |
| 90–94 | Pass | Ship with minor notes |
| 80–89 | Conditional | Fix flagged issues before shipping |
| 70–79 | Fail | Requires significant revision |
| <70 | Critical Fail | Do not ship; redesign required |

---

## Automated Checks Available

These checks can be run to gather objective evidence:

```bash
# Token compliance (Consistency criterion)
node .agents/skills/design-system/scripts/validate-tokens.cjs --dir src/

# Brand color extraction (Brand Identity criterion)
node .agents/skills/brand/scripts/extract-colors.cjs --palette

# Asset validation (Implementation Quality criterion)
node .agents/skills/brand/scripts/validate-asset.cjs <asset-path>

# Web Guidelines audit (Accessibility + Visual Design criteria)
# Read: .agents/skills/web-design-guidelines/references/command.md
# Apply to target files

# Inline style check (Implementation Quality criterion)
grep -rn "style={{" src/ --include="*.tsx" --include="*.jsx"
grep -rn "style=\"" src/ --include="*.html"
```
