import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import OrderService from '../../../services/order';
import CartService from '../../../services/cart';
import { RouteHandler } from '../../route-handler';

interface ICheckoutData {
    order_id: string;
    cart_id: string;
    wallet_address: string;
    currency_code: string;
    amount: number;
    massmarket_amount: string;
    massmarket_order_id: string;
    massmarket_ttl: number;
    orders: any[];
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const cartService: CartService = req.scope.resolve('cartService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/checkout'
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParam('cart_id'))
            return;

        const cartId = handler.inputParams.cart_id;

        const cart = await cartService.retrieve(cartId);
        if (!cart)
            return res.status(404).json({ messsage: `Cart ${cartId} not found.` });

        //enforce security
        if (!handler.enforceCustomerId(cart.customer_id))
            return;

        const orders = await orderService.getOrdersForCart(cartId);
        const output: ICheckoutData[] = [];
        orders.forEach((o) => {
            output.push({
                order_id: o.id,
                cart_id: o.cart_id,
                wallet_address: o.store?.owner?.wallet_address ?? '',
                currency_code: o.payments[0].currency_code,
                amount: o.payments[0].amount,
                massmarket_amount: o.massmarket_amount,
                massmarket_order_id: o.massmarket_order_id,
                massmarket_ttl: o.massmarket_ttl,
                orders,
            });
        });

        console.log(output);
        handler.logger.debug(`returning checkout data: ${output}`);
        res.send({ orders: output });
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const cartService: CartService = req.scope.resolve('cartService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/checkout', [
        //'cart_products',
        'cart_id',
        'transaction_id',
        'payer_address',
        'escrow_contract_address'
    ]);

    try {
        await handler.handle(async () => {

            //validate 
            if (!handler.requireParam('cart_id'))
                return;

            const cartId = handler.inputParams.cart_id;

            const cart = await cartService.retrieve(cartId);
            if (!cart)
                return res.status(404).json({ message: `Cart ${cartId} not found` });

            //enforce security
            if (!handler.enforceCustomerId(cart.customer_id))
                return;

            await orderService.finalizeCheckout(
                //handler.inputParams.cart_products,
                handler.inputParams.cart_id,
                handler.inputParams.transaction_id,
                handler.inputParams.payer_address,
                handler.inputParams.escrow_contract_address
            );
            res.send(true);
        });
    }
    catch (e: any) {
        handler.logger.error(e);
        res.send(false);
    }
};
