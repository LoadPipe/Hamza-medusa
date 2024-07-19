import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let confirmationTokenService: ConfirmationTokenService =
        req.scope.resolve('confirmationTokenService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/confirmation-token/verify'
    );

    await handler.handle(async () => {
        await confirmationTokenService.verifyConfirmationToken(
            req.query.token.toString()
        );
        return res.send({ status: true });
    });

    /*
    const logger = req.scope.resolve('logger') as Logger;
    try {
        let confirmationTokenService: ConfirmationTokenService =
            req.scope.resolve('confirmationTokenService');
        await confirmationTokenService.verifyConfirmationToken(
            req.query.token.toString()
        );
        return res.send({ status: true });
    } catch (e) {
        logger.error('error in verifying token ', e);
        return res.send({ status: false, message: e.message });
    }
    */
};
