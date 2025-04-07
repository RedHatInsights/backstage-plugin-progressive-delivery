import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import mock from 'mock-fs';

import { createRouter } from './router';
import { MockConfigApi } from '@backstage/test-utils';

describe('createRouter', () => {
  let app: express.Express;
  const mockConfig = new MockConfigApi({
    app: { baseUrl: 'https://example.com' },
    progressiveDelivery: { saasPromotionsJson: '/tmp/saas.json' },
  });

    const data =  {
      "nodes": [
        "{\"app\": \"foo\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
        "{\"app\": \"bar\", \"cluster\": null, \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
      ],
      "edges": [
        [
          "{\"app\": \"foo\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
          "{\"app\": \"bar\", \"cluster\": null, \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
        ]
      ]
    };

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: mockConfig,
    });
    app = express().use(router);

    mock({
      '/tmp/saas.json' : JSON.stringify(data)
    });
  });

  afterAll(async () => {
    mock.restore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /topo', () => {
    it('returns data', async () => {
      const response = await request(app).get('/topo');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(data);
    })
  });
});
