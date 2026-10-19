# payfi-marketing

Roadshow marketing site for **EX.IO Agent Wallet** — “Give your agent a wallet you control.”

Built with the visual language of [Stripe](https://stripe.com), the agent-payments narrative of
[Link Agents](https://link.com/en-sg/agents), and the EX.IO brand from
[dev.exiovara.com](https://dev.exiovara.com/en). Motion and background effects come from the
[React Bits](https://www.reactbits.dev) registry; functional primitives come from
[shadcn/ui](https://ui.shadcn.com).

> This is a concept experience. Product copy, metrics, customers, and integrations are
> illustrative. The product PRD is still in progress, so all copy lives in typed constants under
> `src/constants/` for easy replacement.
>
> **Scope mirrors the [Link Agents page](https://link.com/en-sg/agents):** agent payments with
> approvals, full purchase history, spending insights, recommendations, quickstart + supported
> surfaces, and coming-soon items. Broader platform features (pricing, trading, security dashboards,
> etc.) are intentionally out of scope until the PRD asks for them.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 with EX.IO design tokens (`src/app/globals.css`)
- React Bits components (`src/components/react-bits/`) for motion, WebGL, and interactions
- shadcn/ui (`src/components/ui/`) for the functional skeleton
- Bilingual copy (English / 简体中文) and persisted dark / light themes
- Vitest + Testing Library (unit), Playwright (E2E)
- ESLint 9 + Prettier + Husky/lint-staged

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3005
```

> The dev server uses port **3005** to avoid clashing with the PayFi admin frontend on 3000/3001.
> `.npmrc` pins `registry.npmmirror.com` for fast installs in this environment; delete it to use
> the default npm registry. Set `NEXT_PUBLIC_SITE_URL` for canonical/OG metadata in a real deploy.

### Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3005 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build on port 3005 |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright (desktop + mobile) |
| `pnpm format` | Prettier |

## Structure

```text
src/
  app/                 # App Router entry, metadata, OG image, robots, sitemap
  components/
    react-bits/        # Components from the official React Bits registry
    ui/                # shadcn/ui primitives + brand buttons/waitlist
    brand/             # EX.IO wordmark
    layout/            # Header, footer, container
    sections/          # Page sections
    demo/              # Agent wallet dashboard + interactive approval demo
    developers/        # Code tabs
    motion/            # Reveal wrapper (React Bits AnimatedContent)
  constants/           # Shared demo data + code samples
  i18n/                # English/Chinese dictionaries + locale provider
  components/providers # Theme + locale providers
__tests__/             # Unit tests
e2e/                   # Playwright specs
scripts/visual-qa.mjs  # Screenshot + console QA helper
```

## Design tokens

| Token | Value | Usage |
| --- | --- | --- |
| `brand` | `#00DD95` | Primary accents, CTAs |
| `brand-ink` | `#007A52` | Text on light surfaces (AA contrast) |
| `brand-soft` | `#69FFCE` | Gradient highlights |
| `ink` | `#04110C` | Dark canvas |
| `paper` | `#F5F8F6` | Light sections |

Typography: **Manrope** (display), **Geist** (body), **Geist Mono** (code).

The canvas is intentionally neutral: near-black graphite in dark mode and off-white in light mode.
EX.IO green is reserved for accents, charts, CTAs, and glows — avoid colour-washing the page background.

## Theme & language

- Theme: `<html data-theme="dark|light">`; toggle in the header or mobile sheet. Choice persists in
  `localStorage` (`exio-theme`) and is applied before paint by an inline script.
- Language: English / 简体中文; toggle shows the target language flag (CN / UK). Choice persists in
  `localStorage` (`exio-locale`), updates `<html lang>`, and swaps all copy from
  `src/i18n/messages.ts`.
- Add new copy to **both** dictionaries (`en` and `zh`) and consume it with `useI18n().t`.
- Fixed product surfaces (wallet dashboard, approval demo, code window, CTA panel) stay dark in
  both themes; the rest of the page follows semantic tokens.

## React Bits registry

`components.json` is configured with the React Bits shadcn registry:

```json
"registries": { "@react-bits": "https://reactbits.dev/r/{name}.json" }
```

Add more components with:

```bash
pnpm dlx shadcn@latest add @react-bits/<ComponentName>-TS-TW
```

Used on the page: Aurora, BlurText, ClickSpark, Magnet, Orb, ShinyText, SpotlightCard, StarBorder,
AnimatedContent. Also vendored for future sections: CountUp, LogoLoop, ScrollVelocity, TiltedCard.

## Troubleshooting

### MetaMask “Failed to connect to MetaMask” dev overlay

This site has **no wallet or Web3 integration** (no `window.ethereum`, wagmi, ethers, or MetaMask
SDK). The error is thrown by MetaMask's own injected `inpage.js` when the extension cannot restore
its session. Next.js surfaces any uncaught page error in the development overlay, including ones
originating from browser extensions.

`src/app/layout.tsx` installs a **development-only** filter that suppresses uncaught errors whose
stack originates from `chrome-extension://…` and mentions MetaMask/Ethereum. Normal application
errors still reach the overlay, and production builds do not include the filter.

If the overlay still appears, reload the tab, restart/update MetaMask, disable it for `localhost`,
or use a clean Chrome profile. The application itself does not depend on MetaMask.

## Quality gates

```bash
pnpm type-check && pnpm lint && pnpm test && pnpm build
```

Claude Code helpers live in `.claude/` — `/review-ui` for UI standards, `/visual-qa` for
screenshot-driven visual checks, and `/commit` for commit messages. `.mcp.json` configures the
Playwright MCP server for interactive inspection.

## GitHub Pages demo

The static demo deploys from `.github/workflows/deploy-pages.yml` on every push to `main`:

- URL: **https://nigel201611.github.io/payfi-marketing/**
- One-time repository setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- Build locally with `pnpm build:pages` (enables static export + the `/payfi-marketing` base path),
  then serve the generated `out/` directory under that path.
- The regular `pnpm build` remains a Node standalone build for non-Pages hosting. The base path and
  repository name live in `next.config.ts`; update both if the repository is renamed.
