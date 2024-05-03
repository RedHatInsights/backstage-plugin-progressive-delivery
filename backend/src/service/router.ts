import { errorHandler, loadBackendConfig } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.get('/topo', (_, response) => {
    loadBackendConfig({logger: logger, argv: []})
      .then((config) => {
        response.sendFile(config.getString('progressive-delivery.saas-promotions-json'));
    }).catch((error) => {
        console.log("No config");
        console.log(error);
        response.sendStatus(500);
      });
  })
  router.use(errorHandler());
  return router;
}

