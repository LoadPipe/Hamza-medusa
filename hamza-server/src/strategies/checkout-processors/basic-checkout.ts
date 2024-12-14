import {
    Cart,
    CartCompletionResponse,
    IdempotencyKeyService,
    Logger,
} from '@medusajs/medusa';
import OrderService from '../../services/order';
import CartService from '../../services/cart';
import ProductService from '../../services/product';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { Payment } from '../../models/payment';
import { Order } from '../../models/order';
import { Store } from '../../models/store';
import { LineItem } from '../../models/line-item';
import { PaymentDataInput } from '@medusajs/medusa/dist/services/payment';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import WhiteListService from '../../services/whitelist';
import StoreRepository from '../../repositories/store';
import { WhiteList } from '../../models/whitelist';
import { createLogger, ILogger } from '../../utils/logging/logger';
import StoreShippingSpecService from '../../services/store-shipping-spec';

export interface IPaymentGroupData {
    items: LineItem[];
    total: bigint;
    currency_code: string;
    store?: Store;
}

/**
 * Does basic checkout; can be used as a base class or by itself.
 */
export class BasicCheckoutProcessor {
    protected readonly idempotencyKeyService: IdempotencyKeyService;
    protected readonly cartService: CartService;
    protected readonly productService: ProductService;
    protected readonly shippingSpecService: StoreShippingSpecService;
    protected readonly paymentService: PaymentService;
    protected readonly orderService: OrderService;
    protected readonly whitelistService: WhiteListService;
    protected readonly paymentRepository: typeof PaymentRepository;
    protected readonly orderRepository: typeof OrderRepository;
    protected readonly lineItemRepository: typeof LineItemRepository;
    protected readonly storeRepository: typeof StoreRepository;
    protected readonly logger: ILogger;
    protected cart: Cart = null;
    protected cartId: string = '';
    protected payments: Payment[] = [];
    protected paymentGroups: IPaymentGroupData[] = [];
    protected orders: Order[] = [];

    constructor(container) {
        this.idempotencyKeyService = container.idempotencyKeyService;
        this.cartService = container.cartService;
        this.paymentService = container.paymentService;
        this.productService = container.productService;
        this.orderService = container.orderService;
        this.shippingSpecService = container.storeShippingSpecService;
        this.paymentRepository = container.paymentRepository;
        this.orderRepository = container.orderRepository;
        this.lineItemRepository = container.lineItemRepository;
        this.whitelistService = container.whitelistService;
        this.storeRepository = container.storeRepository;
        this.logger = createLogger(container, 'BasicCheckoutProcessor');
    }

    /**
     * @description
     * - breaks up the cart into groups based on store id and currency.
     * - each item group is a unique pairing of store id and currency.
     * - a payment is created for each item group, to pay for that group of items.
     * - an order is created for each payment.
     *
     * @param cartId
     * @returns CartCompletionResponse
     */
    async complete(cartId: string): Promise<CartCompletionResponse> {
        try {
            this.cartId = cartId;
            this.logger.debug(`CheckoutProcessor: cart id is ${this.cartId}`);

            await this.doCheckoutSteps();

            //create & return the response
            const response: CartCompletionResponse = this.getSuccessResponse();

            return response;
        } catch (e) {
            this.logger.error(e);
            const response: CartCompletionResponse = {
                response_code: e?.code ? e.code : 500,
                response_body: {
                    payment_count: 0,
                    message: e.toString(),
                    payments: [],
                    cart_id: cartId,
                },
            };

            //return an error response
            this.logger.debug(
                `checkout response is ${JSON.stringify(response)}`
            );
            return response;
        }
    }

    /**
     * Override this to change the steps or the order of the steps.
     */
    protected async doCheckoutSteps(): Promise<void> {
        //get the cart
        await this.doRetrieveCart();

        //restrict by whitelist
        if (await this.customerRestrictedByWhitelist()) {
            throw { code: 401, message: 'Customer not whitelisted' };
        }

        //group payments by store
        await this.doCreateGroups();

        //create payments; one per group
        await this.doCreatePayments();

        //create orders; one per payment
        await this.doCreateOrders();

        //safety check: there should be the same number of orders as groups
        if (this.orders.length != this.paymentGroups.length)
            throw new Error('inconsistency between payment groups and orders');

        //save/update payments with order ids
        await this.updatePaymentFromOrder(this.payments, this.orders);
    }

