# Arab Perfume Atlas — Agent Rules

These rules are always active for this workspace and apply to every task.
Agents must read and follow all rules below before beginning any work.

---

## Project Identity

This is **Arab Perfume Atlas**: a bilingual (Arabic RTL + English LTR) luxury perfume
marketplace. The audience is culturally aware and expects visual refinement comparable to
high-end fragrance branding.

**Source of truth for brand:**
- `docs/brand-guidelines.md` — brand identity, voice, colors
- `assets/design-tokens.json` — token definitions
- `assets/design-tokens.css` — CSS variables

---

## Automatic Skill Activation

Activate the following skills automatically for the corresponding task types.
Do NOT wait to be asked — load the skill at the start of the relevant task.

| Task Type | Activate Skill(s) |
|-----------|------------------|
| Any UI/UX design, interface, or component task | `senior-ui-ux-master` (primary orchestrator) |
| Design system generation, style/color/font decisions | `ui-ux-pro-max` |
| Aesthetic direction, anti-generic design philosophy | `frontend-design` |
| shadcn/ui + Tailwind implementation | `ui-styling` |
| Logo, CIP, banner, social photo, icon design | `design` |
| Design token creation or Tailwind theme config | `design-system` |
| Brand voice, visual identity, token sync | `brand` |
| Slide/presentation creation | `design` (slides module) |
| UI code review, accessibility audit | `web-design-guidelines` |
| Interactive widgets or visualizations in chat | `generative_ui` |
| Any accessibility work | `web-design-guidelines` + `ui-ux-pro-max` |

---

## Design Non-Negotiables

These rules apply to every UI-related task without exception:

1. **No hardcoded values** — Every color, spacing, font-family, border-radius, and shadow
   must reference a CSS variable from `assets/design-tokens.css`. Run
   `validate-tokens.cjs` after implementation.

2. **Bilingual always** — Every component, layout, and page must work correctly in both
   Arabic RTL (`dir="rtl"`, `lang="ar"`) and English LTR (`dir="ltr"`, `lang="en"`).
   Use CSS logical properties throughout. Refer to
   `.agents/skills/senior-ui-ux-master/references/rtl-ltr-guide.md`.

3. **No anti-patterns** — The banned pattern list in
   `.agents/skills/senior-ui-ux-master/references/design-standards.md`
   applies unconditionally. Reject any design output containing these patterns.

4. **Quality gate required** — Every significant design delivery must pass the
   quality gate (≥ 90/100) documented in
   `.agents/skills/senior-ui-ux-master/references/quality-gate.md`.
   Do NOT fabricate scores.

5. **WCAG 2.2 AA mandatory** — Minimum accessibility standard for all UI.
   Aspirational: AAA where achievable without compromising usability.

6. **Platform compliance** — Respect Apple HIG for iOS surfaces, Material Design 3 for
   Android, and Web Content Guidelines for web. See
   `.agents/skills/senior-ui-ux-master/references/platform-guidelines.md`.

7. **Two-pass design** — Use `frontend-design`'s two-pass method (plan → critique →
   build) for all visual design work. Document the design plan before writing code.

8. **Source files, not application code** — Do not modify application source code
   during design setup tasks. Skill, rules, and reference files only.

---

## Conflict Resolution

When installed skills make contradictory recommendations, apply this hierarchy:

1. Project brand (`docs/brand-guidelines.md`) — always wins
2. `frontend-design` — overrides aesthetics; flag and replace any "generic default"
3. `ui-ux-pro-max` — data-driven design intelligence for color, typography, style
4. `web-design-guidelines` — final code audit; findings override implementation choices
5. `ui-styling` — implementation layer; follows layers above
6. `design-system` — token spec; never introduce hardcoded values against it

---

## Commit Discipline

- Commit changes after each logical unit of work (new skill, reference doc, feature)
- Use conventional commit messages: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- Do NOT commit application source code changes during design setup tasks

---

## Skills NOT Installed

The following skills were requested but are not installed on this machine.
Do NOT claim they are available:

- `Impeccable`
- `Design Taste`

Their intended capabilities are covered by: `ui-ux-pro-max`, `frontend-design`,
`web-design-guidelines`, and `senior-ui-ux-master`.
