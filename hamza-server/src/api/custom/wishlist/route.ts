import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import WishlistService from 'src/services/wishlist';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService'); // Correctly retrieving from query parameters

    const handler = new RouteHandler(req, res, 'GET', '/custom/wishlist', ['customer_id']);

    await handler.handle(async () => {
        if (!handler.requireParam('customer_id'))
            return;

        const customerId = handler.inputParams.customer_id;

        //security
        if (!handler.enforceCustomerId(customerId))
            return;

        const wishlist = await wishlistService.create(customerId);
        handler.logger.debug(JSON.stringify(wishlist));
        res.json(wishlist);
    });
};

// Create a Wishlist
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    // lets create a payload for wishlist-dropdown
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/wishlist', [
        'customer_id',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParam('customer_id'))
            return;

        const customerId = handler.inputParams.customer_id;

        //security
        if (!handler.enforceCustomerId(customerId))
            return;

        const wishlist = await wishlistService.create(
            customerId
        );
        if (wishlist)
            res.status(201).json(wishlist);
        else
            res.status(424).json({
                message:
                    'Failed to create wishlist; customer id might be invalid',
            });
    });
};
