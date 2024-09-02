import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import WishlistService from '../../../../services/wishlist';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

// ADD Wishlist `item` by customer_id
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/wishlist/item', [
        'customer_id',
        'product_id',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParams(['customer_id', 'product_id']))
            return;

        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const wishlist = await wishlistService.addWishItem(
            handler.inputParams.customer_id,
            handler.inputParams.product_id
        );
        res.json(wishlist);
    });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(req, res, 'DELETE', '/custom/wishlist/item', [
        'customer_id',
        'product_id',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParams(['customer_id', 'product_id']))
            return;

        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        // Call removeWishItem instead of addWishItem
        const wishlist = await wishlistService.removeWishItem(
            handler.inputParams.customer_id,
            handler.inputParams.product_id
        );
        res.json(wishlist);
    });
};
