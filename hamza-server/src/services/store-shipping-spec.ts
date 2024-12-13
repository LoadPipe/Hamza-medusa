import { TransactionBaseService, ProductStatus } from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';
import { StoreShippingSpecRepository } from '../repositories/store-shipping-spec';

export default class StoreShippingSpecService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly storeShippingSpecRepository_: typeof StoreShippingSpecRepository;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'StoreShippingSpecService');
        this.storeShippingSpecRepository_ =
            container.storeShippingSpecRepository;
    }
}
