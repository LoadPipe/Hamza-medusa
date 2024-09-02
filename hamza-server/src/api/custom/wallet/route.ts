import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService = req.scope.resolve('customerService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/wallet', [
        'message',
        'signature',
    ]);

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['message', 'signature']))
            return false;

        //TODO: possibly needs security 

        //verify signature
        const isVerified = await customerService.verifyWalletSignature(
            handler.inputParams.signature,
            handler.inputParams.message
        );

        handler.logger.debug('Verification result:' + isVerified);

        if (!isVerified) {
            return res
                .status(401)
                .json({ success: false, message: 'Authentication failed' });
        }
        res.json({ success: true, message: 'Authentication successful' });
    });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService = req.scope.resolve('customerService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/wallet');

    await handler.handle(async () => {
        const customer = await customerService.generateNonce();
        return res.json({ nonce: customer });
    });
};
