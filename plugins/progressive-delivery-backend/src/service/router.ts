import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

const key = 'progressiveDelivery.saasPromotionsJson';

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  logger.info("config", config)
  logger.info("keyyyyyyyy", key)

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.get('/topo', (_, response) => {
    logger.info("WHERE IS IT", config.getString(key))
    response.sendFile(config.getString(key));
  })
  router.use(errorHandler());
  return router;
}
