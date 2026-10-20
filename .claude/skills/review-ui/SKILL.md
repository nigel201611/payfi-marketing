---
name: review-ui
description: Review the working diff for the RWA Agent terminal against this project's UI standards — split layout, themes, bilingual copy, mock-only flows, accessibility, and timers. Pass --fix to auto-apply safe fixes.
---

# review-ui

Review the current working tree (`git diff --name-only`, staged + unstaged) for the
**Naka RWA Agent / RWA Agent** terminal.

## Usage

```
/review-ui        — review and report violations (file:line + suggested fix)
/review-ui --fix  — apply safe fixes where unambiguous
```

Report **Blocking**, **Should fix**, **Nit** groups and end with the single highest-value fix.
Do not edit vendored React Bits internals to satisfy a style rule.

## Checklist

1. **Layout**
   - Full-height split on `lg`: left workspace 60% / right Agent Monitor 40%; mobile stacks and
     remains usable.
   - The header logo/content left edge aligns with the business content below at 1440, 1920 and 390
     widths. The header uses the same `max-w-[940px]` + padding as the workspace content.
   - No horizontal overflow at 390/768/1440/1920; the monitor scrolls internally on desktop.
2. **Theme**
   - Verify dark and light themes. Dark workspace is neutral graphite (`--workspace`), not a green
     color wash; the monitor stays near-black (`#050706`) in both.
   - Text/surfaces use semantic tokens; fixed dark panels use explicit white/alpha colors.
   - Theme choice persists (`naka-theme`) and is applied before paint.
3. **Language**
   - All visible copy exists in both `en` and `zh` in `src/i18n/messages.ts`; no hardcoded product
     copy. The unit test enforces dictionary parity.
   - Logs store translation keys + params so language changes translate history.
   - Language choice persists (`naka-locale`); header language switch shows the target flag.
4. **Flow**
   - Welcome → intent/funding → strategy → auto-pay or blocking approval → settlement → receipt.
   - Large uses $16,000 (> $10,000 limit) and approval; small uses $6,000 and auto-pay.
   - Reject cancels the order; reset restores welcome and reseeds logs.
   - All `setTimeout`s are tracked and cleared on reset/unmount (run token).
5. **Interaction & motion**
   - Primary launch CTA uses StarBorder + bounded Magnet (max 8px), is easy to click, and returns.
   - Welcome copy animates in with a stagger; the CTA has a light sheen and glow.
   - `prefers-reduced-motion` is respected.
6. **Accessibility**
   - Dialogs have labels and focus management; buttons/inputs are labelled; status changes are
     announced; monitor uses `role="log"`.
   - Do not rely on color alone for state; include text.
7. **Content**
   - Mock-only wording is visible; no real bank/PayFi/RWA API calls.
   - Page title is **RWA Agent**; favicon is the previous `public/icon.png`.
   - The prototype/PRD remain the source for labels, amounts, routing/account numbers, and Naka
     client identity.
8. **Tests**
   - `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm test:e2e` pass.
   - New terminal interactions have coverage; don't weaken the full-flow or rejection tests.
