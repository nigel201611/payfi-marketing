# Naka RWA Agent — Agentic Payment Terminal

A bilingual, full-screen roadshow demo for compliant RWA purchases made by an AI agent.

The terminal follows the product flow in [`docs/agentic-payment-prd.md`](docs/agentic-payment-prd.md)
(implementation details in [`docs/agent-design.md`](docs/agent-design.md)) and the visual/UX
reference at <https://6klwjyb3jee3c.ok.kimi.link/>:

```text
Welcome / KYC
  → Intent authorization & virtual-account funding
  → Agent scans RWA assets and creates an order
      ├─ small amount: automatic payment
      └─ large amount: blocking human approval
  → CRB fiat clearing → on-chain RWA settlement
  → delivery receipt + demo reset
```

The right-hand **Agent Monitor** streams the mock MCP / CRB / webhook activity in real time. All
banking, MCP, PayFi and RWA settlement calls are mocked in the browser — no funds move and no
real bank API is called.

> Live demo: **https://nigel201611.github.io/payfi-marketing/**  
> The browser tab title is **RWA Agent**. The GitHub repository is still named
> `payfi-marketing` so the existing Pages URL remains stable.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 with the existing dark / light brand tokens
- React Bits for the primary CTA (`StarBorder`, `Magnet`) and numeric animation (`CountUp`)
- shadcn/ui primitives available for future screens
- Bilingual copy (English / 简体中文) and persisted themes
- Vitest + Testing Library (unit), Playwright (desktop + mobile)
- GitHub Pages static export via GitHub Actions

## Run

```bash
pnpm install
pnpm dev            # http://localhost:3005
```

The demo defaults to dark mode. Use the header controls to switch theme and language; the
preferences are stored in `localStorage`.

### Tests & build

```bash
pnpm lint
pnpm type-check
pnpm test           # helpers + EN/ZH dictionary parity
pnpm test:e2e       # both payment paths, approval rejection, theme/language persistence, mobile
pnpm build          # Node standalone build
pnpm build:pages    # static export under /payfi-marketing for GitHub Pages
```

## Project Structure

```text
src/
  app/
    layout.tsx          # fonts, providers, metadata, theme/locale init
    page.tsx            # renders <Terminal />
    globals.css         # brand tokens, theme variables, terminal animations
  components/
    terminal/
      terminal.tsx      # state machine, timers, logs, split layout
      terminal-header.tsx
      welcome-step.tsx
      intent-step.tsx   # authorization form + funding instructions
      strategy-step.tsx # RWA asset selection
      settlement-step.tsx
      receipt-step.tsx
      overlays.tsx      # approval / auto-payment / rejection
      agent-monitor.tsx # right-hand live log terminal
      animated-cta.tsx  # StarBorder + subtle Magnet
    react-bits/         # vendored React Bits components
    providers/          # theme + locale providers
    ui/                 # shadcn/ui primitives and theme toggle
  constants/
    terminal.ts         # RWA mock data, timings, validation, currency formatting
    site.ts
  i18n/
    messages.ts         # all visible copy in EN and 中文
    locale-provider.tsx
docs/
  agentic-payment-prd.md
  agent-design.md
  operations-environment.md
```

## Mock Data

| Item                         | Value                                                                    |
| ---------------------------- | ------------------------------------------------------------------------ |
| Demo client                  | Naka Financial Technologies Ltd. (pre-seeded KYC)                        |
| Single-transaction limit     | $10,000                                                                  |
| Max budget / available funds | $100,000 (editable)                                                      |
| Large demo order             | 16 × U.S. Treasury Short-Term Certificate 30D → $16,000 → human approval |
| Small demo order             | 10 × New Energy Plant Revenue Rights #07 → $6,000 → auto payment         |
| Payee                        | EXIO Bank · CRB •••• 3456                                                |
| Settlement                   | mocked CRB clearing + mock on-chain RWA delivery                         |

The state machine lives in `src/components/terminal/terminal.tsx`. All delayed agent activity uses
cleared timers and a run token, so resetting or unmounting cannot leak callbacks. All copy is in
`src/i18n/messages.ts`; add new keys to **both** `en` and `zh`.

## Design

The previous EX.IO / Stripe-inspired visual system is retained:

- Manrope display type, Geist body, Geist Mono logs
- Graphite dark theme / off-white light theme; EX.IO green accents
- Left business workspace uses `--workspace` / `--workspace-card`; the right Agent Monitor stays
  near-black in both themes for a clear information/terminal split
- The primary launch CTA keeps the React Bits StarBorder light, a subtle bounded magnet
  (max 8px), and a light sweep; the welcome copy fades/blurs in with a stagger
- The EX.IO favicon from `public/icon.png` is retained as requested; the page title is
  “Agentic Payment”

## GitHub Pages

The workflow `.github/workflows/deploy-pages.yml` exports the static site under the
`/payfi-marketing` base path and deploys it on every push to `main`.

- Build locally with `pnpm build:pages`.
- Repository setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- The workflow also calls the Pages API to ensure the GitHub Actions source; it is idempotent.
- Update `basePath` and `NEXT_PUBLIC_SITE_URL` if the repository is renamed or a custom domain is
  attached.
- The workflow uploads `out/` as the Pages artifact. Generated static files are no longer committed
  at the repository root; `pnpm build:pages` produces them locally under `out/` (gitignored).
