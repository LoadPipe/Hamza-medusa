import { MedusaRequest, MedusaResponse, OrderService } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { Order } from '../../../../models/order';
import { BuckyClient } from '../../../../buckydrop/bucky-client';

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
        const buckyClient: BuckyClient = new BuckyClient();

        const order: Order = await orderService.retrieve(orderId);
        const metadata = JSON.parse(order.bucky_metadata);

        const orderNo = metadata.data.shopOrderNo;
        console.log('orderNo is ', orderNo);
        const orderDetails = await buckyClient.getOrderDetails(
            orderNo,
            metadata.data.partnerOrderNo
        );

        return res
            .status(201)
            .json({ status: true, metadata, orderNo, orderDetails });
    });
};
