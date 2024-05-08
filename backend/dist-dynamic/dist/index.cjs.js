'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plugin = require('./cjs/plugin-f0607bfa.cjs.js');
require('@backstage/backend-common');
require('@backstage/backend-plugin-api');
require('express');
require('express-promise-router');

const dynamicPluginInstaller = {
  kind: "legacy",
  router: {
    pluginID: "progressive-delivery",
    createPlugin: plugin.createRouter
  }
};

exports.createRouter = plugin.createRouter;
exports["default"] = plugin.progressive_deliveryPlugin;
exports.dynamicPluginInstaller = dynamicPluginInstaller;
//# sourceMappingURL=index.cjs.js.map
