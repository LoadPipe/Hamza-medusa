import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import { Config } from '../../../config';

/*This route does one thing: it updates the paymentMode property when CartCompletionStrategy runs, based off the
 * environment variable PAYMENT_MODE. This is a simple GET request that returns the payment mode. */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/payment-mode',
        ['payment_mode']
    );

    await handler.handle(async () => {
        const paymentMode = Config.getPaymentMode();
        if (!paymentMode) {
            return res.status(400).send({ message: 'Payment mode not found' });
        }
        return res.status(200).send(paymentMode);
    });
};
