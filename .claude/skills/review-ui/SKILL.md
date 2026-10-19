---
name: review-ui
description: Review the working diff against this marketing site's UI standards — brand tokens, responsive layout, accessibility, motion fallbacks, shared components and content hygiene. Pass --fix to auto-apply safe fixes.
---

# review-ui

Review the current working tree (`git diff --name-only`, staged + unstaged) against the checklist
below. This project is a Stripe-inspired, React Bits–powered EX.IO marketing site.

## Usage

```
/review-ui        — review and report violations (file:line + suggested fix)
/review-ui --fix  — review and apply safe fixes where unambiguous
```

Report findings grouped by severity: **Blocking**, **Should fix**, **Nit**. End with the single
highest-value fix. Do not rewrite React Bits internals to satisfy a style rule.

## Checklist

1. **Brand tokens / color**
   - No raw `#hex`, `rgb()`, `hsl()` values in `src/components/**` or `src/app/**` JSX.
   - Allowed exceptions: `src/app/globals.css`, `src/components/brand/**` (SVG brand mark),
     `src/app/opengraph-image.tsx` (generated social image), `src/components/react-bits/**`
     (shader/visual-effect internals), `public/**`. Decorative glow/shadow `rgba()` values are
     acceptable; text, surface, border and accent colors must be tokens.
   - Use `bg-brand`, `text-brand`, `bg-ink`, `bg-surface`, `bg-paper`, `text-foreground`,
     `text-muted-foreground`, `border-border`, `text-gradient`, etc.
   - No off-brand Tailwind palette classes (`purple-*`, `indigo-*`, `pink-*`) in layout/UI.
2. **Typography & hierarchy**
   - Exactly one `<h1>` per page; section headings are `<h2>` with `<h3>` for cards; no skipped levels.
   - Display headings use `font-display`; body uses default; code uses `font-mono`.
   - Body text ≥ 16px on mobile for paragraphs; avoid long line lengths (> 75ch).
3. **Responsive layout**
   - Verify no horizontal overflow at 390px and 768px. `overflow-x: clip` on body hides bugs — do
     not rely on it.
   - Grids collapse gracefully (`grid-cols-1` → `md:grid-cols-*`); no fixed widths that exceed viewport.
   - Tap targets ≥ 40×40px on mobile; nav reachable via keyboard + touch.
4. **Accessibility**
   - Semantic landmarks: header/nav/main/footer; skip link works.
   - Icon-only buttons have `aria-label`; decorative SVG/animations are `aria-hidden`.
   - Controls use real `<button>` / `<a>`; no click-only `div`s.
   - Dialog: focus trap, Escape closes, labelled title/description.
   - Async demo state announced via `role="status"` / `aria-live="polite"`.
   - Color contrast: muted text on dark/light surfaces still readable (target WCAG AA).
5. **Motion**
   - All animation is decorative and non-blocking; content is visible without JS/WebGL.
   - `prefers-reduced-motion` respected (global CSS + avoid extra JS motion).
   - WebGL backgrounds (Aurora/Orb) should not swallow pointer events (use `pointer-events-none`
     unless interaction is intended) and should be visually contained.
6. **Components**
   - Functional primitives use shadcn/ui (`Button`, `Dialog`, `Tabs`, `Sheet`, `Input`, `Tooltip`).
   - Motion/backgrounds use React Bits (`src/components/react-bits/`), not one-off GSAP/canvas code.
   - Reuse `Container`, `SectionHeading`, `ExioLogo`, `WaitlistButton`; don't duplicate their styles.
   - Check for duplicated section markup that should be a shared component.
7. **Theme**
   - Verify the change in both `data-theme="dark"` and `data-theme="light"`.
   - Canvas stays neutral (graphite / off-white); do not add green/teal background washes. Green is an
     accent only (CTAs, charts, glows, links).
   - Fixed product surfaces (wallet mock, approval demo, code window, CTA panel) stay dark in both
     themes and use explicit white/alpha text or fixed tokens — never `text-foreground`.
   - New colors must be tokens in `globals.css`, defined for both schemes.
8. **Language**
   - Every user-visible string must exist in both `src/i18n/messages.ts` dictionaries and be read
     via `useI18n().t`. No hardcoded English/Chinese in JSX.
   - Language toggle must keep the target-language icon (CN / UK flag) and menu labels must not wrap
     in either language. Header/nav/CTA text needs `whitespace-nowrap` where appropriate.
   - Verify both layouts: Chinese headlines are shorter/wider; check wrapping and empty space.
9. **Content hygiene**
   - User-visible copy lives in `src/constants/` where practical; no TODO/lorem/placeholder text.
   - No fabricated regulatory claims or real customer/partner endorsements; footer disclaimer intact.
   - Links resolve to anchors or real URLs; no dead `href="#"`.
10. **Tests & quality**
   - New interactive client components have a Vitest test (open/close, approve/decline, validation).
   - Add Playwright coverage for theme/language switching and persistence.
   - Existing Playwright specs still pass; add selectors via roles/labels rather than CSS classes.
   - Run: `pnpm type-check && pnpm lint && pnpm test`.
11. **Performance**
   - Keep `'use client'` scoped to interactive leaf components, not entire sections/pages.
   - Do not block paint on WebGL; avoid autoplaying heavy canvases far offscreen.
   - Static assets live in `public/`; no hot-linked remote images unless unavoidable.
