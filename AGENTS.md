# Progressive Delivery Plugin

## Project Overview

A Backstage frontend plugin for visualizing progressive delivery and SaaS promotion workflows on
catalog entity pages. Built as a dynamic plugin for Red Hat Developer Hub. Frontend-only — reads
promotion data from an external API via Backstage's proxy.

## Dependencies

- **Runtime:** Node.js 22+, Backstage CLI ^0.35.4, React, TypeScript
- **Test:** Jest, Playwright (E2E)
- **Lint:** ESLint, Prettier
- **CI:** None configured in GitHub Actions

## Development Commands

```sh
yarn install                           # Install dependencies
yarn start                             # Start dev server
yarn mock:saas-promotions              # Start mock data server
yarn test                              # Unit tests
yarn test:all                          # All tests with coverage
yarn test:e2e                          # E2E tests
yarn tsc                               # Type checking
yarn lint                              # Lint changed files
yarn lint:all                          # Lint all files
yarn export-dynamic:progressive-delivery  # Build dynamic plugin
```

## Architecture

Backstage monorepo with the plugin in `plugins/progressive-delivery-frontend/`. Includes a mock
server in `dev/saas-promotions-mock/` for local development. See [ARCHITECTURE.md][architecture]
for design decisions.

## Code Style

- **Linter:** ESLint (Backstage preset)
- **Formatter:** Prettier
- **Language:** TypeScript (via `tsconfig.json`)
- **Node.js:** 22+ required

## Common Mistakes

1. **Running `yarn start` without the mock server.** The plugin needs SaaS promotion data. Without
   the mock server (`yarn mock:saas-promotions`) or a configured proxy, the UI renders with empty
   promotion views.

2. **Using `yarn export-dynamic` instead of `yarn export-dynamic:progressive-delivery`.** The
   generic `export-dynamic` script targets a different plugin package. The progressive delivery
   plugin has its own export script.

3. **Running `yarn lint` expecting full coverage.** Defaults to files changed since `origin/main`.
   Use `yarn lint:all` for the complete codebase.

[architecture]: ./ARCHITECTURE.md
