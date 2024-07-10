import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import jwt from 'jsonwebtoken';
import CustomerRepository from '../../../repositories/customer';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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
