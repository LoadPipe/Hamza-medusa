import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerService from '../../../../services/customer';
import { RouteHandler } from '../../../route-handler';

//TODO: needs work 
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService = req.scope.resolve(
        'customerService'
    ) as CustomerService;

    // Extract customer_id from the query parameters
    const { customer_id } = req.query;

    if (!customer_id || typeof customer_id !== 'string') {
        return res
            .status(400)
            .json({ message: 'Customer ID is required and must be a string.' });
    }

    try {
        // Call the getCustomerCurrency method
        const currency = await customerService.getCustomerCurrency(customer_id);

        if (currency) {
            return res.status(200).json({ preferred_currency: currency });
        } else {
            return res
                .status(404)
                .json({ message: 'Customer or preferred currency not found.' });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error retrieving customer currency: ${error.message}`,
        });
    }
};


//TODO: updates should be PUT 
//TODO: should be under /customer
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService =
        req.scope.resolve('customerService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'PUT', '/custom/customer/preferred-currency', ['customer_id', 'preferred_currency']
    );

    await handler.handle(async () => {

        //validate
        if (!handler.requireParams(['customer_id', 'preferred_currency']))
            return;

        //enforce security 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        //update preferred currency 
        const customer = await customerService.updateCurrency(
            handler.inputParams.customer_id,
            handler.inputParams.preferred_currency
        );
        res.json(customer);
    });
};
