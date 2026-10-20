@../CLAUDE.md

## Claude Extra Instructions

- All code must follow the conventions in `CLAUDE.md`; if a user instruction conflicts, the user
  instruction wins — then update `CLAUDE.md` to keep the handbook accurate. This project is the
  Naka RWA Agent terminal, not the earlier marketing site.
- **Design quality first**: this is a large-screen roadshow demo. Before wrapping up any UI change,
  run `pnpm dev` (port 3005), inspect the terminal in dark/light and EN/ZH, and capture Playwright
  screenshots at 1440, 1920, and 390 widths. Check the left workspace vs the right Agent Monitor
  split, CTA light effects, and overflow.
- Keep the established dark/light green branding, Manrope/Geist type, rounded surfaces, and the
  left workspace / right terminal contrast. Do not introduce unrelated palettes or colour washes.
- Use **React Bits** (`src/components/react-bits/`) for motion/backgrounds and **shadcn/ui**
  (`src/components/ui/`) for functional primitives. Avoid adding a third UI library.
- All copy lives in `src/i18n/messages.ts` (EN + ZH). The terminal routes, mock data, and visible
  flow are implemented in `src/components/terminal/` and `src/constants/terminal.ts`.
- All bank/MCP/PayFi/RWA calls are mocked in the browser; never introduce real funds or external
  bank calls in this demo without explicit direction. Keep the mock-runtime footer visible.
- Accessibility: semantic landmarks, one `h1`, labelled controls, `aria-live` for async demo state,
  keyboard-operable tabs/dialogs, and reduced-motion fallbacks.
- Run `pnpm lint`, `pnpm type-check`, and `pnpm test` before finishing. Use `/review-ui` on the
  working diff.
- For visual QA you may use the Playwright MCP server configured in `.mcp.json`.
- Git: do not commit or push unless the user asks. When asked, follow `.claude/commands/commit.md`.
