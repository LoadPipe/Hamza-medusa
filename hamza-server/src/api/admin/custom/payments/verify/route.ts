import type { MedusaRequest, MedusaResponse, Logger, Payment } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import PaymentVerificationService from '../../../../../services/payment-verification';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentVerificationService: PaymentVerificationService = req.scope.resolve('paymentVerificationService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/payments/verify', ['products']
    );

    await handler.handle(async () => {
        let payments: Payment[];
        if (handler.hasParam('order_id'))
            payments = await paymentVerificationService.verifyPayments(handler.inputParams.order_id);
        else
            payments = await paymentVerificationService.verifyPayments();

        return handler.returnStatus(200, {
            verified: payments.map(p => {
                return {
                    id: p.id,
                    order_id:
                        p.order_id,
                    amount:
                        p.amount,
                    currency:
                        p.currency_code
                }
            })
        });
    });
};
