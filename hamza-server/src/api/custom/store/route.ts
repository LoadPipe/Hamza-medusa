import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService = req.scope.resolve('customerService');

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/store');

    await handler.handle(async () => {

    });
    const logger = req.scope.resolve('logger') as Logger;

    try {
        logger.debug("/custom/store")
        const customers = await customerService.findAllCustomers();
        return res.json({ customers });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/store');

    await handler.handle(async () => {

    });
    const logger = req.scope.resolve('logger') as Logger;
    try {
        logger.debug("/custom/store")
        const { wallet_address, signature } = readRequestBody(req.body, [
            'wallet_address',
            'signature',
        ]);

        if (!wallet_address) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }
        const customerService = req.scope.resolve('customerService');

        const isVerified = await customerService.verifyWalletSignature(
            wallet_address,
            signature
        );
        if (!isVerified) {
            return res.status(400).json({ message: 'Verification failed' });
        }
        const customer = await customerService.createCustomer(
            wallet_address.toString()
        );

        if (!customer) {
            return res.status(409).json({
                message: 'Customer with this wallet address already exists.',
            });
        }
        return res.status(201).json({ customer });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
