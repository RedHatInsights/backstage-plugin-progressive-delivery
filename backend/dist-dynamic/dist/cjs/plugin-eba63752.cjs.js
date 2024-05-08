'use strict';

var backendPluginApi = require('@backstage/backend-plugin-api');
var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

async function createRouter(options) {
  const { logger } = options;
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_, response) => {
    console.log("Health");
    logger.info("PONG!");
    response.json({ status: "ok" });
  });
  router.get("/topo", (_, response) => {
    backendCommon.loadBackendConfig({ logger, argv: [] }).then((config) => {
      response.sendFile(config.getString("progressive-delivery.saas-promotions-json"));
    }).catch((error) => {
      console.log("No config");
      console.log(error);
      response.sendStatus(500);
    });
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
        logger: backendPluginApi.coreServices.logger
      },
      async init({
        httpRouter,
        logger
      }) {
        httpRouter.use(
          await createRouter({
            logger
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
//# sourceMappingURL=plugin-eba63752.cjs.js.map
