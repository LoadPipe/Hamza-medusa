import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerNotificationService from '../../../../services/customer-notification';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/notification/add', ['customer_id', 'notification_type']
    );

    const logger: Logger = req.scope.resolve('logger');

    const { customer_id, notification_type } = readRequestBody(req.body, [
        'customer_id',
        'notification_type',
    ]);
    if (!customer_id || !notification_type) {
        return res.status(400).json({
            message: 'customer_id and notification_type are required',
        });
    }

    try {
        const types = await customerNotificationService.addOrUpdateNotification(
            customer_id,
            notification_type
        );

        res.status(200).json({ types });
    } catch (err) {
        logger.error('Error creating notification types', err);
        res.status(500).json({
            error: 'Failed to create notification types',
        });
    }
};
