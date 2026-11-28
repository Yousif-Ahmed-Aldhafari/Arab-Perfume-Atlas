# Arabic RTL + English LTR Design Guide

This guide covers every consideration for bilingual Arabic (RTL) and English (LTR) layout in the
Arab Perfume Atlas project. Apply this guide to every component, layout, and page.

---

## Fundamental Principles

1. **Neither language is a translation of the other** — Arabic and English layouts may differ in
   structure if the content hierarchy differs. Don't just mirror one into the other.
2. **Logical properties first** — Use CSS logical properties everywhere. Never use directional
   physical properties (left/right) except where semantically unavoidable.
3. **Test both directions at every breakpoint** — A layout that works in LTR may break in RTL.
   Always test 375px, 768px, 1024px, 1440px × RTL and LTR.
4. **Typography is different** — Arabic text is denser per character, often taller per line, and
   reads differently. Line-height and letter-spacing settings are not shared between scripts.

---

## HTML Setup

### Document-Level Direction

```html
<!-- Arabic page -->
<html lang="ar" dir="rtl">

<!-- English page -->
<html lang="en" dir="ltr">

<!-- Bilingual page — set dominant language on html, override per section -->
<html lang="ar" dir="rtl">
  <section lang="en" dir="ltr">English content</section>
</html>
```

### Inline Direction Overrides

```html
<!-- Inline LTR within RTL context (e.g., phone number, URL) -->
<span dir="ltr" lang="en">+971 50 123 4567</span>

<!-- Bidi isolation for mixed content -->
<bdi>user-generated mixed content</bdi>
```

---

## CSS Logical Properties

Always use logical properties. Never use physical left/right in shared components.

| Physical (Avoid) | Logical (Use) |
|-----------------|---------------|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `right: 0` | `inset-inline-end: 0` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |
| `float: right` | `float: inline-end` |

---

## Tailwind CSS RTL Setup

### Configuration

```js
// tailwind.config.js
module.exports = {
  // Tailwind v3: enable RTL variant
  // Tailwind v4: logical properties built-in
  plugins: [],
}
```

```html
<!-- Set direction on the root element -->
<html dir="rtl" class="...">
<!-- or -->
<html dir="ltr" class="...">
```

### RTL-Specific Classes

```html
<!-- Use Tailwind logical property utilities -->
<div class="ms-4 me-2 ps-6 pe-4">  <!-- margin-inline-start, etc. -->

<!-- RTL variant for directional overrides only -->
<div class="ml-4 rtl:ml-0 rtl:mr-4">  <!-- use sparingly; prefer logical -->

<!-- Text alignment -->
<p class="text-start">  <!-- NOT text-left -->
<p class="text-end">    <!-- NOT text-right -->
```

---

## Icon Direction

Directional icons must flip in RTL. Non-directional icons do not flip.

### Icons That Must Flip in RTL

- Arrows: left/right/back/forward/next/previous
- Chevrons pointing horizontally
- Send/submit arrows
- Breadcrumb separators
- Carousel controls
- Progress indicators with directionality

### Icons That Do NOT Flip

- Up/down arrows
- Plus/minus
- Close (×)
- Search
- Settings gear
- Checkmark
- Warning/error triangles
- Social media icons

### Implementation

```tsx
// Tailwind approach
<ArrowRight className="rtl:scale-x-[-1]" />

// CSS approach
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}

// Conditional rendering approach (preferred for semantic clarity)
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react"

function DirectionalArrow() {
  const isRTL = document.documentElement.dir === "rtl"
  return isRTL ? <ArrowLeft /> : <ArrowRight />
}
```

---

## Typography for Arabic

### Font Requirements

Arabic fonts must:
- Cover the full Unicode Arabic block (U+0600–U+06FF)
- Support Arabic Extended-A (U+08A0–U+08FF) if using modern Arabic
- Include all required ligatures
- Have good hinting at screen sizes

**Recommended Arabic typefaces (verify license before use):**
- Noto Sans Arabic — comprehensive, free, Google Fonts
- IBM Plex Arabic — modern, clean, free
- Cairo — popular, legible at all sizes, Google Fonts
- Tajawal — modern, minimal personality
- Scheherazade New — traditional calligraphic style

### Typography Differences

```css
/* Arabic body text */
[lang="ar"] body {
  font-family: var(--font-arabic-body);
  font-size: 1rem;         /* Arabic may read larger; adjust */
  line-height: 1.8;        /* Arabic needs more line-height than Latin */
  letter-spacing: 0;       /* NEVER add letter-spacing to Arabic text */
  word-spacing: normal;    /* Avoid word-spacing adjustments */
}

/* Latin body text */
[lang="en"] body {
  font-family: var(--font-latin-body);
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: normal;
}
```

> **Critical rule:** Never apply `letter-spacing` to Arabic text. Arabic is a connected script
> and spacing between letters breaks the connection points, making it unreadable.

### Numbers in Bilingual Context

```html
<!-- Western Arabic numerals (default) -->
<span>1,234</span>

<!-- Eastern Arabic-Indic numerals (use for Arabic-language numeric content) -->
<!-- CSS approach -->
[lang="ar"] .price {
  font-feature-settings: "locl";
}

<!-- Or explicit Unicode: ١٢٣٤ for ١,٢٣٤ -->
```

---

## Layout Patterns for Bilingual

### Navigation

```html
<!-- Logo always reads in document flow direction -->
<!-- In RTL: logo on the right, nav links on the left -->
<!-- In LTR: logo on the left, nav links on the right -->
<nav class="flex items-center justify-between">
  <a class="order-first rtl:order-last">Logo</a>
  <ul class="flex gap-4">...</ul>
  <div class="order-last rtl:order-first">CTA</div>
</nav>
```

### Cards

```html
<!-- Card content flows naturally with dir attribute -->
<article class="flex gap-4" dir="auto">
  <img class="shrink-0" />  <!-- image position adapts to dir -->
  <div class="text-start">  <!-- text aligns to reading direction -->
    <h3>Title</h3>
    <p>Description</p>
  </div>
</article>
```

### Forms

```html
<form>
  <!-- Labels always precede inputs in reading direction -->
  <label class="block text-start mb-2">
    الاسم  <!-- Right-aligned in RTL context -->
  </label>
  <input
    type="text"
    dir="auto"              <!-- Allows user input in either direction -->
    class="text-start w-full"
    placeholder="أدخل اسمك"
  />
</form>
```

---

## Testing Checklist

Before shipping any component or page, verify:

- [ ] `dir="rtl"` renders correctly without layout overflow
- [ ] All margins/paddings use logical properties (inspect with DevTools)
- [ ] Directional icons flip correctly in RTL
- [ ] Text alignment is `start`/`end`, never `left`/`right` in shared styles
- [ ] Arabic font renders at all required sizes without character substitution
- [ ] No `letter-spacing` applied to Arabic text
- [ ] Number formatting is contextually correct
- [ ] Form inputs have `dir="auto"` for mixed-language user input
- [ ] Breadcrumbs and step indicators read correctly in both directions
- [ ] Screenshots taken in both RTL and LTR at 375px, 768px, 1024px, 1440px
- [ ] Scroll direction and horizontal overflow checked in both directions
