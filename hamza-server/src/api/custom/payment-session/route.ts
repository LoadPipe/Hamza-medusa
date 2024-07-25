import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import PaymentSessionRepository from '@medusajs/medusa/dist/repositories/payment-session';
import { RouteHandler } from '../../route-handler';

/*
 * This route does one thing: it updates the cart_id property of an existing payment session. 
 * This exists to fix a bug in which the frontend creates a payment_session, but leaves the 
 * cart_id null. 
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req, res, 'PUT', '/custom/payment-session',
        ['cart_id', 'payment_session_id']
    );

    await handler.handle(async () => {
        let session = await PaymentSessionRepository.save([{
            id: handler.inputParams.payment_session_id,
            cart_id: handler.inputParams.cart_id
        }]);

        return res.status(200).send(session);
    });
};
