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
        ['customer_id', 'buckets', 'check_buckets']
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const customerService: CustomerService =
            req.scope.resolve('customerService');

        //validate
        if (handler.requireParam('customer_id')) {
            const customerId = handler.inputParams.customer_id;

            //enforce security
            if (!handler.enforceCustomerId(customerId)) return;

            //check for existence of customer
            if (!(await customerService.retrieve(customerId))) {
                handler.returnStatusWithMessage(
                    404,
                    `Customer id ${customerId} not found`
                );
            }

            const checkBuckets = handler.inputParams.check_buckets;
            console.log(`CHECK BUCKETS: ${checkBuckets}`);
            if (checkBuckets) {
                console.log(`WTF`);
                const buckets =
                    await orderService.checkCustomerOrderBucket(customerId);
                handler.returnStatus(200, { buckets: buckets });
            } else {
                if (handler.inputParams.buckets) {
                    const orders =
                        await orderService.getCustomerOrderBuckets(customerId);
                    handler.returnStatus(200, { orders: orders });
                } else {
                    const orders =
                        await orderService.getCustomerOrders(customerId);
                    handler.returnStatus(200, { orders: orders });
                }
            }
        }
    });
};
