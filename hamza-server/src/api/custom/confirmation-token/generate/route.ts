import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import { readRequestBody } from '../../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    try {
        let { email, customer_id } = readRequestBody(req.body, [
            'email',
            'customer_id',
        ]);
        let confirmationTokenService: ConfirmationTokenService =
            req.scope.resolve('confirmationTokenService');
        await confirmationTokenService.createConfirmationToken({
            customer_id,
            email,
        });
        return res.send({ status: true });
    } catch (e) {
        logger.error('error in generating token ', e);
        return res.send({ status: false, message: e.message });
    }
};
