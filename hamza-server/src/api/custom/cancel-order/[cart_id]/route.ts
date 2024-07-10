import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ConfirmationTokenService from '../../../../services/confirmation-token';
import OrderService from '../../../../services/order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    try {
        let { cart_id } = req.params;
        let orderService: OrderService = req.scope.resolve('orderService');
        await orderService.cancelOrderFromCart(cart_id);
        console.log('cancelled ', cart_id);
        return res.send({ status: true });
    } catch (e) {
        logger.error('error in verifying token ', e);
        return res.send({ status: false, message: e.message });
    }
};
