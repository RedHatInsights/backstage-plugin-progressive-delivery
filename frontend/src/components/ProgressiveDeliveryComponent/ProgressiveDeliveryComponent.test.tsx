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
          system: 'baz',
        }
      },
    },
  })
}));

const data: SaasPromotionsData =  {
  nodes: [
    "{\"app\": \"foo\", \"cluster\": \"foo-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
    "{\"app\": \"bar\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": \"null\", \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}",
    "{\"app\": \"baz\", \"cluster\": \"baz-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
    "{\"app\": \"qux\", \"cluster\": \"qux-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
    "{\"app\": \"quux\", \"cluster\": \"quux-stage-01\", \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
  ],
  edges: [
    [
      "{\"app\": \"foo\", \"cluster\": \"foo-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
      "{\"app\": \"bar\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
    ],
    [
      "{\"app\": \"bar\", \"cluster\": \"bar-stage-01\", \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}",
      "{\"app\": \"baz\", \"cluster\": \"baz-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}"
    ],
    [
      "{\"app\": \"qux\", \"cluster\": \"qux-stage-01\", \"commit_sha\": \"sha\", \"deployment_state\": \"success\", \"isTest\": false, \"namespace\": \"foo-stage\", \"resourceTemplate\": \"foo\", \"saas\": \"foo\", \"target\": null}",
      "{\"app\": \"quux\", \"cluster\": \"quux-stage-01\", \"commit_sha\": \"\", \"deployment_state\": \"\", \"isTest\": false, \"namespace\": null, \"resourceTemplate\": \"baz-demo\", \"saas\": \"saas-baz-demo-a\", \"target\": \"baz-demo-integration-a\"}"
    ]
  ]
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

  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
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

    expect(screen.getByText('Progressive Delivery Topology')).toBeInTheDocument();
    expect(document.getElementsByTagName('svg').length).toEqual(2);
    expect(screen.queryByText('sha ✅')).toBeInTheDocument();
    expect(screen.queryByText('none ❌')).toBeInTheDocument();
    expect(screen.queryByText('on foo-stage-01/foo-stage (foo)')).toBeInTheDocument();
    expect(screen.queryByText('on bar-stage-01/null (saas-baz-demo-a)')).toBeInTheDocument();
    expect(screen.queryByText('on baz-stage-01/foo-stage (foo)')).toBeNull();
    expect(screen.queryByText('on qux-stage-01/foo-stage (foo)')).toBeNull();
    expect(screen.queryByText('on quux-stage-01/null (saas-baz-demo-a)')).toBeNull();
  });
})
