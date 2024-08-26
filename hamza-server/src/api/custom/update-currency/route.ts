import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerService from '../../../../services/customer';
import { RouteHandler } from '../../../route-handler';

//TODO: updates should be PUT 
//TODO: should be under /customer
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService =
        req.scope.resolve('customerService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/update-currency', ['customer_id', 'preferred_currency']
    );

    await handler.handle(async () => {
        const customer = await customerService.updateCurrency(
            handler.inputParams.customer_id,
            handler.inputParams.preferred_currency
        );
        res.json(customer);
    });
};
