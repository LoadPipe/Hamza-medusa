import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerNotificationService from '../../../../services/customer-notification';
import { readRequestBody } from '../../../../utils/request-body';

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');
    const logger: Logger = req.scope.resolve('logger');

    const { customer_id } = readRequestBody(req.body, ['customer_id']);
    if (!customer_id) {
        return res.status(400).json({
            message: 'customer_id is required',
        });
    }

    try {
        const types =
            await customerNotificationService.removeNotification(customer_id);

        res.status(200).json({ types });
    } catch (err) {
        logger.error('Error creating notification types', err);
        res.status(500).json({
            error: 'Failed to create notification types',
        });
    }
};
