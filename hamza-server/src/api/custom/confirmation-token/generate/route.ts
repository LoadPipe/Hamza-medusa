import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

/*
checklist: 
- check if route is used 
- check route name 
- check route verb 
- remove commented code 
- add securty if needed 
- add validation 
- remove req.query 
*/

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let confirmationTokenService: ConfirmationTokenService =
        req.scope.resolve('confirmationTokenService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/confirmation-token/generate', ['email', 'customer_id']
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['email', 'customer_id']))
            return;

        //security check 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        //do the thing 
        await confirmationTokenService.createConfirmationToken({
            customer_id: handler.inputParams.customer_id,
            email: handler.inputParams.email,
        });

        return res.send({ status: true });
    });
};
