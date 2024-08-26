import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import { RouteHandler } from '../../../route-handler';

//TODO: implement security 

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let confirmationTokenService: ConfirmationTokenService =
        req.scope.resolve('confirmationTokenService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/confirmation-token/verify'
    );

    await handler.handle(async () => {
        await confirmationTokenService.verifyConfirmationToken(
            req.query.token.toString()
        );
        return res.send({ status: true });
    });
};
