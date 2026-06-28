# frontend-template

React + TypeScript frontend starter template with modern tooling.

## Stack

- **Framework:** React 19
- **Build:** Vite 8
- **Language:** TypeScript (strict mode)
- **Linting:** ESLint (flat config) + Prettier
- **Testing:** Vitest + Testing Library (unit), Playwright (e2e)
- **CI:** GitHub Actions (lint, typecheck, test, build, e2e)
- **Deployment:** Docker (Nginx multi-stage)

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

| Command                 | Description                |
| ----------------------- | -------------------------- |
| `npm run dev`           | Start dev server           |
| `npm run build`         | Type-check + build         |
| `npm run preview`       | Preview production build   |
| `npm run lint`          | ESLint check               |
| `npm run format`        | Prettier auto-fix          |
| `npm run format:check`  | Prettier check             |
| `npm run typecheck`     | TypeScript check           |
| `npm test`              | Run unit tests             |
| `npm run test:e2e`      | Run Playwright e2e tests   |

## Docker

```bash
docker build -t frontend-template .
docker run -p 8080:80 frontend-template
```
