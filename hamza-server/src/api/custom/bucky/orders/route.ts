import { MedusaRequest, MedusaResponse, OrderService, ShippingOptionPriceType, ShippingOptionService } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import BuckydropService from 'src/services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const buckydropService: BuckydropService = req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/orders'
    );

    await handler.handle(async () => {
        const orders = await buckydropService.getPendingOrders();

        res.status(200).json({ orders });
    });
};
