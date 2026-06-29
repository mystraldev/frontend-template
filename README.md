# frontend-template

React + TypeScript frontend starter template with modern tooling.

## Stack

- **Framework:** React 19
- **Build:** Vite 8
- **Language:** TypeScript (strict mode)
- **Package manager:** pnpm
- **Linting:** ESLint (flat config) + Prettier
- **Testing:** Vitest + Testing Library (unit), Playwright (e2e)
- **CI:** GitHub Actions (lint, typecheck, test, build, e2e)
- **Deployment:** Docker (multi-stage build, static `serve`)

## Quick start

```bash
cp .env.example .env.local
pnpm install
pnpm run dev
```

## Scripts

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `pnpm run dev`          | Start dev server         |
| `pnpm run build`        | Type-check and build     |
| `pnpm run preview`      | Preview production build |
| `pnpm run lint`         | ESLint check             |
| `pnpm run format`       | Prettier auto-fix        |
| `pnpm run format:check` | Prettier check           |
| `pnpm run typecheck`    | TypeScript check         |
| `pnpm test`             | Run unit tests           |
| `pnpm run test:e2e`     | Run Playwright e2e tests |
| `pnpm run audit`        | Audit dependencies       |
| `pnpm run ci:quality`   | Run PR quality gate      |
| `pnpm run ci`           | Run full local CI gate   |

## Docker

```bash
docker compose up --build
# or build manually:
docker build -t frontend-template .
docker run -p 3000:3000 frontend-template
```

The image is a two-stage build: the first stage compiles the app, the second
serves the static `dist/` with `serve` as the non-root `node` user (no dev
toolchain in the final image).

> **Build-time env vars:** Vite inlines `VITE_`-prefixed variables into the
> bundle at **build** time, not at container run time. To configure the app per
> environment, pass them during the build (e.g. a `docker build` `--build-arg`
> wired to a Vite env), not via the runtime `environment:` block.

## Release

Releases are tagged manually from the GitHub Actions `Release` workflow. Choose the SemVer bump (`patch`, `minor`, or `major`) when dispatching the workflow; it creates and pushes the next `vX.Y.Z` tag from the latest existing release tag.
