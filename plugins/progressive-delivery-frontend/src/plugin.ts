import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const progressiveDeliveryPlugin = createPlugin({
  id: 'progressive-delivery',
});

export const EntityProgressiveDeliveryContent = progressiveDeliveryPlugin.provide(
  createComponentExtension({
    name: 'EntityProgressiveDeliveryContent',
    component: {
      lazy: () => import('./components/ProgressiveDeliveryComponent').then(m => m.ProgressiveDeliveryComponent),
    },
  }),
);

