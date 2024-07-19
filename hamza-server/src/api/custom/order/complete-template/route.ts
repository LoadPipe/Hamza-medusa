import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const { cart_id } = readRequestBody(req.body, ['cart_id']);

    console.log(`Cart ID is: ${cart_id}`);

    try {
        const cart = await orderService.completeOrderTemplate(cart_id);

        res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to retrieve order',
        });
    }
};
