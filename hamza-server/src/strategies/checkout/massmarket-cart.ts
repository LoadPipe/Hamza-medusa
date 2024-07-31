import {
    Cart,
    CartCompletionResponse,
    IdempotencyKey,
    IdempotencyKeyService,
    ProductService,
    CartService,
    Logger,
} from '@medusajs/medusa';
import OrderService from '../../services/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { Payment } from '../../models/payment';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import { Store } from '../../models/store';
import { LineItem } from '../../models/line-item';
import { PaymentDataInput } from '@medusajs/medusa/dist/services/payment';
import { RequestContext } from '@medusajs/medusa/dist/types/request';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import {
    CheckoutOutput,
    MassMarketClient,
} from '../../massmarket-client/rest-client';
import { In } from 'typeorm';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import { getCurrencyAddress } from '../../currency.config';

type HexString = `0x${string}`;

type CheckoutResult = CheckoutOutput & { medusaOrderId: string };

type InjectedDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    productService: ProductService;
    paymentService: PaymentService;
    cartService: CartService;
    orderService: OrderService;
    paymentRepository: typeof PaymentRepository;
    orderRepository: typeof OrderRepository;
    lineItemRepository: typeof LineItemRepository;
    logger: Logger;
};

interface IPaymentGroupData {
    items: LineItem[];
    total: bigint;
    currency_code: string;
    store?: Store;
}

/**
 * @name CartCompletionStrategy
 *
 * @description Defines a Cart completion strategy which is called when the cart's complete
 * method is called (on the client side). Breaks up cart items into multiple payments,
 * for each unique store-currency pair; creates payments and orders for each. This is
 * made specifically for our use case of crypto payments in (potentially) multiple currencies,
 * including native & token currencies.
 *
 * @author John R. Kosinski
 */
class MassMarketCartStrategy {
    protected readonly idempotencyKeyService: IdempotencyKeyService;
    protected readonly cartService: CartService;
    protected readonly productService: ProductService;
    protected readonly paymentService: PaymentService;
    protected readonly orderService: OrderService;
    protected readonly paymentRepository: typeof PaymentRepository;
    protected readonly orderRepository: typeof OrderRepository;
    protected readonly lineItemRepository: typeof LineItemRepository;
    protected readonly logger: Logger;

    constructor(container) {
        this.idempotencyKeyService = container.idempotencyKeyService;
        this.cartService = container.cartService;
        this.paymentService = container.paymentService;
        this.productService = container.productService;
        this.orderService = container.orderService;
        this.paymentRepository = container.paymentRepository;
        this.orderRepository = container.orderRepository;
        this.lineItemRepository = container.lineItemRepository;
        this.logger = container.logger;
    }

    /**
     * @description
     * - breaks up the cart into groups based on store id and currency.
     * - each item group is a unique pairing of store id and currency.
     * - a payment is created for each item group, to pay for that group of items.
     * - an order is created for each payment.
     *
     * @param cartId
     * @param idempotencyKey
     * @param context
     * @returns
     */
    async complete(
        cartId: string,
        idempotencyKey: IdempotencyKey,
        context: RequestContext
    ): Promise<CartCompletionResponse> {
        try {
            //get the cart
            const cart = await this.cartService.retrieve(cartId, {
                relations: [
                    'items.variant.product.store',
                    'items.variant.prices', //TODO: we need prices?
                ],
            });

            //group payments by store
            const storeGroups: IPaymentGroupData[] = this.groupByStore(cart);

            //create payments; one per group
            const payments: Payment[] = await this.createCartPayments(
                cart,
                storeGroups
            );

            //create orders; one per payment
            const orders = await this.createOrdersForPayments(
                cart,
                payments,
                storeGroups
            );

            //there should be the same number of orders as groups
            if (orders.length != storeGroups.length)
                throw new Error(
                    'inconsistency between payment groups and orders'
                );

            //save/update payments with order ids
            await this.updatePaymentFromOrder(payments, orders);

            //send checkout to massmarket stores
            //TODO: be able to handle one store checkout failure, while the other succeed
            const checkoutResults: CheckoutResult[] =
                await this.doMassMarketCheckouts(storeGroups, orders);

            this.logger.debug(
                `Got checkout results ${JSON.stringify(checkoutResults)}`
            );
            await this.updateOrderForMassMarket(checkoutResults);

            //create & return the response
            const response: CartCompletionResponse = {
                response_code: 200,
                response_body: {
                    payment_count: payments.length,
                    message: 'payment successful',
                    payments,
                    orders,
                    cart_id: cartId,
                },
            };

            return response;
        } catch (e) {
            const response: CartCompletionResponse = {
                response_code: 500,
                response_body: {
                    payment_count: 0,
                    message: e.toString(),
                    payments: [],
                    cart_id: cartId,
                },
            };

            //return an error response
            this.logger.debug(response);
            return response;
        }
    }

    private createPaymentInput(
        cart: Cart,
        storeGroup: IPaymentGroupData
    ): PaymentDataInput {
        //divide the cart items
        const itemsFromStore = cart.items.filter(
            (i: LineItem) => i.currency_code === storeGroup.currency_code
        );

        //get total amount for the items
        const amount = itemsFromStore.reduce(
            (a, i) => a + i.unit_price * i.quantity,
            0
        );

        //create payment input
        const output: PaymentDataInput = {
            currency_code: storeGroup.currency_code,
            provider_id: 'crypto',
            amount,
            data: {},
        };

        return output;
    }

