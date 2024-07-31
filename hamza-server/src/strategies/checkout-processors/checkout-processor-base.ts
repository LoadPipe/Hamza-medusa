import {
    Cart,
    CartCompletionResponse,
    IdempotencyKeyService,
    ProductService,
    CartService,
    Logger,
} from '@medusajs/medusa';
import OrderService from '../../services/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { Payment } from '../../models/payment';
import { Order } from '../../models/order';
import { Store } from '../../models/store';
import { LineItem } from '../../models/line-item';
import { PaymentDataInput } from '@medusajs/medusa/dist/services/payment';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';


export interface IPaymentGroupData {
    items: LineItem[];
    total: bigint;
    currency_code: string;
    store?: Store;
}

export abstract class CheckoutProcessorBase {
    protected readonly idempotencyKeyService: IdempotencyKeyService;
    protected readonly cartService: CartService;
    protected readonly productService: ProductService;
    protected readonly paymentService: PaymentService;
    protected readonly orderService: OrderService;
    protected readonly paymentRepository: typeof PaymentRepository;
    protected readonly orderRepository: typeof OrderRepository;
    protected readonly lineItemRepository: typeof LineItemRepository;
    protected readonly logger: Logger;
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
     * @returns CartCompletionResponse
     */
    async complete(
        cartId: string
    ): Promise<CartCompletionResponse> {
        try {
            this.cartId = cartId;
            this.logger.debug(`CheckoutProcessor: cart id is ${this.cartId}`);

            await this.doCheckoutSteps();

            //create & return the response
            const response: CartCompletionResponse = this.getSuccessResponse();

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

    /**
     * Override this to change the steps or the order of the steps. 
     */
    protected async doCheckoutSteps(): Promise<void> {

        //get the cart
        await this.doRetrieveCart();

        //group payments by store
        await this.doCreateGroups();

        //create payments; one per group
        await this.doCreatePayments();

        //create orders; one per payment
        await this.doCreateOrders();

        //safety check: there should be the same number of orders as groups
        if (this.orders.length != this.paymentGroups.length)
            throw new Error(
                'inconsistency between payment groups and orders'
            );

        //save/update payments with order ids
        await this.updatePaymentFromOrder(this.payments, this.orders);
    }

    /**
     * Override this to change how the cart gets retrieved.
     */
    protected async doRetrieveCart(): Promise<void> {
        this.logger.debug(`CheckoutProcessor: retrieving cart ${this.cartId}`);
        this.cart = await this.cartService.retrieve(this.cartId, {
            relations: [
                'items.variant.product.store',
                'items.variant.prices', //TODO: we need prices?
            ],
        });
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

        this.logger.debug(`CheckoutProcessor: returning response ${response}`);
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
        //for each unique group, make payment input to create a payment
        const paymentInputs: PaymentDataInput[] = [];
        paymentGroups.forEach((group) => {
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

        return await Promise.all(promises);
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
}
