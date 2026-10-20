---
name: visual-qa
description: Run the RWA Agent terminal, capture dark/light and EN/ZH screenshots at large-screen and mobile widths, verify the flow, and report visual/interaction issues.
---

# visual-qa

Visually verify the terminal after UI changes. Focus on large-screen presentation (1920×1080),
standard laptop (1440×900), and mobile (390×844).

## Steps

1. Start `pnpm dev` (port 3005) and wait for it to respond.
2. Use Playwright to screenshot:
   - welcome in dark/light and EN/ZH
   - intent form and funding panel
   - strategy cards (after agent selection)
   - large-payment approval overlay
   - settlement timeline and receipt
   - mobile welcome/intent and header controls
3. Check:
   - header logo aligns with the left workspace content at each width
   - left workspace vs right monitor contrast (dark workspace neutral graphite, monitor near-black)
   - CTA light/sheen/magnet and welcome copy entrance animation; clicks still land reliably
   - no clipping/overflow; monitor scrolls; logs auto-scroll
   - both themes and languages persist after reload
   - full large and small flows reach the receipt; rejection resets
4. Report findings by severity, then fix and re-screenshot.

Do not judge the animation from a stale screenshot; allow the StarBorder/log animation to settle.
