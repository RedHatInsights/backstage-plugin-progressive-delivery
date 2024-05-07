'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var backendPluginApi = require('@backstage/backend-plugin-api');
var router = require('./cjs/router-7e904332.cjs.js');
require('express');
require('express-promise-router');

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
        http.use(() => router.createRouter({ ...config, logger: backendCommon.loggerToWinstonLogger(logger) }));
        http.addAuthPolicy({ path: "/health", allow: "unauthenticated" });
        http.addAuthPolicy({ path: "/topo", allow: "unauthenticated" });
      }
    });
  }
});

exports["default"] = progressive_deliveryPlugin;
//# sourceMappingURL=alpha.cjs.js.map
