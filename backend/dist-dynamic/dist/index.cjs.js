'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var plugin = require('./cjs/plugin-fdb79d77.cjs.js');
require('@backstage/backend-plugin-api');
require('@backstage/backend-common');
require('express');
require('express-promise-router');

const dynamicPluginInstaller = {
  kind: "legacy",
  router: {
    pluginID: "plugin-progressive-delivery-backend",
    createPlugin: plugin.createRouter
  }
};

exports.createRouter = plugin.createRouter;
exports["default"] = plugin.progressive_deliveryPlugin;
exports.dynamicPluginInstaller = dynamicPluginInstaller;
//# sourceMappingURL=index.cjs.js.map
