import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let confirmationTokenService: ConfirmationTokenService =
        req.scope.resolve('confirmationTokenService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/confirmation-token/generate', ['email', 'customer_id']
    );

    await handler.handle(async () => {
        await confirmationTokenService.createConfirmationToken({
            customer_id: handler.inputParams.customer_id,
            email: handler.inputParams.email,
        });
        return res.send({ status: true });
    });
};
