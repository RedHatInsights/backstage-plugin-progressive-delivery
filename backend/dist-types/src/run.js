"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var backend_common_1 = require("@backstage/backend-common");
var yn_1 = require("yn");
var standaloneServer_1 = require("./service/standaloneServer");
var core_plugin_api_1 = require("@backstage/core-plugin-api");
var port = process.env.PLUGIN_PORT ? Number(process.env.PLUGIN_PORT) : 7007;
var enableCors = (0, yn_1.default)(process.env.PLUGIN_CORS, { default: false });
var logger = (0, backend_common_1.getRootLogger)();
var config = (0, core_plugin_api_1.useApi)(core_plugin_api_1.configApiRef);
(0, standaloneServer_1.startStandaloneServer)({ port: port, enableCors: enableCors, logger: logger, config: config }).catch(function (err) {
    logger.error('Standalone server failed:', err);
    process.exit(1);
});
process.on('SIGINT', function () {
    logger.info('CTRL+C pressed; exiting.');
    process.exit(0);
});
