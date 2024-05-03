'use strict';

var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

async function createRouter(options) {
  const { logger } = options;
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.json({ status: "ok" });
  });
  router.get("/topo", (_, response) => {
    var data = fs__default["default"].readFileSync("/data/data.json");
    logger.info(data);
    response.write(data);
  });
  router.use(backendCommon.errorHandler());
  return router;
}

exports.createRouter = createRouter;
//# sourceMappingURL=router-5706232b.cjs.js.map
