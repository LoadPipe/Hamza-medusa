import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import CustomerService from '../../../services/customer';

//TODO: updates should be PUT 
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService =
        req.scope.resolve('customerService');
    const logger: Logger = req.scope.resolve('logger');

    const { customer_id, preferred_currency } = readRequestBody(req.body, [
        'customer_id',
        'preferred_currency',
    ]);

    try {
        const customer = await customerService.updateCurrency(
            customer_id,
            preferred_currency
        );
        res.json(customer);
    } catch (err) {
        logger.error('Error updating customer currency', err);
        res.status(500).json({
            error: 'Failed to update customer currency',
        });
    }
};
