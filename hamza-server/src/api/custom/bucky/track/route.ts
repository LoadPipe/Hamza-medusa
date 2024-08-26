import { MedusaRequest, MedusaResponse, OrderService } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { Order } from '../../../../models/order';
import { BuckyClient } from '../../../../buckydrop/bucky-client';
import BuckydropService from 'src/services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const buckyService: BuckydropService = req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/track'
    );

    await handler.handle(async () => {
        const orderId = req.query.order.toString();

        //const order: Order = await orderService.retrieve(orderId);
        //const metadata = JSON.parse(order.bucky_metadata);

        //const orderNo = metadata.data.shopOrderNo;
        //c/onsole.log('orderNo is ', orderNo);

        const output = await buckyService.reconcileOrderStatus(orderId);
        output.bucky_metadata = JSON.parse(output.bucky_metadata);

        return res
            .status(201)
            .json({ status: true, output });
    });
};
