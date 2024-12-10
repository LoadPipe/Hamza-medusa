import { CancellationRequest } from '../models/cancellation-request';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const CancellationRepository =
    dataSource.getRepository(CancellationRequest);
