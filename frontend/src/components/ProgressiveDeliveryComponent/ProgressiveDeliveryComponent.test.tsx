import React from 'react';
import { TopologyComponent, SaasPromotionsData  } from './ProgressiveDeliveryComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  setupRequestMockHandlers,
  renderInTestApp,
  MockConfigApi,
  TestApiProvider,
} from "@backstage/test-utils";
import { configApiRef } from '@backstage/core-plugin-api';

const mockConfig = new MockConfigApi({
  backend: { baseUrl: 'http://127.0.0.1' },
});

jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useEntity: jest.fn().mockReturnValue({
    kind: 'Component',
    namespace: 'default',
    name: 'test',
    entity: {
      metadata: {
        name: 'foo',
        spec: {
          sysystem: 'bar',
        }
      },
    },
  })
}));

// const data: SaasPromotionsData =  {
//   nodes: [
//     "{\"app\": \"foo\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
//     "{\"app\": \"bar\", \"cluster\": null, \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
//   ],
//   edges: [
//     [
//       "{\"app\": \"foo\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
//       "{\"app\": \"bar\", \"cluster\": null, \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
//     ]
//   ]
// };

const data: SaasPromotionsData =  {
  nodes: [
    "{\"app\": \"bar\", \"cluster\": null, \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
  ],
  edges: []
};

describe('ExampleComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    jest.spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() => Promise.resolve(
          {
            // json: () => Promise.resolve(data),
            text: () => JSON.stringify(data)
          }
        )) as jest.Mock)

    server.use(
      rest.get('http://127.0.0.1/api/plugin-progressive-delivery-backend/topo', (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(data)
        )
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should render', async () => {
    await renderInTestApp(
        <TestApiProvider apis={[[configApiRef, mockConfig]]} >
          <TopologyComponent />
        </TestApiProvider>
    );
    await expect(screen.getByText('Progressive Delivery Topology')).resolves.toBeInTheDocument();
    // expect(screen.getByText('Processing ...')).toBeInTheDocument();
    // expect(screen.getByText('foo')).toBeInTheDocument();
  });
});
