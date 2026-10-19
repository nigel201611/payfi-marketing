# payfi-marketing — EX.IO Agent Wallet (Roadshow Concept)

A Stripe-inspired marketing site for **EX.IO Agent Wallet**, a product concept in which AI agents
can spend on a user's behalf with approvals, scoped permissions, and a full audit trail.

> **Reference inputs**
> - Visual/UX reference: [stripe.com](https://stripe.com) — layout, typography, bento cards, developer section.
> - Roadshow benchmark: [link.com/en-sg/agents](https://link.com/en-sg/agents) — agent payments narrative.
> - Brand: [dev.exiovara.com/en](https://dev.exiovara.com/en) — EX.IO logo, Manrope/Geist type, mint-green palette.
> - Engineering conventions: `../exio-payfi-fe` (Next.js 16, TS strict, ESLint/Prettier, Vitest, Playwright, Husky).
>
> **Content is illustrative.** PRDs are still being finalised; keep copy, metrics, logos, and mock
> integrations in typed constants (`src/constants/`) so they can be swapped without touching layout.
>
> **Scope:** the [Link Agents page](https://link.com/en-sg/agents) is the reference for UI, interactions,
> and feature scope. Do not build the broader Stripe homepage feature set (pricing, multi-product
> navigation, security/data dashboards, etc.) until the PRD asks for it.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript strict
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`)
- **UI skeleton**: shadcn/ui (Button, Dialog, Sheet, Tabs, Input, Tooltip…)
- **Motion**: React Bits components (`src/components/react-bits/`) + `motion` + GSAP
- **Theme**: persisted dark / light via `data-theme` + semantic CSS tokens
- **i18n**: persisted English / 简体中文 via `src/i18n/messages.ts` + `useI18n()`
- **Tests**: Vitest (unit), Playwright (E2E)
- **Lint/format**: ESLint 9 + Prettier (+ Tailwind class sorting)
- **Package manager**: pnpm (`.npmrc` pins a fast npm mirror for this environment)

## Commands

```bash
pnpm dev          # http://localhost:3005
pnpm build        # production build
pnpm lint         # eslint
pnpm type-check   # tsc --noEmit
pnpm test         # vitest run
pnpm test:e2e     # playwright (desktop + mobile)
pnpm format       # prettier
```

## Brand System

| Token | Value | Use |
| --- | --- | --- |
| `brand` | `#00DD95` | Primary CTAs, accents, focus |
| `brand-strong` | `#00AB73` | Pressed / saturated accents |
| `brand-ink` | `#007A52` | Small text on light surfaces (AA) |
| `brand-soft` | `#69FFCE` | Gradient start, glows |
| `ink` | `#080A09` | Neutral dark canvas / fixed dark panels |
| `accent-text` | adaptive | `#00DD95` on dark, `#007A52` on light |
| `surface` | `#0A2017` | Cards on dark |
| `paper` | `#F5F8F6` | Light sections |

- Fonts: **Manrope** for display headings (`font-display`), **Geist** for body (`font-sans`),
  **Geist Mono** for code (`font-mono`), loaded through `next/font`.
- Prefer Tailwind theme tokens (`bg-brand`, `text-muted-foreground`, `bg-surface`, `text-gradient`)
  and CSS variables over raw hex values in components.
- The only exceptions for raw color literals are `globals.css`, SVG brand assets, generated
  OG images (`src/app/opengraph-image.tsx`), and React Bits visual-effect components
  (WebGL/shader strings). Decorative glows/shadows may use `rgba()` values; core text, surface,
  border and accent colors must use theme tokens.

## Project Structure

```text
src/
  app/                 # App Router entry, global CSS, metadata
  components/
    react-bits/        # Components pulled from the official React Bits registry
    ui/                # shadcn/ui primitives
    brand/             # EX.IO logo & brand marks
    layout/            # Header, footer, containers, section shell
    sections/          # Page sections (hero, how-it-works, control, developers…)
    demo/              # Interactive product mocks (wallet, approval flow)
  constants/           # Shared demo data + code samples
  i18n/                # en/zh dictionaries + locale provider
  components/providers # Theme + locale providers
  hooks/               # Reusable client hooks
  lib/                 # utils (cn), formatting helpers
__tests__/             # Vitest unit tests (mirrors src/)
e2e/                   # Playwright specs
public/                # Static assets
```

## Conventions

### Components & rendering
- Server components by default; add `'use client'` only for interactivity (state, refs, animations).
- Keep section components composed from small local parts; put replaceable copy in `src/constants/`.
- shadcn/ui is the functional skeleton (dialogs, tabs, sheets). React Bits is the motion layer.
- Do not rewrite React Bits internals unless fixing a bug; note changes in the component header.
- All interactive controls must be keyboard reachable and have visible focus states.

### Styling & theming
- Tailwind utilities + theme tokens only; avoid arbitrary hex values.
- Keep the canvas neutral: near-black graphite (dark) / off-white (light). EX.IO green is an accent
  for CTAs, charts, glows and links — do not wash the page background in green/teal.
- Test every visual change in **both** `data-theme` modes. Fixed product surfaces (wallet mock,
  approval demo, code window, CTA panel) stay dark in both themes; page sections follow tokens.
- Dark product panels use explicit white/alpha text classes, never `text-foreground` (which flips).
- Respect `prefers-reduced-motion` (globals.css already collapses CSS animation; JS effects should
  stay decorative and non-blocking).
- Every section must work at 390 px, 768 px and 1440 px widths.
- Marketing pages should stay readable without the animations (progressive enhancement).

### Content & claims
- This is a concept demo: keep the footer disclaimer and avoid implying real regulatory licences,
  live availability, real partners, or real customer endorsements.
- Customer names, logos, metrics, and agent integrations are fictional placeholders.
- Use EX.IO wording from `dev.exiovara.com` where applicable ("Licensing underway", "OTC desk", etc.);
  otherwise write product copy in `src/constants/`.

### Deployment
- GitHub Pages uses `GITHUB_PAGES=true pnpm build` (static export, base path `/payfi-marketing`)
  via `.github/workflows/deploy-pages.yml`. Keep `next.config.ts` base path and the workflow's
  `NEXT_PUBLIC_SITE_URL` in sync with the repository name.
- Public assets referenced in metadata must be prefixed with `pagesBasePath` (see `layout.tsx`).
- Normal hosting keeps `output: 'standalone'`.

### Testing & quality gates
- Unit tests: `__tests__/` with Testing Library; E2E: `e2e/`.
- Before commit: `pnpm lint`, `pnpm type-check`, `pnpm test`; before push: `pnpm build` (Husky).
- Run `/review-ui` on the working diff before committing.
- Verify visual changes with Playwright screenshots at desktop + mobile and check console errors.
- No `console.log` / `debugger` in committed code.
