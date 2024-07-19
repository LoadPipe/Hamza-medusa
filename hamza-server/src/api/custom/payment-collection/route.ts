import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import PaymentCollectionService from '../../../services/payment-collection';
import { RouteHandler } from 'src/api/route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentCollectionService: PaymentCollectionService =
        req.scope.resolve('paymentCollectionService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/payment-collection',
        ['region_id', 'type', 'currency_code', 'amount', 'created_by']
    );

    await handler.handle(async () => {
        const paymentCollection = await paymentCollectionService.create(
            handler.inputParams.payload
        );
        res.json(paymentCollection);
    });

    // try {
    //     const paymentCollection =
    //         await paymentCollectionService.create(payload);
    //     res.json(paymentCollection);
    // } catch (err) {
    //     logger.error('Error creating payment collection', err);
    //     res.status(500).json({
    //         error: 'Failed to create payment collection',
    //     });
    // }
};
