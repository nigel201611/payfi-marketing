# naka-rwa-agent — RWA Agentic Payment Terminal

A bilingual roadshow demo for compliant RWA purchases made by an AI agent. The product is
“Naka RWA Agent”; the browser title is **Agentic Payment**.

> **References**
>
> - Product PRD: `docs/agentic-payment-prd.md`
> - Ops/env config: `docs/operations-environment.md`
> - UI prototype: https://6klwjyb3jee3c.ok.kimi.link/
> - Design continuity: the earlier EX.IO / Stripe-inspired dark-light system in this repo
> - Repo/Pages name: `payfi-marketing` (kept so the existing Pages URL and base path remain stable)

## Product Flow

Welcome/KYC → intent authorization & virtual-account funding → agent scans RWA assets and creates an
order → small payment auto-pays / large payment blocks for human approval → mocked CRB clearing →
mock on-chain RWA settlement → receipt and reset. The right Agent Monitor streams mock
`MCP`/`CRB`/`WEBHOOK` activity.

**All bank, MCP, PayFi, and RWA settlement APIs are mocked in the browser.** No real funds or bank
API are used. Keep the visible “Mock Data Only / mock runtime” labels.

## Stack

- Next.js 16 (App Router), React 19, TypeScript strict
- Tailwind CSS v4; semantic dark/light tokens in `src/app/globals.css`
- shadcn/ui primitives available; React Bits for `StarBorder`, `Magnet`, `CountUp`
- `motion` for stage transitions
- Vitest + Testing Library; Playwright desktop/mobile
- ESLint 9, Prettier, Husky/lint-staged
- pnpm; GitHub Pages static export via `.github/workflows/deploy-pages.yml`

## Commands

```bash
pnpm dev          # http://localhost:3005
pnpm build        # standalone build
pnpm build:pages  # static export + /payfi-marketing base path
pnpm lint
pnpm type-check
pnpm test         # Vitest
pnpm test:e2e     # Playwright
pnpm format
```

## Structure

```text
src/
  app/                 # layout, root page, globals.css, metadata routes
  app/api/             # BFF-only routes (*.server.ts; dropped from the Pages export)
  components/
    terminal/          # state machine, steps, overlays, monitor, header, CTA
    react-bits/        # vendored registry components
    providers/         # ThemeProvider + LocaleProvider
    ui/                # shadcn/ui primitives + restored ThemeToggle
  constants/
    terminal.ts        # RWA data, demo orders, timings, validation, currency
    site.ts
  lib/
    agent/             # deterministic settlement policy, optional LLM planner, runner
    mcp/               # MCP tool types, mock / BFF / HTTP transports
  i18n/
    messages.ts        # all EN/ZH UI + log + receipt copy
    locale-provider.tsx
docs/                  # PRD and product documentation
__tests__/             # Vitest (helpers + dictionary parity)
e2e/                   # Playwright flows
```

## State & Timers

- `Terminal` owns `stage`, `intentPhase`, `order`, `overlay`, `settled`, `receipt`, and `logs`.
- Delays use `schedule()` with a run token and a `timers` ref; `reset` and unmount clear timers.
- Settlement is driven by `runSettlement()` with an `AbortController`; reset/unmount abort in-flight
  MCP calls. MCP monitor entries come from agent events, not ad-hoc timers.
- Log entries store a translation key + params, so changing language re-renders historical logs.
- Demo choices:
  - large = 16 × U.S. Treasury Certificate 30D = $16,000 → approval
  - small = 10 × New Energy Plant Revenue Rights #07 = $6,000 → auto payment
- Timings live in `src/constants/terminal.ts` (`timing`).

## Agent & MCP

- MCP tools use the PRD names in `src/lib/mcp/types.ts`: `setup_crb_funding`,
  `check_crb_balance`, `create_trade_order`, `execute_crb_payment`, `reject_payment`,
  `verify_crb_settlement`, `execute_onchain_settlement`, `confirm_delivery`.
- Settlement auto-calls `execute_crb_payment` → `verify_crb_settlement` →
  `execute_onchain_settlement`; receipt confirmation calls `confirm_delivery`.
- BFF routes are `src/app/api/**/route.server.ts`: `/api/agent/intake` (launch brief analysis with
  deterministic fallback), `/api/agent/plan` (deterministic policy + optional LLM planner) and
  `/api/mcp/tool` (MCP facade). The `.server.ts` extension plus `pageExtensions` in
  `next.config.ts` keeps them out of the Pages static export.
- Launch flow: Welcome → Step 01 intake stage → Step 02 intent. The intake brief is analyzed by the
  LLM when configured; back from intent aborts the in-flight analysis, clears intent/order/timer
  state and keeps the last brief plus the five most recent briefs in localStorage.
