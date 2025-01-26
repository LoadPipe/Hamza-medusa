import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../../services/cart';
import { RouteHandler } from '../../../route-handler';
import CartEmailService from '../../../../services/cart-email';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');
    let cartEmailService: CartEmailService =
        req.scope.resolve('cartEmailService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/cart/email', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        //validate
        if (!handler.requireParam('cart_id')) return;
        const { cart_id } = handler.inputParams;

        //check for existence
        const cart = await cartService.retrieve(cart_id);
        if (!cart)
            return handler.returnStatusWithMessage(
                404,
                `Cart ${cart_id} not found`
            );

        //enforce security
        if (!handler.enforceCustomerId(cart.customer_id)) return;

        //get the email address from cartEmail or cart
        let cartEmail = await cartEmailService.getCartEmail(cart_id);
        if (!cartEmail?.length) cartEmail = cart.email;

        return handler.returnStatus(200, { email_address: cartEmail });
    });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');
    let cartEmailService: CartEmailService =
        req.scope.resolve('cartEmailService');

    const handler = new RouteHandler(req, res, 'PUT', '/custom/cart/email', [
        'cart_id',
        'email_address',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParam('cart_id')) return;
        if (!handler.requireParam('email_address')) return;
        const { cart_id, email_address } = handler.inputParams;

        //check for existence
        const cart = await cartService.retrieve(cart_id);
        if (!cart)
            return handler.returnStatusWithMessage(
                404,
                `Cart ${cart_id} not found`
            );

        //enforce security
        if (!handler.enforceCustomerId(cart.customer_id)) return;

        //set cart email
        handler.logger.info(
            `Setting email ${email_address} for cart ${cart_id}`
        );
        await cartEmailService.setCartEmail(cart_id, email_address);
        return handler.returnStatus(200, { cart_id, email_address });
    });
};
