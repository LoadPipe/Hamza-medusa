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
        const wishlist = await wishlistService.addWishItem(
            handler.inputParams.customer_id,
            handler.inputParams.product_id
        );
        res.json(wishlist);
    });

    /*
    try {
        const wishlist = await wishlistService.addWishItem(
            customer_id,
            product_id
        );
        res.json(wishlist);
    } catch (err) {
        logger.error('Add wishlist item error: ', err);
        res.status(500).send('Internal Server Error');
    }
    */
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(req, res, 'DELETE', '/custom/wishlist/item', [
        'customer_id',
        'product_id',
    ]);

    await handler.handle(async () => {
        // Call removeWishItem instead of addWishItem
        const wishlist = await wishlistService.removeWishItem(
            handler.inputParams.customer_id,
            handler.inputParams.product_id
        );
        res.json(wishlist);
    });
};
