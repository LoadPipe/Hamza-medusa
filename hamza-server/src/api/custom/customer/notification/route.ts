import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerNotificationService from '../../../../services/customer-notification';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/customer/notification',
        ['customer_id']
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['customer_id']))
            return;

        //security 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const types = await customerNotificationService.getNotifications(
            handler.inputParams.customer_id
        );

        res.status(200).json({ types });
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/customer/notification',
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

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'DELETE',
        '/custom/customer/notification',
        ['customer_id']
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['customer_id']))
            return;

        //security 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const types = await customerNotificationService.removeNotification(
            handler.inputParams.customer_id
        );

        res.status(204).json({ types });
    });
};
