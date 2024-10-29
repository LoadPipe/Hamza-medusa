import { CachedExchangeRate } from '../models/cached-exchange-rate';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const CachedExchangeRateRepository =
    dataSource.getRepository(CachedExchangeRate);
