import {
    MedusaRequest,
    MedusaResponse,
    OrderService,
    SalesChannelService,
} from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { Order } from '../../../../models/order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky'
    );

    await handler.handle(async () => {
        const orderId = req.query.order.toString();

        const order: Order = await orderService.retrieve(orderId);
        const metadata = JSON.parse(order.bucky_metadata);

        return res.status(201).json({ status: true, output: metadata });
    });
};
