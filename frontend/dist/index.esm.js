import { createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "progressive-delivery"
});

const progressiveDeliveryPlugin = createPlugin({
  id: "progressive-delivery",
  routes: {
    root: rootRouteRef
  }
});
const ProgressiveDeliveryPage = progressiveDeliveryPlugin.provide(
  createRoutableExtension({
    name: "ProgressiveDeliveryPage",
    component: () => import('./esm/index-6a8bf752.esm.js').then((m) => m.TopologyComponent),
    mountPoint: rootRouteRef
  })
);

export { ProgressiveDeliveryPage, progressiveDeliveryPlugin };
//# sourceMappingURL=index.esm.js.map
