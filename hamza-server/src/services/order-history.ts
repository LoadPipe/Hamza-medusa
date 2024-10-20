import { TransactionBaseService, Logger, generateEntityId, OrderStatus, PaymentStatus, FulfillmentStatus } from '@medusajs/medusa';
import { OrderHistoryRepository } from '../repositories/order-history';
import { OrderHistory } from '../models/order-history';
import { Order } from '../models/order';
import { createLogger, ILogger } from '../utils/logging/logger';

type CreateOrderHistoryInput = {
    to_status: OrderStatus | null,
    to_payment_status: PaymentStatus | null,
    to_fulfillment_status: FulfillmentStatus | null,
    metadata?: Record<string, unknown>
};


export default class OrderHistoryService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly orderHistoryRepository_: typeof OrderHistoryRepository;

    constructor(container) {
        super(container);
        this.orderHistoryRepository_ = OrderHistoryRepository;
        this.logger = createLogger(container, 'OrderHistoryService');
    }

    async create(order: Order, createInput: CreateOrderHistoryInput) {
        const item: OrderHistory = new OrderHistory();

        item.order_id = order.id;
        item.to_status = createInput.to_status;
        item.to_payment_status = createInput.to_payment_status;
        item.to_fulfillment_status = createInput.to_fulfillment_status;
        item.metadata = createInput.metadata;

        this.orderHistoryRepository_.save(item);
    }
}
