import { ExternalApiLog } from '../models/external-api-log';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const ExternalApiLogRepository =
    dataSource.getRepository(ExternalApiLog);
