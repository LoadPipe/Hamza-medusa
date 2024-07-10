import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import { readRequestBody } from '../../../../utils/request-body';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    try {
        let { product_id } = req.query;
        let productData = await ProductRepository.findOne({
            where: { id: product_id.toString() },
            select: { store_id: true },
        });

        return res.send({ status: true, data: productData.store_id });
    } catch (e) {
        logger.error('error in generating token ', e);
        return res.send({ status: false, message: e.message });
    }
};
