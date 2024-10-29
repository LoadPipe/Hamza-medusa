import { OrderHistory } from '../models/order-history';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const OrderHistoryRepository = dataSource.getRepository(OrderHistory);