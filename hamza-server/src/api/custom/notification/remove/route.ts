import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerNotificationService from '../../../../services/customer-notification';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/notification/remove',
        ['customer_id']
    );

    await handler.handle(async () => {
        const types = await customerNotificationService.removeNotification(
            handler.inputParams.customer_id
        );

        res.status(200).json({ types });
    });

    // const { customer_id } = readRequestBody(req.body, ['customer_id']);
    // if (!customer_id) {
    //     return res.status(400).json({
    //         message: 'customer_id is required',
    //     });
    // }

    // try {
    //     const types =
    //         await customerNotificationService.removeNotification(customer_id);

    //     res.status(200).json({ types });
    // } catch (err) {
    //     logger.error('Error creating notification types', err);
    //     res.status(500).json({
    //         error: 'Failed to create notification types',
    //     });
    // }
};
