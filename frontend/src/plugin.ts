import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const progressiveDeliveryPlugin = createPlugin({
  id: 'progressive-delivery',
  routes: {
    root: rootRouteRef,
  },
});

export const ProgressiveDeliveryPage = progressiveDeliveryPlugin.provide(
  createRoutableExtension({
    name: 'ProgressiveDeliveryPage',
    component: () =>
      import('./components/ProgressiveDeliveryComponent').then(m => m.TopologyComponent),
    mountPoint: rootRouteRef,
  }),
);
