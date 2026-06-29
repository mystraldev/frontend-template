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
| `pnpm run docker:up`    | Build + run via Compose  |
| `pnpm run docker:down`  | Stop the Compose stack   |
| `pnpm run docker:build` | Build the image          |
| `pnpm run docker:run`   | Run the built image      |

## Linting

ESLint uses the flat-config format ([eslint.config.js](eslint.config.js)) with
type-aware rules (`typescript-eslint` `strictTypeChecked` +
`stylisticTypeChecked`). Prettier owns formatting; `eslint-config-prettier` runs
last to disable any stylistic overlap. Stale `eslint-disable` directives are
reported as errors.

### Plugins included

| Plugin                                   | Scope                         | What it adds                                                              |
| ---------------------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `typescript-eslint` (strict + stylistic) | all `.ts`/`.tsx`              | Type-aware correctness and logical-style rules                            |
| `eslint-plugin-react-hooks`              | `src`, `test`                 | Rules of Hooks + React Compiler rules (`flat/recommended-latest` preset)  |
| `@eslint-react/eslint-plugin`            | `src`, `test`                 | Core React rules (the ESLint-10-ready successor to `eslint-plugin-react`) |
| `eslint-plugin-jsx-a11y`                 | `src`, `test`                 | JSX accessibility (alt text, ARIA validity, roles, keyboard handlers)     |
| `eslint-plugin-react-refresh`            | `src`, `test`                 | Keeps components fast-refresh-safe                                        |
| `eslint-plugin-import-x`                 | all `.ts`/`.tsx`              | Import ordering, no-duplicates, no-duplicate-exports                      |
| `eslint-plugin-unicorn`                  | all `.ts`/`.tsx`              | Opinionated modernization / correctness rules                             |
| `eslint-plugin-sonarjs`                  | all `.ts`/`.tsx`              | Bug-pattern detection and cognitive-complexity checks                     |
| `eslint-plugin-regexp`                   | all `.ts`/`.tsx`              | Regex correctness/ReDoS safety + autofix                                  |
| `eslint-plugin-perfectionist`            | all `.ts`/`.tsx`              | Sorts objects, types, interfaces, enums, unions, JSX props (not imports)  |
| `eslint-plugin-unused-imports`           | all `.ts`/`.tsx`              | Auto-removes unused imports on `--fix`                                    |
| `@vitest/eslint-plugin`                  | `test`                        | Vitest test correctness (catches `.only`, bad assertions)                 |
| `eslint-plugin-testing-library`          | `test`                        | React Testing Library best practices                                      |
| `eslint-plugin-playwright`               | `e2e`, `playwright.config.ts` | Playwright e2e correctness                                                |

A few deliberate wiring choices:

- **`import-x` resolution rules** (`no-unresolved`, `named`, `default`,
  `namespace`) are **off** — TypeScript's own checker covers module resolution
  better, which avoids a separate resolver dependency. The bundled node resolver
  is wired only so `import-x/order` can classify import groups.
- **`import-x/order` owns import ordering**, so `perfectionist`'s import-sorting
  rules are left off (running both fix-fights). Perfectionist handles all other
  sorting (objects, types, enums, JSX props).
- **`unused-imports` owns unused detection** (`@typescript-eslint/no-unused-vars`
  is disabled) because it can auto-_remove_ dead imports on `--fix`, which the
  ts-eslint rule deliberately won't.
- **`jsx-a11y`** runs fine on ESLint 10 even though its published peer-dep range
  still caps at `^9` (the code uses no APIs removed in v10). The stale-cap
  install warning is silenced via a `peerDependencyRules` entry in
  [pnpm-workspace.yaml](pnpm-workspace.yaml); revisit when a release lists
  ESLint 10 ([jsx-eslint #1075](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075)).

### Plugins deliberately omitted (ESLint 10 compatibility)

This template runs ESLint 10, and parts of the plugin ecosystem have not caught
up. The following are **not** installed:

- **`eslint-plugin-react`** — caps at ESLint `^9` and throws at runtime on 10.
  Replaced by `@eslint-react/eslint-plugin` above.
- **`eslint-plugin-import`** — caps at ESLint `^9` and breaks at runtime on 10.
  Replaced by `eslint-plugin-import-x` above.
- **`eslint-plugin-jest-dom`** — peer dep caps at ESLint `^9`; low marginal
  value over `testing-library`, so skipped rather than force-installed.
- **`eslint-plugin-promise`** — redundant: `strictTypeChecked` already enforces
  the type-aware promise suite (`no-floating-promises`, `no-misused-promises`,
  …); the plugin only adds stylistic rules on top.
- **`@eslint/compat`** — a flat-config shim for legacy plugins; nothing in this
  stack needs it (every plugin here is flat-config-native).

## Docker

```bash
pnpm run docker:up
# or build and run the image manually:
pnpm run docker:build
pnpm run docker:run
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
