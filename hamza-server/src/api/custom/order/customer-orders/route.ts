import type { MedusaRequest, MedusaResponse, Logger, CustomerService } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//gets all orders for a customer
//TODO: why dis POST?
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(
        req, res, 'POST', '/custom/order/customer-orders', ['customer_id']
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const orders = await orderService.listCustomerOrders(handler.inputParams.customer_id);
        res.status(200).json({ orders });
    });
}


//GETs all of a customer's orders, including past orders, cancelled orders, etc. 
//if 'buckets' is passed as FALSE, will just return a straight array of orders, regardless of status
//if 'buckets' is passed as TRUE, will return orders grouped into buckets
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(
        req, res, 'GET', '/custom/order/customer-orders'
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const customerService: CustomerService = req.scope.resolve('customerService');

        //validate 
        if (!req.query.customer_id?.length) {
            res.status(400).json({ message: 'customer_id is required' });
        }
        else {
            //check for existence of customer 
            if (!(await customerService.retrieve(req.query.customer_id.toString()))) {
                res.status(404).json({ message: `Customer id ${req.query.customer_id.toString()} not found` });
            }
            else {
                if (req.query.buckets) {
                    const orders = await orderService.getCustomerOrderBuckets(req.query.customer_id.toString());
                    res.status(200).json({ orders });
                } else {
                    const orders = await orderService.getCustomerOrders(req.query.customer_id.toString());
                    res.status(200).json({ orders });
                }
            }
        }
    });
}
