import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerService from 'src/services/customer';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService = req.scope.resolve(
        'customerService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/customer/verified', [
        'customer_id'
    ]);

    //TODO: this doesn't need to be here; it exists elsewhere for sure
    await handler.handle(async () => {
        if (!handler.requireParam('customer_id'))
            return;

        //enforce security
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const verify =
            await customerService.isVerified(handler.inputParams.customer_id);
        res.json(verify);
    });
};
