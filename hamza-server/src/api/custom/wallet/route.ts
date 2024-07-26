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


    /*
    logger.debug(
        `Received for verification: ${{
            signature,
            message,
        }}`
    );

    try {
        const isVerified = await customerService.verifyWalletSignature(
            signature,
            message
        );
        logger.debug('Verification result:' + isVerified);

        if (!isVerified) {
            return res
                .status(401)
                .json({ success: false, message: 'Authentication failed' });
        }
        res.json({ success: true, message: 'Authentication successful' });
    } catch (error) {
        logger.error('Error verifying wallet signature', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    */
};

//TODO: is this GET route used?
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService = req.scope.resolve('customerService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/wallet');

    await handler.handle(async () => {
        const customer = await customerService.generateNonce();
        return res.json({ nonce: customer });
    });
};
