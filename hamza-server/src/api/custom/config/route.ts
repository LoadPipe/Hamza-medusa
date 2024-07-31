import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import { Config } from '../../../config';

/*This route does one thing: it updates the checkoutMode property when CartCompletionStrategy runs, based off the
 * environment variable CHECKOUT_MODE. This is a simple GET request that returns the payment mode. */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/config'
    );

    await handler.handle(async () => {
        const checkoutMode = Config.getAllConfigs();
        if (!checkoutMode) {
            return res.status(400).send({ message: 'Checkout mode not found' });
        }
        return res.status(200).send(checkoutMode);
    });
};
