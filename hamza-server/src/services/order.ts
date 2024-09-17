import {
    Cart,
    FulfillmentStatus,
    OrderService as MedusaOrderService,
    OrderStatus,
    PaymentStatus,
    Logger,
    IdempotencyKeyService,
    ProductVariant,
    LineItem,
} from '@medusajs/medusa';
import { BuckyLogRepository } from '../repositories/bucky-log';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { ProductVariantRepository } from '../repositories/product-variant';
import StoreRepository from '../repositories/store';
import { LineItemService } from '@medusajs/medusa';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { Lifetime } from 'awilix';
import { In, Not } from 'typeorm';
import {
    BuckyClient
} from '../buckydrop/bucky-client';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { createLogger, ILogger } from '../utils/logging/logger';

// Since {TO_PAY, TO_SHIP} are under the umbrella name {Processing} in FE, not sure if we should modify atm
// In medusa we have these 5 DEFAULT order.STATUS's {PENDING, COMPLETED, ARCHIVED, CANCELED, REQUIRES_ACTION}
// In this case PENDING will be {PROCESSING}
// REFACTOR {TO_PAY, TO_SHIP} is now under {PROCESSING} umbrella
export enum OrderBucketType {
    PROCESSING = 1,
    SHIPPED = 2,
    DELIVERED = 3,
    CANCELLED = 4,
    REFUNDED = 5,
}

type InjectDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    lineItemService: LineItemService;
};

