---
name: visual-qa
description: Run the site and visually verify desktop/mobile rendering and interactions with Playwright — screenshots, console errors, responsive checks. Use when finishing any UI change or preparing a roadshow demo.
---

# visual-qa

Take screenshots of the running marketing site, inspect them, and report visual/interaction issues.
**Do not edit code as part of the review pass** — fix after reporting (unless the user asked to fix
everything).

## Steps

1. Start the dev server if it is not running:
   ```bash
   pnpm dev   # http://localhost:3005
   ```
   Wait for the page to respond (`curl -sf http://localhost:3005 >/dev/null`).

2. Capture screenshots at three widths (full page + hero viewport), e.g. with Playwright:
   ```bash
   npx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3005 /tmp/exio-desktop.png
   npx playwright screenshot --viewport-size=390,844 --full-page http://localhost:3005 /tmp/exio-mobile.png
   ```
   Inspect the images with the Read tool. Also check the browser console for errors:
   ```bash
   npx playwright test e2e/home.spec.ts --project=desktop
   ```

3. Check:
   - Hero headline/CTA alignment, line breaks, and gradient legibility.
   - No clipped/overlapping decorative layers or horizontal scroll at 390px.
   - Cards: consistent radius, borders, padding; no text overflow.
   - Light sections: contrast and border visibility; dark sections: glow not washing out text.
   - Sticky header behaviour (transparent at top, backdrop after scroll) and mobile menu.
   - Interactive demo: approve/decline updates, dialog open/close, tabs switch.
   - Footer disclaimer present; link targets valid.

4. Report findings as a short numbered list with severity and the element/section involved.
   Re-screenshot after fixes.

## Notes

- The Playwright MCP server in `.mcp.json` can also be used for interactive inspection.
- Run E2E in both projects: `pnpm test:e2e` (desktop + mobile).
- Avoid judging animation frames from a static screenshot; test one interaction manually.
