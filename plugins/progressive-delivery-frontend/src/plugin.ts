import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const progressiveDeliveryFrontendPlugin = createPlugin({
  id: 'progressive-delivery',
});

export const EntityProgressiveDeliveryContent = progressiveDeliveryFrontendPlugin.provide(
  createComponentExtension({
    name: 'EntityProgressiveDeliveryContent',
    component: {
      lazy: () => import('./components/ProgressiveDeliveryComponent').then(m => m.TopologyComponent),
    },
  }),
);
