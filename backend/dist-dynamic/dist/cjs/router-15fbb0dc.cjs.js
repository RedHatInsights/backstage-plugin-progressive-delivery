'use strict';

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
  router.get("/healthcheck", (_, response) => {
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

exports.createRouter = createRouter;
//# sourceMappingURL=router-15fbb0dc.cjs.js.map
