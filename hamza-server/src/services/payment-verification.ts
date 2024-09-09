import { Lifetime } from 'awilix';
import {
    PaymentStatus,
    TransactionBaseService,
} from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';
import OrderService from './order';
import { Payment } from '../models/payment';
import { Order } from '../models/order';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { verifyPaymentForOrder } from 'src/web3';

export default class PaymentVerificationService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly paymentRepository_: typeof PaymentRepository;
    protected readonly orderRepository_: typeof OrderRepository;
    protected readonly orderService_: OrderService;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.paymentRepository_ = container.paymentRepository;
        this.orderService_ = container.orderService;
        this.logger = createLogger(container, 'PaymentVerificationService');
    }

    async verifyPayments(): Promise<void> {
        //const payments = await this.getPaymentsToVerify();
        const orders = await this.orderService_.getOrdersWithUnverifiedPayments();

        for (let order of orders) {
            await this.verifyPayment(order);
        }
    }

    private async verifyPayment(order: Order): Promise<void> {
        let allPaid: boolean = true;
        for (let payment of order.payments) {
            if (!await verifyPaymentForOrder(order.id, payment.amount)) {
                allPaid = false;
                break;
            }
        }

        if (allPaid) {
            order.payment_status = PaymentStatus.CAPTURED;
            await this.orderRepository_.save(order);
        }
    }
}
