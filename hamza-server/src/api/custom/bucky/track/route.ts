import { MedusaRequest, MedusaResponse, OrderService } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { Order } from '../../../../models/order';
import { BuckyClient } from '../../../../buckydrop/bucky-client';
import BuckydropService from 'src/services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const buckyService: BuckydropService = req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/track',
        ['order']
    );

    await handler.handle(async () => {
        const orderId = handler.inputParams.order;

        const output = await buckyService.reconcileOrderStatus(orderId);

        return res
            .status(201)
            .json({ status: true, output });
    });
};
