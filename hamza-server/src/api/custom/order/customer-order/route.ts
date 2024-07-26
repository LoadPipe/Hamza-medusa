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
        '/custom/order/customer-orders'
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const customerService: CustomerService =
            req.scope.resolve('customerService');

        //validate
        if (!req.query.customer_id?.length) {
            res.status(400).json({ message: 'customer_id is required' });
        } else {
            //check for existence of customer
            if (
                !(await customerService.retrieve(
                    req.query.customer_id.toString()
                ))
            ) {
                res.status(404).json({
                    message: `Customer id ${req.query.customer_id.toString()} not found`,
                });
            } else {
                if (req.query.bucket) {
                    const bucketValue = parseInt(req.query.bucket.toString());
                    const customer_id = req.query.customer_id.toString();
                    const orders = await orderService.getCustomerOrderBucket(
                        customer_id,
                        bucketValue
                    );
                    res.status(200).json({ orders });
                } else {
                    const orders = await orderService.getCustomerOrders(
                        req.query.customer_id.toString()
                    );
                    res.status(200).json({ orders });
                }
            }
        }
    });
};
