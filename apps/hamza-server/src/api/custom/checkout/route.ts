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
    escrow_metadata: any;
    massmarket_amount: string;
    massmarket_order_id: string;
    massmarket_ttl: number;
    orders: any[];
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const cartService: CartService = req.scope.resolve('cartService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/checkout'
    );

    await handler.handle(async () => {
        //validate
        if (!handler.requireParam('cart_id')) return;

        const cartId = handler.inputParams.cart_id;

        const cart = await cartService.retrieve(cartId);
        if (!cart)
            return handler.returnStatusWithMessage(
                404,
                `Cart ${cartId} not found.`
            );

        //enforce security
        if (!handler.enforceCustomerId(cart.customer_id)) return;

        const orders = await orderService.getOrdersForCheckout(cartId);
        const output: ICheckoutData[] = [];
        orders.forEach((o) => {
            output.push({
                order_id: o.id,
                cart_id: o.cart_id,
                wallet_address: o.store?.owner?.wallet_address ?? '',
                escrow_metadata: o.store?.escrow_metadata,
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
        handler.returnStatus(200, { orders: output });
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const cartService: CartService = req.scope.resolve('cartService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/checkout',
        [
            //'cart_products',
            'cart_id',
            'transaction_id',
            'payer_address',
            'chain_id',
        ]
    );

    try {
        await handler.handle(async () => {
            //validate
            if (!handler.requireParam('cart_id')) return;

            const cartId = handler.inputParams.cart_id;

            const cart = await cartService.retrieve(cartId);
            if (!cart)
                return handler.returnStatusWithMessage(
                    404,
                    `Cart ${cartId} not found`
                );

            //enforce security
            if (!handler.enforceCustomerId(cart.customer_id)) return;

            await orderService.finalizeCheckout(
                handler.inputParams.cart_id,
                handler.inputParams.transaction_id,
                handler.inputParams.payer_address,
                handler.inputParams.chain_id
            );
            handler.returnStatusWithMessage(
                200,
                'successfully finalized checkout'
            );
        });
    } catch (e: any) {
        handler.logger.error(e);
        handler.returnStatusWithMessage(500, 'Failed to finalize checkout');
    }
};
