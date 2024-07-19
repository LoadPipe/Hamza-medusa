import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import WishlistService from 'src/services/wishlist';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');// Correctly retrieving from query parameters

    const handler = new RouteHandler(req, res, 'GET', '/custom/wishlist');

    await handler.handle(async () => {
        const customer_id = req.query.customer_id;

        if (!customer_id) {
            // Respond with an error if no customer_id is provided
            return res.status(400).json({ error: 'customer_id is required' });
        }

        const wishlist = await wishlistService.retrieve(customer_id);
        handler.logger.debug(JSON.stringify(wishlist));
        res.json(wishlist);
    });

    /*
    try {
        const wishlist = await wishlistService.retrieve(customer_id);
        logger.debug(JSON.stringify(wishlist));
        res.json(wishlist);
    } catch (err) {
        if (err.message.includes('not found')) {
            logger.debug(
                'Wishlist does not exist, creating a new wishlist for:' +
                customer_id
            );
            try {
                const newWishlist = await wishlistService.create(customer_id);
                if (newWishlist)
                    res.status(201).json(newWishlist);
                else
                    res.status(424).json({ 'message': 'Failed to create wishlist; customer id might be invalid' });

            } catch (createErr) {
                logger.error(
                    'Error creating new wishlist:',
                    createErr
                );
                res.status(500).json({
                    error: 'Failed to create new wishlist',
                });
            }
        } else {
            logger.error('Error retrieving wishlist-dropdown:', err);
            res.status(500).json({
                error: 'Failed to retrieve wishlist-dropdown',
            });
        }
    }
    */
};

// Create a Wishlist
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    // lets create a payload for wishlist-dropdown
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/wishlist', ['customer_id']);

    await handler.handle(async () => {
        const wishlist = await wishlistService.create(handler.inputParams.customer_id);
        if (wishlist)
            res.status(201).json(wishlist);
        else
            res.status(424).json({ 'message': 'Failed to create wishlist; customer id might be invalid' });
    });

    /*
    try {
        const wishlist = await wishlistService.create(customer_id);
        if (wishlist)
            res.status(201).json(wishlist);
        else
            res.status(424).json({ 'message': 'Failed to create wishlist; customer id might be invalid' });
    } catch (err) {
        logger.error('Create wishlist error: ', err);
    }
    */
};
