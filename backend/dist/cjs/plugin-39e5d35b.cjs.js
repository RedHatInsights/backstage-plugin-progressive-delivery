'use strict';

var backendPluginApi = require('@backstage/backend-plugin-api');
var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const key = "progressiveDelivery.saasPromotionsJson";
async function createRouter(options) {
  const { logger, config } = options;
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.json({ status: "ok" });
  });
  router.get("/topo", (_, response) => {
    response.sendFile(config.getString(key));
  });
  router.use(backendCommon.errorHandler());
  return router;
}

const progressive_deliveryPlugin = backendPluginApi.createBackendPlugin({
  pluginId: "plugin-progressive-delivery-backend",
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: backendPluginApi.coreServices.httpRouter,
        logger: backendPluginApi.coreServices.logger,
        config: backendPluginApi.coreServices.rootConfig
      },
      async init({
        httpRouter,
        logger,
        config
      }) {
        httpRouter.use(
          await createRouter({
            logger,
            config
          })
        );
        httpRouter.addAuthPolicy({
          path: "/health",
          allow: "unauthenticated"
        });
        httpRouter.addAuthPolicy({
          path: "/topo",
          allow: "unauthenticated"
        });
      }
    });
  }
});

exports.createRouter = createRouter;
exports.progressive_deliveryPlugin = progressive_deliveryPlugin;
//# sourceMappingURL=plugin-39e5d35b.cjs.js.map
