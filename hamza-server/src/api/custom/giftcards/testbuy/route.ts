import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import GlobetopperService from '../../../../services/globetopper';
import OrderService from '../../../../services/order';
import { Order } from '../../../../models/order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const globeTopperService: GlobetopperService =
        req.scope.resolve('globetopperService');
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards/testbuy'
    );

    await handler.handle(async () => {
        if (!handler.requireParam('order_id')) return;

        const order: any = orderService.retrieve(handler.inputParams.order_id, {
            relations: ['items'],
        });

        //require params
        await globeTopperService.processPointOfSale(
            order.id,
            'john',
            'kosinski',
            'john.kosinski@gmail.com',
            order.items
        );

        return handler.returnStatus(
            200,
            {
                status: 'ok',
            },
            100
        );
    });
};
