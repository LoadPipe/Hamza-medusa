import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//TODO: why is this post?
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/order/all-orders',
        ['cart_id']
    );

    await handler.handle(async () => {
        const order = await orderService.listCollection(
            handler.inputParams.cart_id
        );

        res.status(200).json({ order });
    });

    // try {
    //     const order = await orderService.listCollection(cart_id);

    //     res.status(200).json({ order });
    // } catch (err) {
    //     logger.error('Error retrieving order', err);
    //     res.status(500).json({
    //         error: 'Failed to retrieve order',
    //     });
    // }
};
