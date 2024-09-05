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
        //validate params
        if (!handler.requireParam('token'))
            return;

        //validate token 
        const token = await confirmationTokenService.getConfirmationToken(handler.inputParams.token);
        if (!token)
            handler.returnStatusWithMessage(404, 'Confirmation token not found');

        //enforce security 
        if (!handler.enforceCustomerId(token.customer_id))
            return;

        //verify the token 
        await confirmationTokenService.verifyConfirmationToken(
            handler.inputParams.token
        );

        return handler.returnStatus(200, { status: true });
    });
};
