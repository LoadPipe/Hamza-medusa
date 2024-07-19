import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import WishlistService from '../../../../services/wishlist';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

// ADD Wishlist `item` by customer_id
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const { customer_id, product_id } = readRequestBody(req.body, [
        'customer_id',
        'product_id',
    ]);

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
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');
    const { customer_id, product_id } = readRequestBody(req.body, [
        'customer_id',
        'product_id',
    ]);

    try {
        // Call removeWishItem instead of addWishItem
        const wishlist = await wishlistService.removeWishItem(
            customer_id,
            product_id
        );
        res.json(wishlist);
    } catch (err) {
        logger.error('ERROR: ', err);
        res.status(500).send('Internal Server Error');
    }
};
