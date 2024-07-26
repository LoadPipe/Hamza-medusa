import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerService from '../../../services/customer';
import { RouteHandler } from '../../route-handler';

//TODO: updates should be PUT 
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

    /*
    const logger: Logger = req.scope.resolve('logger');

    const { customer_id, preferred_currency } = readRequestBody(req.body, [
        'customer_id',
        'preferred_currency',
    ]);

    try {
    } catch (err) {
        logger.error('Error updating customer currency', err);
        res.status(500).json({
            error: 'Failed to update customer currency',
        });
    }
    */
};
