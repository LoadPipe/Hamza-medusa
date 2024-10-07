import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../services/cart';
import { RouteHandler } from '../../route-handler';
import { CartCreateProps } from '@medusajs/medusa/dist/types/cart';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/cart', [
        'customer_id',
    ]);

    await handler.handle(async () => {
        const input: CartCreateProps = {
            region_id: 'reg_01J4Q07PM6HM9JW3D2HRR17AED',
            gift_cards: [],
            discounts: []
        };
        const cart = await cartService.create(input);

        return handler.returnStatus(200, { cart });
    });
};