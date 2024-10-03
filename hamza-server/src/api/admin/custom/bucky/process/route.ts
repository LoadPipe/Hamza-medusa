import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import { Order } from '../../../../../models/order';
import { Payment } from '../../../../../models/payment';
import PaymentVerificationService from '../../../../../services/payment-verification';
import BuckydropService from '../../../../../services/buckydrop';
import OrderService from '../../../../../services/order';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentVerificationService: PaymentVerificationService = req.scope.resolve('paymentVerificationService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/bucky/verify', ['products']
    );

    await handler.handle(async () => {
        const buckydropService: BuckydropService = req.scope.resolve('buckydropService')
        const orderService: OrderService = req.scope.resolve('orderService'); 
        const orderRepository: typeof OrderRepository = req.scope.resolve('orderRepository');

        //me minana banana
        if (!handler.requireParam('order_id')) {
            return;
        }

        const orders: Order[] = await orderRepository.find({
            where: { id: handler.inputParams.order_id },
            relations: ['payments'],
        });

        if (!orders?.length) {
            return handler.returnStatusWithMessage(404, 'Order not found');
        }

        let order: Order = orders[0];

        if (order.bucky_metadata && order.bucky_metadata.status === 'pending') {
            order = await buckydropService.processPendingOrder(order.id);
        }

        return handler.returnStatus(200, {
            order
        });
    });
};
