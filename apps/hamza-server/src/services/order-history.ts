import {
    TransactionBaseService,
    Logger,
    generateEntityId,
    OrderStatus,
    PaymentStatus,
    FulfillmentStatus,
} from '@medusajs/medusa';
import { OrderHistoryRepository } from '../repositories/order-history';
import { OrderHistory } from '../models/order-history';
import { EscrowStatus, Order } from '../models/order';
import { createLogger, ILogger } from '../utils/logging/logger';

type CreateOrderHistoryInput = {
    to_status: OrderStatus | null;
    to_payment_status: PaymentStatus | null;
    to_fulfillment_status: FulfillmentStatus | null;
    to_escrow_status: string | null;
    metadata?: Record<string, unknown>;
};

export default class OrderHistoryService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly orderHistoryRepository_: typeof OrderHistoryRepository;

    constructor(container) {
        super(container);
        this.orderHistoryRepository_ = OrderHistoryRepository;
        this.logger = createLogger(container, 'OrderHistoryService');
    }

    async create(
        order: Order,
        createInput: CreateOrderHistoryInput
    ): Promise<OrderHistory> {
        const item: OrderHistory = new OrderHistory();

        item.order_id = order.id;
        item.to_status = createInput.to_status;
        item.to_payment_status = createInput.to_payment_status;
        item.to_fulfillment_status = createInput.to_fulfillment_status;
        item.to_escrow_status = createInput.to_escrow_status;
        item.metadata = createInput.metadata;

        //calculate item title
        if (item.to_status) {
            item.title = item.to_status.toString();
        } else {
            if (item.to_fulfillment_status)
                item.title = item.to_fulfillment_status.toString();
            else if (item.to_escrow_status)
                item.title = item.to_escrow_status.toString();
            else item.title = item.to_payment_status.toString();
        }

        return this.orderHistoryRepository_.save(item);
    }

    async retrieve(orderId: string): Promise<OrderHistory[]> {
        return this.orderHistoryRepository_.find({
            where: { order_id: orderId },
        });
    }
}
