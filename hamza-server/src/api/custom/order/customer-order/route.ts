import type {
    MedusaRequest,
    MedusaResponse,
    Logger,
    CustomerService,
} from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//GETs all of a customer's orders, including past orders, cancelled orders, etc.
//if 'buckets' is passed as FALSE, will just return a straight array of orders, regardless of status
//if 'buckets' is passed as TRUE, will return orders grouped into buckets
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/order/customer-order',
        ['customer_id', 'bucket']
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const customerService: CustomerService =
            req.scope.resolve('customerService');

        //validate
        if (!handler.inputParams.customer_id?.length) {
            res.status(400).json({ message: 'customer_id is required' });
        } else {
            const customerId = handler.inputParams.customer_id;

            //check for existence of customer
            if (!(await customerService.retrieve(customerId))) {
                res.status(404).json({
                    message: `Customer id ${customerId} not found`,
                });
            } else {
                //enforce security
                if (!handler.enforceCustomerId(customerId))
                    return;

                if (handler.inputParams.bucket) {
                    const bucketValue = parseInt(handler.inputParams.bucket);
                    const orders = await orderService.getCustomerOrderBucket(
                        customerId,
                        bucketValue
                    );
                    res.status(200).json({ orders });
                } else {
                    const orders =
                        await orderService.getCustomerOrders(customerId);
                    res.status(200).json({ orders });
                }
            }
        }
    });
};
