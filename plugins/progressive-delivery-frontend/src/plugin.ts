import { createPlugin, createComponentExtension } from '@backstage/core-plugin-api';

export const progressiveDeliveryPlugin = createPlugin({
  id: 'progressive-delivery-frontend',
});

export const EntityProgressiveDeliveryContent = progressiveDeliveryPlugin.provide(
  createComponentExtension({
    name: 'EntityProgressiveDeliveryContent',
    component: {
      lazy: () => import('./components/ProgressiveDeliveryComponent').then(m => m.TopologyComponent),
    },
  }),
);

