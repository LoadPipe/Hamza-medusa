import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Refund } from '../models/refund';

export const RefundRepository = dataSource.getRepository(Refund);