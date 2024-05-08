import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
export interface RouterOptions {
    logger: LoggerService;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
