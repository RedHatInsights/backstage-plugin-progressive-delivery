import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { progressiveDeliveryFrontendPlugin, EntityProgressiveDeliveryContent } from '../src/plugin';

const mockEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'progressive-delivery-demo', namespace: 'default' },
  spec: { type: 'service', lifecycle: 'experimental', system: 'examples' },
};

createDevApp()
  .registerPlugin(progressiveDeliveryFrontendPlugin)
  .addPage({
    element: (
      <EntityProvider entity={mockEntity}>
        <EntityProgressiveDeliveryContent />
      </EntityProvider>
    ),
    title: 'Progressive Delivery',
    path: '/progressive-delivery-frontend',
  })
  .render();
