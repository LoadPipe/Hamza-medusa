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
        ['customer_id', 'bucket', 'cart_id']
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const customerService: CustomerService =
            req.scope.resolve('customerService');

        const logger: Logger = req.scope.resolve('logger'); // Resolve the logger service

        // Log cart_id presence
        const cartId = handler.inputParams.cart_id;
        if (cartId) {
            logger.info(`Cart ID provided: ${cartId}`); // Use the logger to log cart_id if available
        } else {
            logger.info('No cart ID provided'); // Log that no cart_id was provided
        }

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
                if (!handler.enforceCustomerId(customerId)) return;

                if (handler.inputParams.bucket) {
                    const bucketValue = parseInt(handler.inputParams.bucket);
                    // Conditionally pass orderId only if it exists
                    const orders = cartId
                        ? await orderService.getCustomerOrderBucket(
                              customerId,
                              bucketValue,
                              cartId
                          )
                        : await orderService.getCustomerOrderBucket(
                              customerId,
                              bucketValue
                          );

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
