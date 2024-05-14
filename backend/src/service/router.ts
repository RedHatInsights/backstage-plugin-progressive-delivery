import { errorHandler, loadBackendConfig } from '@backstage/backend-common';
//import { useApi, configApiRef, identityApiRef } from '@backstage/core-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
//import { Logger } from 'winston';
import { LoggerService } from '@backstage/backend-plugin-api';

export interface RouterOptions {
  logger: LoggerService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    console.log("Health");
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.get('/topo', (_, response) => {
    loadBackendConfig({logger: logger, argv: []})
      .then((config) => {
        const key = 'progressive-delivery.saas-promotions-json';

        console.log("SMR KEYS 1", config.keys());
        console.log("SMR KEYS 2", config.get('progressive-delivery'));
        console.log("SMR KEYS 3", config.get(key));

        response.sendFile(config.getString(key));
    }).catch((error) => {
        console.log("No config");
        console.log(error);
        response.sendStatus(500);
      });
  })
  router.use(errorHandler());
  return router;
}