    /**
     * Override this to change how the cart gets retrieved.
     */
    protected async doRetrieveCart(): Promise<void> {
        this.logger.debug(`CheckoutProcessor: retrieving cart ${this.cartId}`);
        this.cart = await this.cartService.retrieve(
            this.cartId,
            {
                relations: [
                    'items.variant.product.store',
                    'items.variant.prices', //TODO: we need prices?
                    'customer',
                ],
            },
            null,
            true
        );
    }

    /**
     * Override this to change how whitelist restriction is done.
     */
    //TODO: currently checks for one store, but should check ALL stores
    protected async customerRestrictedByWhitelist(): Promise<boolean> {
        this.logger.debug(
            `CheckoutProcessor: customerRestrictedByWhitelist ${this.cartId}`
        );
        if (process.env.RESTRICT_WHITELIST_CHECKOUT) {
            const store: Store = await this.getStore();

            //check whitelist
            const whitelist: WhiteList[] =
                await this.whitelistService.getByCustomerId(
                    store.id,
                    this.cart.customer.id
                );
            return whitelist?.length == 0;
        }

        return false;
    }

    /**
     * Override this to change how payments get grouped.
     */
    protected async doCreateGroups(): Promise<void> {
        this.logger.debug(`CheckoutProcessor: creating payment groups`);
        this.paymentGroups = this.groupByStore(this.cart);
    }

    /**
     * Override this to change how payments get created.
     */
    protected async doCreatePayments(): Promise<void> {
        this.logger.debug(`CheckoutProcessor: creating payments`);
        this.payments = await this.createCartPayments(
            this.cart,
            this.paymentGroups
        );
    }

    /**
     * Override this to change how orders get created.
     */
    protected async doCreateOrders(): Promise<void> {
        this.logger.debug(`CheckoutProcessor: creating orders`);
        this.orders = await this.createOrdersForPayments(
            this.cart,
            this.payments,
            this.paymentGroups
        );
    }

    /**
     * Override this to change how a successful response is constructed.
     */
    protected getSuccessResponse(): CartCompletionResponse {
        const response = {
            response_code: 200,
            response_body: {
                payment_count: this.payments.length,
                message: 'payment successful',
                payments: this.payments,
                orders: this.orders,
                cart_id: this.cartId,
            },
        };

        //this.logger.debug(
        //    `CheckoutProcessor: returning response ${JSON.stringify(response)}`
        //);
        return response;
    }

    protected createPaymentInput(
        cart: Cart,
        storeGroup: IPaymentGroupData
    ): PaymentDataInput {
        //divide the cart items
        const itemsFromStore = cart.items.filter(
            (i: LineItem) => i.currency_code === storeGroup.currency_code
        );

        //get total amount for the items
        let amount = itemsFromStore.reduce(
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

    //TODO: should get ALL stores
    protected async getStore(): Promise<Store> {
        const storeId = this.cart.items[0]?.variant?.product?.store?.id;
        if (storeId) {
            return this.storeRepository.findOne({
                where: { id: storeId },
                relations: ['owner'],
            });
        }
        return null;
    }

    protected groupByStore(cart: Cart): IPaymentGroupData[] {
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

    protected async createCartPayments(
        cart: Cart,
        paymentGroups: IPaymentGroupData[]
    ): Promise<Payment[]> {
        //calculate shipping cost
        const shippingCost =
            await this.shippingSpecService.calculateShippingPriceForCart(
                cart.id
            );

        //for each unique group, make payment input to create a payment
        const paymentInputs: PaymentDataInput[] = [];
        paymentGroups.forEach((group) => {
            const input = this.createPaymentInput(cart, group);
            input.amount += shippingCost;
            paymentInputs.push(input);
        });

        //create the payments
        const promises: Promise<Payment>[] = [];
        for (let i = 0; i < paymentInputs.length; i++) {
            promises.push(this.paymentService.create(paymentInputs[i]));
        }

        const payments: Payment[] = await Promise.all(promises);
        return payments;
    }

    protected async createOrdersForPayments(
        cart: Cart,
        payments: Payment[],
        paymentGroups: IPaymentGroupData[]
    ): Promise<Order[]> {
        const promises: Promise<Order>[] = [];
        for (let i = 0; i < payments.length; i++) {
            promises.push(
                this.orderService.createFromPayment(
                    cart,
                    payments[i],
                    paymentGroups[i].store?.id
                )
            );
        }

        const orders = await Promise.all(promises);
        return orders;
    }

    protected async updatePaymentFromOrder(
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

            if (payment.blockchain_data) {
                payment.blockchain_data.receiver_address =
                    fullOrder.store?.owner?.wallet_address ?? 'NA';
            }
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
}
