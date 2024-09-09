import {
    MedusaRequest,
    MedusaResponse,
    Logger,
    CartService,
    PaymentSession,
    Cart,
    PaymentSessionResponse,
} from '@medusajs/medusa';
import PaymentSessionRepository from '@medusajs/medusa/dist/repositories/payment-session';
import { RouteHandler } from '../../route-handler';

/*
 * This route does one thing: it updates the cart_id property of an existing payment session.
 * This exists to fix a bug in which the frontend creates a payment_session, but leaves the
 * cart_id null.
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const cartService: CartService = req.scope.resolve('cartService');
    const paymentSessionRepository: typeof PaymentSessionRepository =
        req.scope.resolve('paymentSessionRepository');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/custom/payment-session',
        ['cart_id', 'payment_session_id']
    );

    await handler.handle(async () => {
        //validate required parameters
        if (!handler.requireParams(['cart_id', 'payment_session_id'])) return;

        const cartId = handler.inputParams.cart_id;
        const paymentSessionId = handler.inputParams.payment_session_id;

        //check for existence of cart
        const cart: Cart = await cartService.retrieve(cartId);
        if (!cart) {
            handler.returnStatusWithMessage(404, `Cart ${cartId} not found.`);
        }

        //check for existence of payment session
        const paymentSession: PaymentSession =
            await paymentSessionRepository.findOne({
                where: { id: paymentSessionId },
            });
        if (!paymentSession) {
            handler.returnStatusWithMessage(
                404,
                `PaymentSession ${paymentSessionId} not found.`
            );
        }

        //secure
        if (!handler.enforceCustomerId(cart.customer_id)) return;

        //save the payment session
        let session = await paymentSessionRepository.save([
            {
                id: paymentSessionId,
                cart_id: handler.inputParams.cart_id,
            },
        ]);

        return handler.returnStatus(200, session);
    });
};
