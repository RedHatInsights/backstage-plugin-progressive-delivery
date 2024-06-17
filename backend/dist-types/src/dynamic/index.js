"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPluginInstaller = void 0;
var router_1 = require("../service/router");
exports.dynamicPluginInstaller = {
    kind: 'legacy',
    router: {
        pluginID: 'plugin-progressive-delivery-backend',
        createPlugin: router_1.createRouter,
    },
};
