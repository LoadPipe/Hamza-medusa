import { MedusaRequest, MedusaResponse, Order, OrderService, ShippingOptionPriceType, ShippingOptionService } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
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

        return handler.returnStatus(200, { orders });
    });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const buckydropService: BuckydropService = req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/admin/custom/bucky/orders',
        ['order']
    );

    await handler.handle(async () => {
        let orderId: string;
        if (handler.hasParam('order'))
            orderId = handler.inputParams.order;

        let orders = await buckydropService.getPendingOrders();
        if (orderId) {
            orders = orders.filter(o => o.id === orderId);
        }

        if (!orders?.length) {
            if (orderId)
                res.status(400).json({ message: `Order ${orderId} isn't valid or isn't a buckydrop pending order` });
            else
                res.status(400).json({ message: `No pending buckydrop orders found` });
        }

        //process all selected orders 
        const promises: Promise<Order>[] = [];

        for (let order of orders) {
            promises.push(new Promise(async (resolve, reject) => {
                handler.logger.debug(`Processing order ${orderId}`);
                resolve(await buckydropService.processPendingOrder(order.id));
            }))
        }
        orders = await Promise.all(promises);

        return handler.returnStatus(200, { orders });
    });
};
