# Progressive Delivery - Backstage Plugin

A Backstage plugin for visualizing progressive delivery and SaaS promotion workflows on catalog
entity pages. Built as a dynamic plugin for Red Hat Developer Hub (RHDH).

## Prerequisites

- Node.js 22+ and Yarn

## Development Setup

```sh
# Install dependencies
yarn install

# Start the dev server
yarn start
```

### Mock SaaS Promotions Server

A mock server is included for local development:

```sh
yarn mock:saas-promotions
```

### Build the Dynamic Plugin

```sh
# Export as dynamic plugin
yarn export-dynamic:progressive-delivery
```

## Testing

```sh
yarn test          # Unit tests
yarn test:all      # All tests with coverage
yarn test:e2e      # E2E tests (Playwright)
yarn tsc           # Type checking
yarn lint          # Lint changed files
yarn lint:all      # Lint all files
yarn prettier:check  # Format check
```

## License

No license file is included in this repository.