- Runtime transport: `NEXT_PUBLIC_BFF_ENABLED=true` calls the BFF; static Pages builds use the
  in-browser mock. Set `MCP_CRB_SERVER_URL` / `MCP_CRB_SERVER_TOKEN` and `MCP_RWA_SERVER_URL` /
  `MCP_RWA_SERVER_TOKEN` on the server. `mcpToolServer` routes CRB funding/payment/verification to
  the CRB MCP and order/on-chain/delivery tools to the RWA MCP; each side falls back to the mock
  independently when its URL is empty.
- The LLM planner is optional. `AGENT_LLM_PROVIDER` selects `deepseek` / `kimi` / `codex` /
  `openai` / `glm`; provider keys fall back to `DEEPSEEK_API_KEY`, `MOONSHOT_API_KEY`,
  `OPENAI_API_KEY` and `ZHIPU_API_KEY`. `AGENT_LLM_API_KEY`, `AGENT_LLM_BASE_URL`,
  `AGENT_LLM_MODEL` and `AGENT_LLM_PROTOCOL` override the preset; Codex uses the OpenAI Responses
  API. GLM-5.3 always thinks, so the preset pins `reasoning_effort: low`. Without a key the
  deterministic plan runs. LLM output is rejected unless the order, payee, amount and wallet match
  the authorized intent exactly.
- These secrets are server-only; never expose them through `NEXT_PUBLIC_*`.

## Design System

- Fonts: Manrope display, Geist body, Geist Mono terminal logs.
- Dark/light themes; default dark. Persist theme (`naka-theme`) and locale (`naka-locale`) in
  `localStorage`; init before paint in `layout.tsx`.
- Left workspace uses `bg-workspace` / `bg-workspace-card`; right Agent Monitor is fixed
  `#050706` in both themes to keep a clear information-vs-terminal split.
- Green (`brand`) is an accent, not a background wash. Avoid cyan/teal background fields.
- The welcome copy uses staggered `animate-hero-in`; the primary CTA uses React Bits StarBorder +
  a bounded Magnet (max offset 8px) + a sheen; keep the CTA click target stable.
- The intent/funding panel uses React Bits `SpotlightCard` at low intensity over a flat vara-style
  surface: 16px radius, hairline border, no shadow, filled 48px inputs and a green gradient pill.
- The welcome stage in light mode uses a near-white paper-grid background (fine grid + faint green
  halo) across the whole left panel. Other stages keep the plain `bg-workspace` so dialogs and
  forms stay clean. The welcome title uses React Bits `GradientText` with a plain-text fallback.
  Avoid WebGL backgrounds (Aurora/Orb): a lost context leaves a broken canvas in headless/limited
  GPU environments.
- The previous EX.IO favicon (`public/icon.png`) is intentionally retained.

## Content & i18n

- **All user-visible copy lives in `src/i18n/messages.ts`**; update `en` and `zh` together. The
  unit test enforces structural parity. Do not hardcode product copy in JSX.
- Use `useI18n().t` and `formatMessage` for templates; currency with `formatCurrency` from
  `constants/terminal.ts`.
- Keep the Naka client identity, CI/BR numbers, RWA asset values, and mock routing/account numbers
  consistent with the PRD/prototype unless the PRD changes.

## Quality Gates

- Run `pnpm lint`, `pnpm type-check`, `pnpm test`, and `pnpm test:e2e` before finishing.
- Full-flow E2E covers large/approval and small/auto paths plus rejection, language/theme
  persistence, and mobile overflow.
- Test both themes and both locales when changing layout or copy.
- Verify at 1440 and 1920 widths; the roadshow target is a large screen.
- Run `/review-ui` on the working diff; use `/visual-qa` for screenshots.
- Do not commit unless the user asks. No `console.log`/`debugger`.

## Deployment

- GitHub Pages: `GITHUB_PAGES=true` static export with base path `/payfi-marketing`.
- The Pages build drops every `route.server.ts` BFF route; the browser falls back to the mock MCP
  and deterministic plan. Node deployments keep the BFF and can forward to the real MCP.
- Workflow: `.github/workflows/deploy-pages.yml`; it also calls the Pages API to keep the source
  on GitHub Actions.
- Docker: multi-stage `Dockerfile` (`node:22-alpine`, standalone, non-root, port 3005);
  `.gitlab-ci.yml` builds with Kaniko, pushes to ACR and triggers the Helm chart repo for dev.
  Full env/ops details live in `docs/operations-environment.md`.
- Page title: `Agentic Payment`; package name: `agentic-payment-fe`.
- A custom domain would require removing the base path and adding the CNAME; do not do this unless
  asked.
