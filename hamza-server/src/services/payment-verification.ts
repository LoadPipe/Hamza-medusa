import { Lifetime } from 'awilix';
import {
    PaymentStatus,
    TransactionBaseService,
} from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';
import OrderService from './order';
import { Payment } from '../models/payment';
import { Order } from '../models/order';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { verifyPaymentForOrder } from '../web3';

export default class PaymentVerificationService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly orderRepository_: typeof OrderRepository;
    protected readonly orderService_: OrderService;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.orderService_ = container.orderService;
        this.logger = createLogger(container, 'PaymentVerificationService');
    }

    async verifyPayments(order_id: string = null): Promise<Payment[]> {
        let output: Payment[] = [];
        let orders = await this.orderService_.getOrdersWithUnverifiedPayments();

        if (order_id)
            orders = orders.filter(o => o.id == order_id);

        for (let order of orders) {
            this.logger.info(`verifying payment for ${order.id}`);
            output = output.concat(await this.verifyPayment(order));
        }

        return output;
    }

    private async verifyPayment(order: Order): Promise<Payment[]> {
        let output: Payment[] = [];
        let allPaid: boolean = true;
        const payments: Payment[] = order.payments;

        //verify each payment of order
        for (let payment of payments) {
            this.logger.info(`verifying payment ${payment.id} for order ${order.id}`);

            if (!await verifyPaymentForOrder(payment.chain_id, order.id, payment.amount)) {
                //if any unverifiable, then the whole order is unverifiable
                allPaid = false;
                break;
            }
        }

        if (allPaid) {
            this.logger.info(`updating order ${order.id}, setting to captured`);
            order.payment_status = PaymentStatus.CAPTURED;
            await this.orderRepository_.save(order);
            output = output.concat(order.payments);
        }

        return output;
    }
}
