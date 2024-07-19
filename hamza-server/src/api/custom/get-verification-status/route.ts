import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/get-verification-status'
    );

    try {
        let customerData = await CustomerRepository.findOne({
            where: { id: req.query.customer_id.toString() },
            select: { is_verified: true },
        });

        return res.send({ status: true, data: customerData.is_verified });
    } catch (err) {
        console.error('Error creating product review:', err);
        res.send({ status: false, data: false });
    }
};
