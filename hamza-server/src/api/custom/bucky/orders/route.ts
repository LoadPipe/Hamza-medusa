import { MedusaRequest, MedusaResponse, Order, OrderService, ShippingOptionPriceType, ShippingOptionService } from '@medusajs/medusa';
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

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const buckydropService: BuckydropService = req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/orders',
        ['order']
    );

    await handler.handle(async () => {
        if (!handler.requireParam('order'))
            return;

        const orderId = handler.inputParams.order;
        const orders = await buckydropService.getPendingOrders();
        let order: Order = orders.find((o) => o.id === orderId);

        if (!order) {
            res.status(400).json({ message: `Order ${orderId} isn't valid or isn't a buckydrop pending order` });
        }

        handler.logger.debug(`Processing order ${orderId}`);
        order = await buckydropService.processPendingOrder(order.id);

        res.status(200).json({ order });
    });
};