    private groupByStore(cart: Cart): IPaymentGroupData[] {
        //temp holding for groups
        const storeGroups: { [key: string]: IPaymentGroupData } = {};

        if (cart && cart.items) {
            cart.items.forEach(async (i: LineItem) => {
                //create key from unique store/currency pair
                const currency: string = i.currency_code;
                const store = i.variant?.product?.store;
                const key = store.id;

                //create new group, or add item id to existing group
                if (!storeGroups[key]) {
                    storeGroups[key] = {
                        items: [],
                        total: BigInt(0),
                        currency_code: currency,
                        store: store,
                    };
                }
                storeGroups[key].items.push(i);
                storeGroups[key].total += BigInt(i.unit_price * i.quantity);
            });
        }

        return Object.keys(storeGroups).map((key) => storeGroups[key]);
    }

    private async createCartPayments(
        cart: Cart,
        storeGroups: IPaymentGroupData[]
    ): Promise<Payment[]> {
        //for each unique group, make payment input to create a payment
        const paymentInputs: PaymentDataInput[] = [];
        storeGroups.forEach((group) => {
            paymentInputs.push(this.createPaymentInput(cart, group));
        });

        //create the payments
        const promises: Promise<Payment>[] = [];
        for (let i = 0; i < paymentInputs.length; i++) {
            promises.push(this.paymentService.create(paymentInputs[i]));
        }

        const payments: Payment[] = await Promise.all(promises);
        return payments;
    }

    private async createOrdersForPayments(
        cart: Cart,
        payments: Payment[],
        storeGroups: IPaymentGroupData[]
    ): Promise<Order[]> {
        const promises: Promise<Order>[] = [];
        for (let i = 0; i < payments.length; i++) {
            promises.push(
                this.orderService.createFromPayment(
                    cart,
                    payments[i],
                    storeGroups[i].store?.id
                )
            );
        }

        return await Promise.all(promises);
    }

    private async updatePaymentFromOrder(
        payments: Payment[],
        orders: Order[]
    ): Promise<void> {
        const promises: Promise<Payment>[] = [];

        //function to update a single payment
        const updatePayment = async (payment: Payment, order: Order) => {
            const fullOrder = await this.orderService.getOrderWithStore(
                order.id
            );
            payment.order_id = order.id;
            payment.cart_id = order.cart_id;
            payment.receiver_address =
                fullOrder.store?.owner?.wallet_address ?? 'NA';
            return await this.paymentRepository.save(payment);
        };

        //update each payment
        for (let n = 0; n < payments.length; n++) {
            if (orders.length > n) {
                promises.push(updatePayment(payments[n], orders[n]));
            }
        }
        await Promise.all(promises);
    }

    private async doMassMarketCheckouts(
        storeGroups: IPaymentGroupData[],
        orders: Order[]
    ): Promise<CheckoutResult[]> {
        this.logger.debug(`prepping ${orders.length} orders for checkout`);
        try {
            //prepare each order for checkout
            for (let n = 0; n < orders.length; n++) {
                const order = orders[n];
                let lineItems = storeGroups[n].items;

                //TODO: is this necessary?
                lineItems = await this.lineItemRepository.find({
                    where: { id: In(lineItems.map((i) => i.id)) },
                    relations: ['variant.product', 'order'],
                });

                //TODO: is this necessary?
                orders = await this.orderRepository.find({
                    where: { id: In(orders.map((o) => o.id)) },
                    relations: ['store'],
                });
            }
        } catch (e) {
            this.logger.error(`Error ${e}`);
        }
        this.logger.debug('prepped orders for checkout');

        //call checkout for each store
        const client = new MassMarketClient();
        const output: CheckoutResult[] = [];
        for (let n = 0; n < storeGroups.length; n++) {
            const group = storeGroups[n];

            //create the input for checkout, for each store group
            const checkoutInputs = [];
            for (const item of group.items) {
                const prod: Product = item.variant.product;

                if (prod.massmarket_prod_id?.length) {
                    checkoutInputs.push({
                        productId: prod.massmarket_prod_id,
                        quantity: item.quantity,
                    });
                }
            }

            //get payment currency address
            let currencyAddress = getCurrencyAddress(
                group.currency_code,
                11155111
            );
            if (currencyAddress) {
                if (currencyAddress === '0x0' || currencyAddress === '')
                    currencyAddress = undefined;
            }
            //massmarket checkout for a store group
            const checkout = await client.checkout(
                stringToHex(group.store?.massmarket_store_id),
                stringToHex(group.store?.massmarket_keycard),
                currencyAddress,
                checkoutInputs
            );

            this.logger.debug(
                'got checkout results:' + JSON.stringify(checkout)
            );
            this.logger.debug(orders.length);

            //save the output
            output.push({
                ...checkout,
                medusaOrderId: orders[n].id,
            });
        }

        return output;
    }

    private async updateOrderForMassMarket(checkoutResults: CheckoutResult[]) {
        const promises: Promise<Order>[] = [];
        for (const r of checkoutResults) {
            this.logger.debug(
                'saving order ' + r.paymentId + ', ' + r.medusaOrderId
            );
            promises.push(
                this.orderRepository.save({
                    id: r.medusaOrderId,
                    massmarket_order_id: r.orderHash,
                    massmarket_ttl: r.ttl,
                    massmarket_amount: r.amount,
                })
            );
        }

        this.logger.debug('saving the orders from checkout...');
        await Promise.all(promises);
        this.logger.debug('...saved the orders from checkout');
    }
}

function stringToHex(input: string): HexString {
    const hexString = input.startsWith('0x') ? input.substring(2) : input;
    return `0x${hexString}`;
}

export default MassMarketCartStrategy;
