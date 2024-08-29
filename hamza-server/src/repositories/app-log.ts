import { AppLog } from '../models/app-log';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const AppLogRepository = dataSource.getRepository(AppLog);