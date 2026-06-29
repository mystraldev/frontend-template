# syntax=docker/dockerfile:1

# --- Build stage: full toolchain, produces the static dist/ ---
FROM node:24.18.0-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# --- Runtime stage: production deps only, serves dist/ as non-root ---
FROM node:24.18.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Install with pnpm (via corepack), then strip the bundled npm — it's unused at
# runtime (we run serve directly) and drags in CVEs of its own dependency tree.
RUN corepack enable \
  && pnpm install --prod --frozen-lockfile --ignore-scripts \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node_modules/.bin/serve", "-s", "dist", "-l", "3000"]
