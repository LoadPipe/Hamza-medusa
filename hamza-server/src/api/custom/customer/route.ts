import { Customer, MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/customer',
        ['customer_id']
    );

    await handler.handle(async () => {
        //validation
        if (!handler.requireParam('customer_id')) return;

        //security
        if (!handler.enforceCustomerId(handler.inputParams.customer_id)) return;

        const includeAddresses: boolean =
            handler.inputParams.include_addresses?.toString() !== 'false';

        //get the data
        const findParams: any = {
            where: { id: handler.inputParams.customer_id.toString() },
        };

        if (includeAddresses) {
            findParams.relations = ['shipping_addresses', 'billing_address'];
        }

        const customer: Customer = await CustomerRepository.findOne(findParams);

        if (!customer) {
            handler.logger.warn(
                `customer ${handler.inputParams.customer_id} not found`
            );
            return handler.returnStatusWithMessage(
                404,
                `customer ${handler.inputParams.customer_id} not found`
            );
        }

        return handler.returnStatus(200, customer);
    });
};
