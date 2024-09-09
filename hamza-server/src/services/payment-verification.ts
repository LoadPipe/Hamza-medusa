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
import { verifyPaymentForOrder } from '../web3';

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
        console.log('orders:', orders.length);

        for (let order of orders) {
            console.log('verifying payment for ', order.id);
            await this.verifyPayment(order);
        }
    }

    private async verifyPayment(order: Order): Promise<void> {
        let allPaid: boolean = true;
        for (let payment of order.payments) {
            //TODO: get chain from order or payment
            if (!await verifyPaymentForOrder(11155111, order.id, payment.amount)) {
                allPaid = false;
                break;
            }
        }

        if (allPaid) {
            console.log('updating order ', order.id);
            order.payment_status = PaymentStatus.CAPTURED;
            await this.orderRepository_.save(order);
        }
    }
}