type OrderBucketList = { [key: string]: Order[] };

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected lineItemService: LineItemService;
    protected orderRepository_: typeof OrderRepository;
    protected lineItemRepository_: typeof LineItemRepository;
    protected productRepository_: typeof ProductRepository;
    protected paymentRepository_: typeof PaymentRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly logger: ILogger;
    protected buckyClient: BuckyClient;
    protected readonly buckyLogRepository: typeof BuckyLogRepository;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.storeRepository_ = container.storeRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productRepository_ = container.productRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.logger = createLogger(container, 'OrderService');
        this.buckyLogRepository = container.buckyLogRepository;
        this.buckyClient = new BuckyClient(container.buckyLogRepository);
    }

    async createFromPayment(
        cart: Cart,
        payment: Payment,
        storeId: string
    ): Promise<Order> {
        this.logger.info(
            `creating Order with input ${JSON.stringify(payment)}`
        );
        try {
            //create the order
            let order: Order = new Order();
            order.billing_address_id = cart.billing_address_id;
            order.cart_id = cart.id;
            order.created_at = payment.created_at;
            order.currency_code = payment.currency_code;
            order.customer_id = cart.customer_id;
            order.discount_total = 0; //TODO: get proper discount
            order.store_id = storeId;
            order.email = cart.email;
            order.payment_status = PaymentStatus.NOT_PAID;
            order.shipping_address_id = cart.shipping_address_id;
            order.paid_total = payment.amount;
            order.region_id = cart.region_id;
            order.sales_channel_id = cart.sales_channel_id;
            order.total = payment.amount;
            order.updated_at = payment.updated_at;

            //save the order
            order = await this.orderRepository_.save(order);

            order.items = cart.items;

            const lineItemPromise = cart.items.map((item) => {
                item.order_id = order.id;
                return this.lineItemRepository_.save(item);
            });

            await Promise.all([...lineItemPromise]);

            //update the cart
            cart.completed_at = new Date();
            await this.cartService_.update(cart.id, cart);

            return order;
        } catch (e) {
            this.logger.error(`Error creating order: ${e}`);
        }
        return null;
    }

    async getOrdersForCart(cartId: string): Promise<Order[]> {
        return await this.orderRepository_.find({
            where: { cart_id: cartId, status: OrderStatus.PENDING },
            relations: ['store.owner', 'payments'],
        });
    }

    async getOrderWithStore(orderId: string): Promise<Order> {
        return await this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner'],
        });
    }

    async getOrderWithStoreAndItems(orderId: string): Promise<Order> {
        return await this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner', 'items'],
        });
    }

    async updatePaymentAfterTransaction(
        paymentId: string,
        update: Partial<Payment>
    ): Promise<Payment> {
        const result = await this.paymentRepository_.save({
            id: paymentId,
            ...update,
        });
        return result;
    }

    async updateInventory(
        variantOrVariantId: string,
        quantityToDeduct: number
    ) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantOrVariantId },
                }
            );

            if (productVariant.inventory_quantity >= quantityToDeduct) {
                productVariant.inventory_quantity -= quantityToDeduct;
                await this.productVariantRepository_.save(productVariant);
                this.logger.debug(
                    `Inventory updated for variant ${productVariant.id}, new inventory count: ${productVariant.inventory_quantity}`
                );
                return productVariant;
            } else if (productVariant.allow_backorder) {
                this.logger.debug(
                    'Inventory below requested deduction but backorders are allowed.'
                );
            } else {
                this.logger.debug(
                    'Not enough inventory to deduct the requested quantity.'
                );
            }
        } catch (e) {
            this.logger.error(
                `Error updating inventory for variant ${variantOrVariantId}: ${e}`
            );
        }
    }

    async finalizeCheckout(
        cartId: string,
        transactionId: string,
        payerAddress: string,
        escrowContractAddress: string,
        chainId: number
    ): Promise<Order[]> {
        //get orders & order ids
        const orders: Order[] = await this.orderRepository_.find({
            where: { cart_id: cartId, status: OrderStatus.PENDING },
        });
        const orderIds = orders.map((order) => order.id);

        //get payments associated with orders
        const payments: Payment[] = await this.paymentRepository_.find({
            where: { order_id: In(orderIds) },
        });

        //do buckydrop order creation
        if (process.env.BUCKY_ENABLE_PURCHASE)
            await this.processBuckydropOrders(cartId, orders);

        //calls to update inventory
        //const inventoryPromises =
        //    this.getPostCheckoutUpdateInventoryPromises(cartProductsJson);

        //calls to update payments
        const paymentPromises = this.getPostCheckoutUpdatePaymentPromises(
            payments,
            transactionId,
            payerAddress,
            escrowContractAddress,
            chainId
        );

        //calls to update orders
        const orderPromises = this.getPostCheckoutUpdateOrderPromises(orders);

        await this.eventBus_.emit('order.placed', {
            orderIds: orderIds,
            orderId: orderIds[0],
            ...orders[0],
        });

        //execute all promises
        try {
            await Promise.all([
                //...inventoryPromises,
                ...paymentPromises,
                ...orderPromises,
            ]);
        } catch (e) {
            this.logger.error(`Error updating orders/payments: ${e}`);
        }

        return orders;
    }

    async cancelOrder(orderId: string) {
        //get order
        let order: Order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });

        //set order status
        if (order.status === OrderStatus.PENDING) {
            order.status = OrderStatus.CANCELED;

            await this.orderRepository_.save(order);
        }

        return order;
    }

    async changeFulfillmentStatus(orderId: string, status: FulfillmentStatus) {
        const order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        order.fulfillment_status = status;
        await this.orderRepository_.save(order);
        return order;
    }

    async cancelOrderFromCart(cart_id: string) {
        await this.orderRepository_.update(
            { status: OrderStatus.PENDING, cart: { id: cart_id } },
            { status: OrderStatus.ARCHIVED }
        );
    }

    async getVendorFromOrder(orderId: string) {
        try {
            const order = (await this.orderRepository_.findOne({
                where: { id: orderId },
                relations: ['store'],
            })) as Order;
            const store_id = order.store_id;
            const storeRepo = this.manager_.withRepository(
                this.storeRepository_
            );
            const store = await storeRepo.findOneBy({ id: store_id });
            return store.name;
        } catch (e) {
            this.logger.error(`Error fetching store from order: ${e}`);
        }
    }

    async getCustomerOrders(customerId: string): Promise<Order[]> {
        return await this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: Not(OrderStatus.ARCHIVED),
            },
            relations: ['cart.items', 'cart', 'cart.items.variant.product'],
        });
    }

    async getCustomerOrderBuckets(
        customerId: string
    ): Promise<OrderBucketList> {
        const buckets = await Promise.all([
            this.getCustomerOrderBucket(customerId, OrderBucketType.PROCESSING),
            this.getCustomerOrderBucket(customerId, OrderBucketType.SHIPPED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.DELIVERED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.CANCELLED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.REFUNDED),
        ]);

        const output = {
            Processing: buckets[0],
            Shipped: buckets[1],
            Delivered: buckets[2],
            Cancelled: buckets[3],
            Refunded: buckets[4],
        };

        return output;
    }

    async getCustomerOrderBucket(
        customerId: string,
        bucketType: OrderBucketType
    ): Promise<Order[]> {
        switch (bucketType) {
            case OrderBucketType.PROCESSING:
                return await this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: FulfillmentStatus.NOT_FULFILLED,
                    orderStatus: OrderStatus.PENDING,
                });
            case OrderBucketType.SHIPPED:
                return await this.getCustomerOrdersByStatus(customerId, {
                    paymentStatus: PaymentStatus.AWAITING,
                    fulfillmentStatus: FulfillmentStatus.SHIPPED,
                });
            case OrderBucketType.DELIVERED:
                return await this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: OrderStatus.COMPLETED,
                    fulfillmentStatus: FulfillmentStatus.FULFILLED,
                });
            case OrderBucketType.CANCELLED:
                return await this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: OrderStatus.CANCELED,
                });
            case OrderBucketType.REFUNDED:
                return await this.getCustomerOrdersByStatus(customerId, {
                    paymentStatus: PaymentStatus.REFUNDED,
                });
        }

        return [];
    }

    //TODO: the return type of this is hard to work with
    async orderSummary(cartId: string): Promise<{
        cart: Cart;
        items: any[];
    }> {
        const orders = (await this.orderRepository_.find({
            where: { cart_id: cartId, status: Not(OrderStatus.ARCHIVED) },
            relations: ['cart.items.variant.product', 'store.owner'],
        })) as Order[];

        const products = [];
        let cart: Cart = null;

        orders.forEach((order) => {
            cart = order.cart;
            order.cart.items.forEach((item) => {
                const product = {
                    ...item.variant.product,
                    order_id: order.id,
                    store_name: order.store.name, // Add store.name to the product
                    currency_code: item.currency_code,
                    unit_price: item.unit_price,
                };
                products.push(product);
            });
        });

        const seen = new Set();
        const items = [];

        for (const item of products) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                items.push(item);
            }
        }

        return {
            cart,
            items,
        };
    }

    async getNotReviewedOrders(customer_id: string) {
        const orderRepository = this.activeManager_.getRepository(Order);
        const notReviewedOrders = await orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.products', 'product')
            .leftJoinAndSelect('order.store', 'store')
            .leftJoin(
                'order.reviews',
                'review',
                'review.customer_id = :customer_id',
                { customer_id }
            )
            .select([
                'order.id',
                'order.status',
                'product.thumbnail',
                // 'store.icon',
            ])
            .where('order.customer_id = :customer_id', { customer_id })
            .andWhere('review.id IS NULL') // Ensures that the order has no reviews
            .andWhere('order.status != :status', { status: 'archived' })
            .getMany();

        if (!notReviewedOrders || notReviewedOrders.length === 0) {
            throw new Error('No unreviewed orders found');
        }

        return notReviewedOrders.map((order) => ({
            order_id: order.id,
            status: order.status,
            // store_logo: order.store.icon,
            // thumbnails: order.products.map((product) => product.thumbnail), // Assuming multiple products can be in one order
        }));
    }

    async listCustomerOrders(
        customerId: string
    ): Promise<{ orders: any[]; cartCount: number }> {
        const orders = await this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: Not(OrderStatus.ARCHIVED),
            },
            select: ['id', 'cart_id'], // Select id and cart_id
            // relations: ['cart.items', 'cart.items.variant'],
        });

        const cartCount = orders.length;

        let newOrderList: Order[] = await this.getOrdersWithItems(orders);

        // return { orders: orders, array: newOrderList };
        return { orders: newOrderList, cartCount: cartCount };
    }

    async getOrderDetails(cartId: string) {
        const orderHandle = await this.orderRepository_.findOne({
            where: { cart_id: cartId, status: Not(OrderStatus.ARCHIVED) },
            relations: ['cart.items', 'cart.items.variant.product', 'cart'],
        });
        let product_handles = [];
        orderHandle.cart.items.forEach((item) => {
            product_handles.push(item.variant.product.handle);
        });
        return product_handles;
    }

    // Ok now lets list all orders via lineItemService and return when the relation to cart_id matches..
    async listCollection(cartId: string) {
        try {
            const lineItems = await this.lineItemService.list({
                cart_id: cartId,
            });
            return lineItems;
        } catch (e) {
            this.logger.error('Error retrieving order', e);
            throw new Error('Failed to retrieve order');
        }
    }

    async getOrdersWithItems(orders: Order[]): Promise<Order[]> {
        let output: Order[] = [];
        for (const order of orders) {
            //TODO: do this with promises
            const orderWithItems = await this.orderRepository_.findOne({
                where: {
                    id: order.id,
                },
                relations: ['cart.items', 'cart.items.variant.product'],
            });
            output.push(orderWithItems);
        }
        return output;
    }

    async getBuckyProductVariantsFromOrder(
        order: Order
    ): Promise<{ variants: ProductVariant[]; quantities: number[] }> {
        const orders: Order[] = await this.getOrdersWithItems([order]);
        const relevantItems: LineItem[] = orders[0].cart.items.filter(
            (i) => i.variant.product.bucky_metadata
        );

        return relevantItems?.length
            ? {
                variants: relevantItems.map((i) => i.variant),
                quantities: relevantItems.map((i) => i.quantity),
            }
            : { variants: [], quantities: [] };
    }

    async getOrdersWithUnverifiedPayments() {
        return await this.orderRepository_.find({
            where: { payment_status: PaymentStatus.AWAITING },
            relations: ['payments']
        });
    }

    private async processBuckydropOrders(
        cartId: string,
        orders: Order[]
    ): Promise<void> {
        try {
            for (const order of orders) {
                const { variants, quantities } =
                    await this.getBuckyProductVariantsFromOrder(order);
                if (variants?.length) {
                    order.bucky_metadata = { status: 'pending' };
                    await this.orderRepository_.save(order);

                    this.logger.debug('BUCKY CREATED ORDER');
                }
            }
        } catch (e) {
            this.logger.error(`Failed to create buckydrop order for ${cartId}`);
        }
    }

    private async getCustomerOrdersByStatus(
        customerId: string,
        statusParams: {
            orderStatus?: OrderStatus;
            paymentStatus?: PaymentStatus;
            fulfillmentStatus?: FulfillmentStatus;
        }
    ): Promise<Order[]> {
        const where: {
            customer_id: string;
            status?: any;
            payment_status?: any;
            fulfillment_status?: any;
        } = {
            customer_id: customerId,
            status: Not(OrderStatus.ARCHIVED),
        };

        if (statusParams.orderStatus) {
            where.status = statusParams.orderStatus;
        }

        if (statusParams.paymentStatus) {
            where.payment_status = statusParams.paymentStatus;
        }

        if (statusParams.fulfillmentStatus) {
            where.fulfillment_status = statusParams.fulfillmentStatus;
        }

        let orders = await this.orderRepository_.find({
            where,
            relations: [
                'items',
                'store',
                'shipping_address',
                'customer',
                'items.variant.product',
            ],
        });

        if (orders)
            orders = orders.filter(o => o.items?.length > 0);

        return orders;
    }

    private getPostCheckoutUpdatePaymentPromises(
        payments: Payment[],
        transactionId: string,
        payerAddress: string,
        escrowContractAddress: string,
        chainId: number
    ): Promise<Order | Payment>[] {
        const promises: Promise<Order | Payment>[] = [];

        //update payments with transaction info
        payments.forEach((p, i) => {
            promises.push(
                this.updatePaymentAfterTransaction(p.id, {
                    transaction_id: transactionId,
                    payer_address: payerAddress,
                    escrow_contract_address: escrowContractAddress,
                    chain_id: chainId
                })
            );
        });

        return promises;
    }

    private getPostCheckoutUpdateOrderPromises(
        orders: Order[]
    ): Promise<Order>[] {
        return orders.map((o) => {
            return this.orderRepository_.save({
                id: o.id,
                payment_status: PaymentStatus.AWAITING,
            });
        });
    }
}
