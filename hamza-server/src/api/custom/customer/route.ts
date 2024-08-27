import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/customer', ['customer_id']
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['customer_id']))
            return;

        //security 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        //get the data 
        const customer = await CustomerRepository.findOne({
            where: { id: handler.inputParams.customer_id.toString() }
        });

        if (!customer)
            return res.status(404);

        return res.send(customer);
    });
};
