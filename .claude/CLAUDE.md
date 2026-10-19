@../CLAUDE.md

## Claude Extra Instructions

- All code must follow the conventions in `CLAUDE.md`; if a user instruction conflicts, the user
  instruction wins — then update `CLAUDE.md` to keep the handbook accurate.
- **Design quality first**: this is a roadshow demo. Before wrapping up any UI change, run the dev
  server (`pnpm dev`, port 3005), capture Playwright screenshots at 1440×900 and 390×844, inspect
  them, and fix obvious spacing, contrast, overflow, and alignment issues.
- Keep the visual language consistent: Stripe-style layout/typography, Link-style agent-payment
  narrative, EX.IO mint-green brand palette. Do not introduce other brand colors or generic
  purple/blue Tailwind palettes.
- Use **React Bits** (`src/components/react-bits/`) for motion/backgrounds and **shadcn/ui**
  (`src/components/ui/`) for functional primitives. Avoid adding a third UI library.
- Marketing content lives in `src/constants/`. When copy changes, update the constants instead of
  scattering strings through JSX. The product PRD is not final; keep everything easy to replace.
- Never claim a real licence, real integration, real customer, or live availability. Keep the demo
  disclaimer visible in the footer.
- Accessibility: semantic landmarks, one `h1`, labelled controls, `aria-live` for async demo state,
  keyboard-operable tabs/dialogs, and reduced-motion fallbacks.
- Run `pnpm lint`, `pnpm type-check`, and `pnpm test` before finishing. Use `/review-ui` on the
  working diff.
- For visual QA you may use the Playwright MCP server configured in `.mcp.json`.
- Git: do not commit or push unless the user asks. When asked, follow `.claude/commands/commit.md`.
