import { MedusaRequest, MedusaResponse, OrderService } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import BuckydropService from '../../../../services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const buckydropService: BuckydropService = req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/shipping'
    );

    await handler.handle(async () => {
        const cartId = req.query.order.toString();

        const amount = await buckydropService.calculateShippingPriceForCart(cartId);

        return res
            .status(201)
            .json({ status: true, amount });
    });
};
