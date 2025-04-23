import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { progressiveDeliveryPlugin, ProgressiveDeliveryPage } from '../src/plugin';

createDevApp()
  .registerPlugin(progressiveDeliveryPlugin)
  .addPage({
    element: <ProgressiveDeliveryPage />,
    title: 'Root Page',
    path: '/progressive-delivery'
  })
  .render();
