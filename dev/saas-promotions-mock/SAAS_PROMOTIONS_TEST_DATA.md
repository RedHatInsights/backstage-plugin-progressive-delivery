# SaaS Promotions mock – test data reference

This doc describes the mock API and the test data in `saas-promotions.json` so local dev and demos line up with the catalog and the Progressive Delivery tab.

## Endpoint and proxy

- **Mock server:** `http://localhost:7008/saas-promotions` (or `SAAS_PROMOTIONS_MOCK_PORT`)
- **From Backstage app:** `/api/proxy/inscope-resources/saas-promotions` (proxy in `app-config.yaml` → `inscope-resources` → port 7008)

## Response shape

```json
{
  "nodes": [ "<node1_json_string>", "<node2_json_string>", ... ],
  "edges": [ ["<from_node_json_string>", "<to_node_json_string>"], ... ]
}
```

Each node is a **JSON string** (not an object) with:

| Field             | Description                          |
|-------------------|--------------------------------------|
| `app`             | Application name (catalog component) |
| `saas`            | SaaS filename (e.g. stage-saas.yaml)|
| `resourceTemplate`| Environment label (dev, stage, production) |
| `target`          | Target env (dev, stage, production)  |
| `cluster`         | Cluster name                         |
| `namespace`       | K8s namespace (e.g. `<app>-pipelines`) |
| `isTest`          | `true` for test/dev jobs             |
| `commit_sha`      | Git commit (short)                   |
| `deployment_state`| `success` or `failed`                |

Edges are ordered `[from, to]` (e.g. stage → prod).

---

## Test data in `saas-promotions.json`

Aligned with catalog components: **test**, **example-website**, **progressive-delivery-demo**.

### Apps and nodes

| App                      | Node (env)   | Cluster       | Namespace                      | commit_sha | deployment_state |
|--------------------------|-------------|---------------|--------------------------------|------------|------------------|
| test                     | stage       | cluster-stage | test-pipelines                 | a1b2c3d    | success          |
| test                     | production  | cluster-prod  | test-pipelines                 | a1b2c3d    | success          |
| example-website          | stage       | cluster-stage | example-website-pipelines      | f4e5d6c    | success          |
| example-website          | production  | cluster-prod  | example-website-pipelines      | f4e5d6c    | success          |
| progressive-delivery-demo| dev (test)  | cluster-dev   | progressive-delivery-demo-pipelines | abc1234 | success  |
| progressive-delivery-demo| stage       | cluster-stage | progressive-delivery-demo-pipelines | abc1234 | success  |
| progressive-delivery-demo| production  | cluster-prod  | progressive-delivery-demo-pipelines | abc1234 | **failed**  |

### Edges (promotion flow)

| From (app : env)              | To (app : env)                 |
|------------------------------|--------------------------------|
| test : stage                  | test : production              |
| example-website : stage       | example-website : production   |
| progressive-delivery-demo : dev | progressive-delivery-demo : stage |
| progressive-delivery-demo : stage | progressive-delivery-demo : production |

So in the UI you should see:

- **test** – stage → prod (both success)
- **example-website** – stage → prod (both success)
- **progressive-delivery-demo** – dev → stage → prod (prod failed)

---

## Catalog components that get the tab

From `examples/entities.yaml`:

- `test` (service)
- `example-website` (website)
- `progressive-delivery-demo` (service)

The Progressive Delivery tab appears for these components; the topology is driven by the mock data above.
