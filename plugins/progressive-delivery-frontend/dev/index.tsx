import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { progressiveDeliveryFrontendPlugin, ProgressiveDeliveryFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(progressiveDeliveryFrontendPlugin)
  .addPage({
    element: <ProgressiveDeliveryFrontendPage />,
    title: 'Root Page',
    path: '/progressive-delivery-frontend',
  })
  .render();
