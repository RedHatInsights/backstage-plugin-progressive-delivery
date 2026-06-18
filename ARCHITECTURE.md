# Architecture

## Overview

A Backstage monorepo containing the Progressive Delivery frontend plugin. Provides entity page
components for visualizing SaaS promotion workflows.

## Module Structure

```text
plugins/
  progressive-delivery-frontend/   # The main plugin package
packages/
  app/                             # Backstage app shell for local development
  backend/                         # Backstage backend for local development
dev/
  saas-promotions-mock/            # Mock server for local development
examples/                          # Example catalog entities
playwright.config.ts               # E2E test configuration
```

## Key Design Decisions

- **Mock server for local dev.** A built-in mock server (`dev/saas-promotions-mock/`) provides
  SaaS promotion data for local development without requiring a live backend.
- **Dynamic plugin export.** Uses janus-cli via `export-dynamic:progressive-delivery` for RHDH
  deployment.
- **Frontend-only plugin.** No backend package — the plugin reads promotion data from an external
  API via Backstage's proxy.
