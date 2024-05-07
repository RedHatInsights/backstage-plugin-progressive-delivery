'use strict';

var backendCommon = require('@backstage/backend-common');
var backendPluginApi = require('@backstage/backend-plugin-api');
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
  pluginId: "plugin-progressive-delivery",
  register(env) {
    env.registerInit({
      deps: {
        logger: backendPluginApi.coreServices.logger,
        config: backendPluginApi.coreServices.rootConfig,
        http: backendPluginApi.coreServices.httpRouter
      },
      async init({ config, logger, http }) {
        logger.info("Initing progressive-delivery plugin");
        http.use(() => createRouter({ ...config, logger: backendCommon.loggerToWinstonLogger(logger) }));
        http.addAuthPolicy({ path: "/health", allow: "unauthenticated" });
      }
    });
  }
});

exports.createRouter = createRouter;
exports.progressive_deliveryPlugin = progressive_deliveryPlugin;
//# sourceMappingURL=plugin-0ad714c0.cjs.js.map
