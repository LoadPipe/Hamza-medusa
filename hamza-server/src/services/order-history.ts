import { TransactionBaseService, Logger, generateEntityId } from '@medusajs/medusa';
import { OrderHistoryRepository } from '../repositories/order-history';
import { OrderHistory } from '../models/order-history';
import { createLogger, ILogger } from '../utils/logging/logger';


export default class OrderHistoryService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly orderHistoryRepository_: typeof OrderHistoryRepository;

    constructor(container) {
        super(container);
        this.orderHistoryRepository_ = OrderHistoryRepository;
        this.logger = createLogger(container, 'OrderHistoryService');
    }

    async create(storeId: string, walletAddress: string) {
    }
}
