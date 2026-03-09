# Progressive Delivery mock data (local dev)

Test data for the Progressive Delivery plugin so you can develop and demo without a real SaaS promotions API.

**Test data reference:** [SAAS_PROMOTIONS_TEST_DATA.md](./SAAS_PROMOTIONS_TEST_DATA.md) – response shape, node fields, and how the mock data lines up with the catalog (test, example-website, progressive-delivery-demo).

## Quick start

1. **Start the mock server** (in a separate terminal):

   ```bash
   yarn mock:saas-promotions
   ```

   Or: `node dev/saas-promotions-mock/server.js`

2. **Start Backstage** (from repo root):

   ```bash
   yarn start
   ```

3. Open the catalog and go to any of these components → **Progressive Delivery** tab:

   - **progressive-delivery-demo** – dev → stage → prod (prod shows as failed)
   - **test** – stage → prod
   - **example-website** – stage → prod

## Config

- The app proxy in `app-config.yaml` forwards `/api/proxy/inscope-resources` to this server (port 7008).
- Override port: `SAAS_PROMOTIONS_MOCK_PORT=9000 node dev/saas-promotions-mock/server.js`
