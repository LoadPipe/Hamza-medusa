import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../services/cart';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/cart', [
        'cart_id', 'create'
    ]);

    await handler.handle(async () => {
        //validate
        if (!handler.requireParam('cart_id')) return;
        const { cart_id, create } = handler.inputParams;

        //check for existence
        const cart = await cartService.retrieve(cart_id, { relations: ['items', 'region'] });
        if (!cart)
            return handler.returnStatusWithMessage(404, `Cart ${cart_id} not found`);

        //check that customer id matches 
        if (cart) {
            if (handler.customerId?.length) {
                if (cart.customer_id != handler.customerId)
                    return handler.returnStatusWithMessage(401, `Cart ${cart_id} belongs to customer ${cart.customer_id}, not ${handler.customerId}`)
            }
            else {
                //if no customer id, make sure that cart also has none 
                if (cart.customer_id?.length)
                    return handler.returnStatusWithMessage(401, `Cart ${cart_id} belongs to customer ${cart.customer_id}, not anonymous`)
            }
        }

        return handler.returnStatus(200, cart, 100);
    });
};


export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/cart', [
        'data'
    ]);

    await handler.handle(async () => {
        let { data } = handler.inputParams;

        //add customer id 
        if (data)
            data.customer_id = (handler?.customerId?.length) ? handler.customerId : null;
        else
            data = {
                customer_id: (handler?.customerId?.length) ? handler.customerId : null
            };

        //create cart 
        const cart = await cartService.create(data);
        return handler.returnStatus(201, cart, 100);
    });
};


export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'PUT', '/custom/cart', [
        'data', 'cart_id'
    ]);

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['cart_id', 'data']))
            return;
        const { cart_id, data } = handler.inputParams;

        //update cart
        data.customer_id = (handler?.customerId?.length) ? handler.customerId : null;
        const cart = await cartService.update(cart_id, data);

        return handler.returnStatus(200, cart, 100);
    });
};

