import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerNotificationService from '../../../../services/customer-notification';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/notification/add',
        ['customer_id', 'notification_type']
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['customer_id']))
            return;

        //security 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const types = await customerNotificationService.addOrUpdateNotification(
            handler.inputParams.customer_id,
            handler.inputParams.notification_type
        );

        res.status(201).json({ types });
    });
};
