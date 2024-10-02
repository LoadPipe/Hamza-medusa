import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import { Order } from '../../../../../models/order';
import { Payment } from '../../../../../models/payment';
import PaymentVerificationService from '../../../../../services/payment-verification';
import BuckydropService from '../../../../../services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentVerificationService: PaymentVerificationService = req.scope.resolve('paymentVerificationService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/bucky/verify', ['products']
    );

    await handler.handle(async () => {
        const buckydropService: BuckydropService = req.scope.resolve('buckydropService')

        //me minana banana
        if (!handler.requireParam('order_id')) {
            return;
        }

        let order = await this.orderRepository_.find({
            where: { id: handler.inputParams.order_id },
            relations: ['payments'],
        });

        if (!order) {
            return handler.returnStatusWithMessage(404, 'Order not found');
        }

        if (order.bucky_metadata && order.bucky_metadata.status === 'pending') {
            order = await buckydropService.processPendingOrder(order.id);
        }

        return handler.returnStatus(200, {
            order
        });
    });
};
