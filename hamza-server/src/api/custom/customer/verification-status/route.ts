import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../../repositories/customer';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/customer/verification-status',
        ['customer_id']
    );

    await handler.handle(async () => {
        //validate
        if (!handler.requireParams(['customer_id'])) return;

        //security
        if (!handler.enforceCustomerId(handler.inputParams.customer_id)) return;

        //get the data
        let customerData = await CustomerRepository.findOne({
            where: { id: handler.inputParams.customer_id.toString() },
            select: { is_verified: true },
        });

        return handler.returnStatus(200, { data: customerData.is_verified });
    });
};
