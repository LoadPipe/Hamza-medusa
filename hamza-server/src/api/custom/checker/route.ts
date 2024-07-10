import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { generateNonce } from 'siwe';

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    try {
        const nonce = generateNonce();
        logger.debug('nonce: ' + nonce);
        logger.debug('typeof nonce: ' + typeof nonce);

        return res.json({
            message: nonce,
        });
    } catch (error) {
        logger.error(error);
        return res
            .status(500)
            .json({ message: 'Internal server error', error: error.message });
    }
};
