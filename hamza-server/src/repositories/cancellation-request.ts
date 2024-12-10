import { CancellationRequest } from '../models/cancellation-request';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const CancellationRequestRepository =
    dataSource.getRepository(CancellationRequest);
