import { BuckyLog } from '../models/bucky-log';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const BuckyLogRepository = dataSource.getRepository(BuckyLog);
