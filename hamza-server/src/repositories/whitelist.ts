import { WhiteList } from '../models/whitelist';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const WhiteListRepository = dataSource.getRepository(WhiteList);
