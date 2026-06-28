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
- **Deployment:** Docker (nginx static server)

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

## Docker

```bash
docker compose up --build
# or build manually:
docker build -t frontend-template .
docker run -p 3000:3000 frontend-template
```
