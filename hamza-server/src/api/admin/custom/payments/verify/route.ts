import {
    type MedusaRequest,
    type MedusaResponse,
    type Logger,
    OrderStatus,
    FulfillmentStatus,
} from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import { Order } from '../../../../../models/order';
import { Payment } from '../../../../../models/payment';
import PaymentVerificationService from '../../../../../services/payment-verification';
import BuckydropService from '../../../../../services/buckydrop';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentVerificationService: PaymentVerificationService =
        req.scope.resolve('paymentVerificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/admin/custom/payments/verify',
        ['products']
    );

    await handler.handle(async () => {
        let orderPayments: { order: Order; payment: Payment }[] = [];
        const buckydropService: BuckydropService =
            req.scope.resolve('buckydropService');

        //me minana banana
        if (handler.hasParam('order_id')) {
            handler.logger.info(
                `Verifying payments for ${handler.inputParams.order_id}...`
            );
            orderPayments = await paymentVerificationService.verifyPayments(
                handler.inputParams.order_id
            );
        } else {
            handler.logger.info(`Verifying payments...`);
            orderPayments = await paymentVerificationService.verifyPayments();
        }

        //if orders are bucky orders, we gotta do something
        for (let item of orderPayments) {
            if (
                item.order.external_metadata &&
                item.order.external_source === 'buckydrop' &&
                item.order.external_metadata.status === 'pending'
            ) {
                item.order = await buckydropService.processPendingOrder(
                    item.order.id
                );
            }
        }

        return handler.returnStatus(200, {
            verified: orderPayments.map((item) => {
                return {
                    order_id: item.order.id,
                    payment_id: item.payment.id,
                    amount: item.payment.amount,
                    currency: item.payment.currency_code,
                    external_metadata: item.order.external_metadata,
                };
            }),
        });
    });
};
