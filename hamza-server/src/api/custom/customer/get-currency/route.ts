import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerService from 'src/services/customer';
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
