import { StoreShippingSpec } from '../models/store-shipping-spec';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const StoreShippingSpecRepository =
    dataSource.getRepository(StoreShippingSpec);
