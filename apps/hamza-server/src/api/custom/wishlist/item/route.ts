import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import WishlistService from '../../../../services/wishlist';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

// ADD Wishlist `item` by customer_id
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/wishlist/item',
        ['customer_id', 'variant_id']
    );

    await handler.handle(async () => {

        //validate 
        if (!handler.requireParams(['customer_id', 'variant_id'])) return;

        //enforce identity
        if (!handler.enforceCustomerId(handler.inputParams.customer_id)) return;

        //add item
        const wishlist = await wishlistService.addWishItem(
            handler.inputParams.customer_id,
            handler.inputParams.variant_id
        );
        handler.returnStatus(200, wishlist);
    });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(
        req,
        res,
        'DELETE',
        '/custom/wishlist/item',
        ['customer_id', 'variant_id']
    );

    await handler.handle(async () => {

        //validate 
        if (!handler.requireParams(['customer_id', 'variant_id'])) return;

        //enforce identity
        if (!handler.enforceCustomerId(handler.inputParams.customer_id)) return;

        //remove variant 
        const wishlist = await wishlistService.removeWishItem(
            handler.inputParams.customer_id,
            handler.inputParams.variant_id
        );

        handler.returnStatus(200, wishlist);
    });
};
