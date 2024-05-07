import { loggerToWinstonLogger } from '@backstage/backend-common';
import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';

import { createRouter } from './service/router';

/**
 * The progressive-delivery backend plugin.
 *
 * @alpha
 */
export const progressive_deliveryPlugin = createBackendPlugin({
  pluginId: 'plugin-progressive-delivery',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        http: coreServices.httpRouter,
      },
      async init({ config, logger, http }) {
        logger.info("Initing progressive-delivery plugin");
        http.use(() => createRouter({...config, logger: loggerToWinstonLogger(logger)}));
        http.addAuthPolicy({ path: '/health', allow: 'unauthenticated'});
        http.addAuthPolicy({ path: '/topo', allow: 'unauthenticated'});
      },
    });
  },
});
