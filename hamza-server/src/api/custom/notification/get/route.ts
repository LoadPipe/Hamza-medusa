import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerNotificationService from '../../../../services/customer-notification';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

//TODO: this looks like it should be GET
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerNotificationService: CustomerNotificationService =
        req.scope.resolve('customerNotificationService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/notification/get',
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
