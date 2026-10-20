# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

RUN npm install -g pnpm@10.12.1
WORKDIR /app

# Docker builds have no .git directory; skip Husky hook installation.
ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_* values are inlined at build time; server-only secrets
# (AGENT_LLM_*, MCP_SERVER_*) must be injected at runtime instead.
ARG NEXT_PUBLIC_SITE_URL=https://www.ex.io
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Next build runs TypeScript checks. `output: standalone` keeps the BFF routes
# (/api/agent/plan, /api/mcp/tool) because GITHUB_PAGES is not set.
# `images.unoptimized` is enabled, but Next may still trace sharp into the
# standalone output; remove it to keep the runtime image small.
RUN pnpm build \
  && rm -rf .next/standalone/node_modules/.pnpm/@img+sharp* \
  && rm -rf .next/standalone/node_modules/.pnpm/@img+colour* \
  && rm -rf .next/standalone/node_modules/.pnpm/sharp@* \
  && rm -rf .next/standalone/node_modules/.pnpm/node_modules/sharp \
  && rm -rf .next/standalone/node_modules/.pnpm/node_modules/@img \
  && rm -rf .next/standalone/node_modules/.pnpm/next@*/node_modules/sharp \
  && rm -rf .next/standalone/node_modules/.pnpm/next@*/node_modules/@img \
  && rm -rf .next/standalone/node_modules/sharp \
  && rm -rf .next/standalone/node_modules/@img

# ─── Runtime ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3005/ || exit 1

CMD ["node", "server.js"]
