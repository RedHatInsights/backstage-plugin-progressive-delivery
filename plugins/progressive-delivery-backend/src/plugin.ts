//import { loggerToWinstonLogger } from '@backstage/backend-common';
import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';

import { createRouter } from './service/router';

/**
 * The progressive-delivery backend plugin.
 *
 * @public
 */
export const progressive_deliveryPlugin = createBackendPlugin({
  pluginId: 'plugin-progressive-delivery-backend',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig
      },
      async init({
        httpRouter,
        logger,
        config,
      }) {
        httpRouter.use(
          await createRouter({
            logger,
            config,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/topo',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
