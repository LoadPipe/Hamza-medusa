import { Lifetime } from 'awilix';
import { PaymentStatus, TransactionBaseService } from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';
import OrderService from './order';
import { Payment } from '../models/payment';
import { Order } from '../models/order';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { getAmountPaidForOrder, verifyPaymentForOrder } from '../web3';
import { getCurrencyPrecision } from '../currency.config';

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

    async verifyPayments(
        order_id: string = null
    ): Promise<{ order: Order; payment: Payment }[]> {
        let output: { order: Order; payment: Payment }[] = [];
        let orders = await this.orderService_.getOrdersWithUnverifiedPayments();
        console.log(orders.map((o) => o.id));

        if (!orders?.length) {
            this.logger.info('No orders with unverified payments were found');
        }

        if (order_id) orders = orders.filter((o) => o.id == order_id);

        for (let order of orders) {
            this.logger.info(`verifying payment for ${order.id}`);
            output = output.concat(await this.verifyPayment(order));
        }

        return output;
    }

    private async verifyPayment(
        order: Order
    ): Promise<{ order: Order; payment: Payment }[]> {
        let output: { order: Order; payment: Payment }[] = [];
        let allPaid: boolean = true;

        const payments: Payment[] = order.payments;

        try {
            if (order.payment_status === PaymentStatus.CAPTURED) {
                this.logger.info(
                    `Order ${order.id} payment status ${order.payment_status} is in the wrong state to be verified`
                );
                return output;
            }
            //verify each payment of order
            let total_paid: bigint = BigInt(0);
            let total_expected: bigint = BigInt(0);
            for (let payment of payments) {
                this.logger.info(
                    `verifying payment ${payment.id} for order ${order.id}`
                );

                const chainId: number = payment.blockchain_data?.chain_id ?? 0;
                const transactionId: string =
                    payment.blockchain_data?.transaction_id;

                //compare amount paid to amount expected
                total_paid += await getAmountPaidForOrder(
                    chainId,
                    transactionId,
                    order.id,
                    payment.amount
                );
                const currencyCode: string = payment.currency_code;
                this.logger.info(
                    `Total paid for ${payment.id} of order ${order.id} is ${total_paid}`
                );

                //convert to correct number of decimals
                const precision = getCurrencyPrecision(currencyCode, chainId);
                total_expected += BigInt(
                    payment.amount *
                        Math.pow(10, precision.native - precision.db)
                );

                //TODO: timezones
                payment.captured_at = new Date();
            }

            this.logger.debug(`expected:, ${total_expected.toString()}`);
            this.logger.debug(`paid:', ${total_paid.toString()}`);

            //update payment_status of order based on paid or not
            allPaid = true; //total_paid >= total_expected;
            const paymentStatus: PaymentStatus = allPaid
                ? PaymentStatus.CAPTURED
                : PaymentStatus.NOT_PAID;

            //save the order
            this.logger.info(
                `updating order ${order.id}, setting to ${paymentStatus}`
            );

            order = await this.orderService_.setOrderStatus(
                order,
                null,
                null,
                paymentStatus,
                null,
                {
                    total_expected: total_expected.toString(),
                    total_paid: total_paid.toString(),
                }
            );

            //TODO: set the payments status to captured

            //TODO: set the payments status to captured

            for (let p of order.payments) {
                output.push({ order: order, payment: p });
            }
        } catch (e: any) {
            this.logger.error(`Error verifying order ${order.id}`, e);
        }

        return output;
    }
}
