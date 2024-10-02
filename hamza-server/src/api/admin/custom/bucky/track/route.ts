import { MedusaRequest, MedusaResponse, OrderService } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import BuckydropService from 'src/services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const buckyService: BuckydropService =
        req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/track',
        ['order']
    );

    await handler.handle(async () => {
        if (!handler.requireParam('order_id'))
            return;
        const orderId = handler.inputParams.order_id;

        const output = await buckyService.reconcileOrderStatus(orderId);

        return handler.returnStatus(201, { output });
    });
};
