import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import { LineItemService } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: LineItemService = req.scope.resolve('lineItemService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/order', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        const order = await orderService.list({
            cart_id: handler.inputParams.cart_id,
        });

        handler.returnStatus(200, order);
    });
};
