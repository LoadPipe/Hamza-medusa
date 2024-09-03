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
        '/custom/order/customer-orders',
        ['customer_id', 'buckets']
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const customerService: CustomerService =
            req.scope.resolve('customerService');

        //validate
        if (handler.requireParam('customer_id')) {
            const customerId = handler.inputParams.customer_id;

            //enforce security
            if (!handler.enforceCustomerId(customerId))
                return;

            //check for existence of customer
            if (
                !(await customerService.retrieve(
                    customerId
                ))
            ) {
                res.status(404).json({
                    message: `Customer id ${customerId} not found`,
                });
            } else {
                if (handler.inputParams.buckets) {
                    const orders = await orderService.getCustomerOrderBuckets(
                        customerId
                    );
                    res.status(200).json({ orders });
                } else {
                    const orders = await orderService.getCustomerOrders(
                        customerId
                    );
                    res.status(200).json({ orders });
                }
            }
        }
    });
};
