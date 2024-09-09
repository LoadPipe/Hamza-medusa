import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import PaymentVerificationService from '../../../../../services/payment-verification';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentVerificationService: PaymentVerificationService = req.scope.resolve('paymentVerificationService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/payments/verify', ['products']
    );

    await handler.handle(async () => {
        if (handler.hasParam('order_id'))
            await paymentVerificationService.verifyPayments(handler.inputParams.order_id);
        else
            await paymentVerificationService.verifyPayments();
        return res.json({ ok: 'ok' })
    });
};
