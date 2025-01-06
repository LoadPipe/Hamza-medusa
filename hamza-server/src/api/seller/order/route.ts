import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreOrderService from '../../../services/store-order';

/**
 * Retrieves a list of orders belonging to a store
 *
 * INPUTS:
 * store_id: string
 * filter: {
 *      { property: value, property: { not|eq|lt|gt|lte|gte: value } }
 * }
 * sort: { col: string, direction: asc | desc}
 * page: number
 * count: number
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(req, res, 'POST', '/seller/order', [
        'store_id',
        'ordersPerPage',
        'page',
        'sort',
        'filter',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParam('store_id')) return;

        const filter: any = handler.inputParams.filter;
        const sort: any = handler.hasParam('sort')
            ? handler.inputParams.sort
            : null;
        const page: number = handler.hasParam('page')
            ? parseInt(handler.inputParams.page.toString())
            : 0;
        const ordersPerPage: number = handler.hasParam('ordersPerPage')
            ? parseInt(handler.inputParams.ordersPerPage.toString())
            : 0;

        const store_id = handler.inputParams.store_id;

        const orders = await orderService.getOrdersForStore(
            handler.inputParams.store_id,
            filter,
            sort,
            page,
            ordersPerPage
        );

        return handler.returnStatus(200, orders, 100);
    });
};
