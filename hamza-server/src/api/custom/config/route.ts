import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import { Config } from '../../../config';

/*This route does one thing: it updates the checkoutMode property when CartCompletionStrategy runs, based off the
 * environment variable     . This is a simple GET request that returns the payment mode. */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/config'
    );

    await handler.handle(async () => {
        const cfg = Config.allConfig;
        if (!cfg) {
            return handler.returnStatusWithMessage(400, 'Config not found');
        }
        return res.status(200).send(cfg);
    });
};
