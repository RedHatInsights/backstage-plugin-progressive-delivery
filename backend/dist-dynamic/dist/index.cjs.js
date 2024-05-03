'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var router = require('./cjs/router-7e904332.cjs.js');
require('@backstage/backend-common');
require('express');
require('express-promise-router');

const dynamicPluginInstaller = {
  kind: "legacy",
  router: {
    pluginID: "progressive-delivery",
    createPlugin: router.createRouter
  }
};

exports.createRouter = router.createRouter;
exports.dynamicPluginInstaller = dynamicPluginInstaller;
//# sourceMappingURL=index.cjs.js.map
