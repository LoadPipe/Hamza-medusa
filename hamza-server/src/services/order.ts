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
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import RegionRepository from '@medusajs/medusa/dist/repositories/region';
import AddressRepository from '@medusajs/medusa/dist/repositories/address';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { ProductVariantRepository } from '../repositories/product-variant';
import StoreRepository from '../repositories/store';
import CustomerRepository from '../repositories/customer';
import { LineItemService } from '@medusajs/medusa';
import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { Payment } from '../models/payment';
import { Lifetime } from 'awilix';
import { In, Not } from 'typeorm';
import { BuckyClient } from '../buckydrop/bucky-client';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { createLogger, ILogger } from '../utils/logging/logger';
import SmtpMailService from './smtp-mail';
import CustomerNotificationService from './customer-notification';
import { formatCryptoPrice } from '../utils/price-formatter';
import OrderHistoryService from './order-history';
import { OrderHistory } from 'src/models/order-history';
import ShippingMethodRepository from '@medusajs/medusa/dist/repositories/shipping-method';
import CartService from './cart';
import CartRepository from '@medusajs/medusa/dist/repositories/cart';

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
    protected cartService: CartService;
    protected customerRepository_: typeof CustomerRepository;
    protected orderRepository_: typeof OrderRepository;
    protected lineItemRepository_: typeof LineItemRepository;
    protected productRepository_: typeof ProductRepository;
    protected paymentRepository_: typeof PaymentRepository;
    protected cartRepository_: typeof CartRepository;
    protected regionRepository_: typeof RegionRepository;
    protected salesChannelRepository_: typeof SalesChannelRepository;
    protected addressRepository_: typeof AddressRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly buckyLogRepository_: typeof BuckyLogRepository;
    protected readonly shippingMethodRepository_: typeof ShippingMethodRepository;
    protected customerNotificationService_: CustomerNotificationService;
    protected smtpMailService_: SmtpMailService = new SmtpMailService();
    protected orderHistoryService_: OrderHistoryService;
    protected readonly logger: ILogger;
    protected buckyClient: BuckyClient;

    constructor(container) {
        super(container);
        this.cartService = container.cartService;
        this.cartRepository_ = container.cartRepository;
        this.orderRepository_ = container.orderRepository;
        this.customerRepository_ = container.customerRepository;
        this.storeRepository_ = container.storeRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productRepository_ = container.productRepository;
        this.shippingMethodRepository_ = container.shippingMethodRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.regionRepository_ = container.regionRepository;
        this.salesChannelRepository_ = container.salesChannelRepository;
        this.customerNotificationService_ =
            container.customerNotificationService;
        this.orderHistoryService_ = container.orderHistoryService;
        this.logger = createLogger(container, 'OrderService');
        this.buckyLogRepository_ = container.buckyLogRepository;
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
            order.status = OrderStatus.REQUIRES_ACTION;

            //save the order
            order = await this.orderRepository_.save(order);

            order.items = cart.items;

            const lineItemPromise = cart.items.map((item) => {
                item.order_id = order.id;
                return this.lineItemRepository_.save(item);
            });

            await Promise.all([...lineItemPromise]);

            //update the cart
            //cart.completed_at = new Date();
            // await this.cartService_.update(cart.id, cart);

            return order;
        } catch (e) {
            this.logger.error(`Error creating order: ${e}`);
        }
        return null;
    }

    async getOrdersForCheckout(cartId: string): Promise<Order[]> {
        return this.orderRepository_.find({
            where: { cart_id: cartId, status: OrderStatus.REQUIRES_ACTION },
            relations: ['store.owner', 'payments'],
            skip: 0,
            take: 1,
            order: { created_at: 'DESC' },
        });
    }

    async getOrderWithStore(orderId: string): Promise<Order> {
        return this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner'],
        });
    }

    async getOrderWithStoreAndItems(orderId: string): Promise<Order> {
        return this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner', 'items'],
        });
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
        chainId: number
    ): Promise<Order[]> {
        //get orders & order ids
        const orders: Order[] = await this.orderRepository_.find({
            where: {
                cart_id: cartId,
                status: OrderStatus.REQUIRES_ACTION,
            },
            take: 1,
            skip: 0,
            order: { created_at: 'DESC' },
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
            chainId
        );

        //calls to update orders
        const orderPromises = this.getPostCheckoutUpdateOrderPromises(orders);

        //TODO: all of the following should be in a transaction
        const shippingMethods = await this.shippingMethodRepository_.find({
            where: { cart_id: cartId },
        });

        //apply shipping methods to orders
        //TODO: the problem here is if there is 1 shipping method, but multiple orders
        // then we'll need to create duplicate shipping methods, one for each order
        let n = 0;
        for (let shippingMethod of shippingMethods) {
            shippingMethod.order_id =
                orders[n >= orders.length ? orders.length - 1 : n].id;
        }

        //set cart completion date
        const cart = await this.cartRepository_.findOne({
            where: { id: cartId },
        });
        cart.completed_at = new Date();

        //execute all promises
        try {
            await Promise.all([
                //...inventoryPromises,
                ...paymentPromises,
                ...orderPromises,
                this.shippingMethodRepository_.save(shippingMethods),
            ]);

            await this.cartRepository_.save(cart);
        } catch (e) {
            this.logger.error(`Error updating orders/payments: ${e}`);
        }

        //emit event
        await this.eventBus_.emit('order.placed', {
            customerId: orders[0].customer_id,
            orderIds: orderIds,
            orderId: orderIds[0],
            ...orders[0],
        });

        return orders;
    }

    async cancelOrder(orderId: string, cancel_reason: string) {
        //get order
        let order: Order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });

        //set order status
        if (
            order.status === OrderStatus.PENDING ||
            order.status === OrderStatus.REQUIRES_ACTION
        ) {
            order.status = OrderStatus.CANCELED;
            order.canceled_at = new Date();
            order.metadata = { cancel_reason: cancel_reason };

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
            { status: OrderStatus.REQUIRES_ACTION, cart: { id: cart_id } },
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
        return this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
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

    // Just checking if we have orders and returning a boolean
    async checkCustomerOrderBucket(customerId: string): Promise<boolean> {
        console.log(`WTF`);
        const buckets = await Promise.all([
            this.getCustomerOrderBucket(customerId, OrderBucketType.PROCESSING),
            this.getCustomerOrderBucket(customerId, OrderBucketType.SHIPPED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.DELIVERED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.CANCELLED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.REFUNDED),
        ]);

        // Check if any of the order buckets have orders and return true if so
        return buckets.some((bucket) => bucket.length > 0);
    }

    async getCustomerOrderBucket(
        customerId: string,
        bucketType: OrderBucketType
    ): Promise<Order[]> {
        switch (bucketType) {
            case OrderBucketType.PROCESSING:
                return this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: FulfillmentStatus.NOT_FULFILLED,
                    orderStatus: OrderStatus.PENDING,
                });
            case OrderBucketType.SHIPPED:
                return this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: FulfillmentStatus.SHIPPED,
                });
            case OrderBucketType.DELIVERED:
                return this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: OrderStatus.COMPLETED,
                    fulfillmentStatus: FulfillmentStatus.FULFILLED,
                });
            case OrderBucketType.CANCELLED:
                return this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: OrderStatus.CANCELED,
                });
            case OrderBucketType.REFUNDED:
                return this.getCustomerOrdersByStatus(customerId, {
                    paymentStatus: PaymentStatus.REFUNDED,
                });
        }

        return [];
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
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
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
            where: {
                cart_id: cartId,
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
            },
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
        return this.orderRepository_.find({
            where: {
                status: Not(
                    In([
                        OrderStatus.ARCHIVED,
                        OrderStatus.REQUIRES_ACTION,
                        OrderStatus.CANCELED,
                        OrderStatus.COMPLETED,
                    ])
                ),
                payment_status: PaymentStatus.AWAITING,
            },
            relations: ['payments'],
        });
    }

    async sendShippedEmail(order: Order): Promise<void> {
        return this.sendOrderEmail(
            order,
            'orderShipped',
            'order-shipped',
            'shipped'
        );
    }

    async sendDeliveredEmail(order: Order): Promise<void> {
        return this.sendOrderEmail(
            order,
            'orderStatusChanged',
            'order-delivered',
            'delivered'
        );
    }

    async sendCancelledEmail(order: Order): Promise<void> {
        return this.sendOrderEmail(
            order,
            'orderStatusChanged',
            'order-cancelled',
            'cancelled'
        );
    }

    async setOrderStatus(
        order: Order,
        status?: OrderStatus,
        fulfillmentStatus?: FulfillmentStatus,
        paymentStatus?: PaymentStatus,
        metadata?: Record<string, unknown>
    ): Promise<Order> {
        if (
            (status && order.status != status) ||
            (fulfillmentStatus &&
                order.fulfillment_status != fulfillmentStatus) ||
            (paymentStatus && order.payment_status != paymentStatus)
        ) {
            //get values to add to history
            const to_status: OrderStatus | null =
                status && order.status != status ? status : null;
            const to_payment_status: PaymentStatus | null =
                paymentStatus && order.payment_status != paymentStatus
                    ? paymentStatus
                    : null;
            const to_fulfillment_status: FulfillmentStatus | null =
                fulfillmentStatus &&
                order.fulfillment_status != fulfillmentStatus
                    ? fulfillmentStatus
                    : null;

            if (status) {
                order.status = status;
                if (order.fulfillment_status == FulfillmentStatus.FULFILLED) {
                    this.sendDeliveredEmail(order);
                }
            }
            if (fulfillmentStatus) {
                order.fulfillment_status = fulfillmentStatus;
                if (order.fulfillment_status == FulfillmentStatus.SHIPPED) {
                    this.sendShippedEmail(order);
                }
            }
            if (paymentStatus) {
                order.payment_status = paymentStatus;
                if (order.status == OrderStatus.CANCELED) {
                    this.sendCancelledEmail(order);
                }
            }

            //send emails
            //TODO: this should follow medusa events

            //save the order
            await this.orderRepository_.save(order);
            await this.orderHistoryService_.create(order, {
                to_status,
                to_payment_status,
                to_fulfillment_status,
                metadata,
            });
        }

        return order;
    }

    async getOrderHistory(orderId: string): Promise<OrderHistory[]> {
        return this.orderHistoryService_.retrieve(orderId);
    }

    private async sendOrderEmail(
        order: Order,
        requiredNotification: string,
        templateName: string,
        emailType: string
    ): Promise<void> {
        try {
            const hasNotification =
                await this.customerNotificationService_.hasNotification(
                    order.customer_id,
                    requiredNotification
                );

            if (hasNotification) {
                //get customer & cart
                const customer: Customer =
                    await this.customerRepository_.findOne({
                        where: { id: order.customer_id },
                    });
                const cart: Cart = await this.cartService_.retrieve(
                    order.cart_id
                );

                //send the mail
                this.smtpMailService_.sendMail({
                    from:
                        process.env.SMTP_HAMZA_FROM ??
                        'support@hamzamarket.com',
                    mailData: {
                        orderId: order.id,
                        orderAmount: formatCryptoPrice(
                            order.total,
                            order.currency_code
                        ),
                        orderDate: order.created_at,
                        items: order.items.map((i) => {
                            return {
                                title: i.title,
                                unit_price: formatCryptoPrice(
                                    i.unit_price,
                                    i.currency_code
                                ),
                                quantity: i.quantity,
                                thumbnail: i.thumbnail,
                            };
                        }),
                    },
                    to: customer.is_verified ? customer.email : cart.email,
                    templateName,
                    subject: `Your order has been from Hamza.market ${emailType}`,
                });
            }
        } catch (e: any) {
            this.logger.error(
                `Error sending ${emailType} email for order ${order.id}`
            );
        }
    }

    private async updatePaymentAfterTransaction(
        paymentId: string,
        update: Partial<Payment>
    ): Promise<Payment> {
        const result = await this.paymentRepository_.save({
            id: paymentId,
            ...update,
        });
        return result;
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
            status: Not(
                In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
            ),
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
            order: { created_at: 'DESC' },
        });

        if (orders) orders = orders.filter((o) => o.items?.length > 0);

        return orders;
    }

    private getPostCheckoutUpdatePaymentPromises(
        payments: Payment[],
        transactionId: string,
        payerAddress: string,
        chainId: number
    ): Promise<Order | Payment>[] {
        const promises: Promise<Order | Payment>[] = [];

        //update payments with transaction info
        payments.forEach((p, i) => {
            promises.push(
                this.updatePaymentAfterTransaction(p.id, {
                    blockchain_data: {
                        transaction_id: transactionId,
                        payer_address: payerAddress,
                        escrow_address: '', //TODOX: need to get these from store - order.store.escrow_metadata.address
                        receiver_address: '', //- order.store.wallet_address
                        chain_id: chainId,
                    },
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
                status: OrderStatus.PENDING,
                payment_status: PaymentStatus.AWAITING,
            });
        });
    }

    async createMockOrders(): Promise<Order> {
        try {
            console.log('Starting mock order creation...');

            // Step 1: Get the first customer
            const customer = await this.customerRepository_.findOne({
                where: {},
                order: { created_at: 'ASC' },
            });

            if (!customer) {
                throw new Error('No customers found.');
            }
            console.log('Customer found:', customer);

            // Step 2: Get the first region
            const region = await this.regionRepository_
                .createQueryBuilder('region')
                .where('LOWER(region.name) = :name', { name: 'na' })
                .getOne();

            if (!region) {
                throw new Error('No regions found.');
            }
            console.log('Region found:', region);

            // Step 3: Get random products
            const randomCount = Math.floor(Math.random() * 10) + 1; // Random between 1 and 10

            const products = await this.productRepository_.query(
                `SELECT * FROM product ORDER BY RANDOM() LIMIT ${randomCount}`
            );

            console.log(
                `Retrieved ${products.length} random products`,
                products
            );

            if (!products.length) {
                throw new Error('No products found.');
            }
            console.log('Products found:', products);

            const variants = await Promise.all(
                products.map((product) =>
                    this.productVariantRepository_.findOne({
                        where: { product_id: product.id },
                        order: { created_at: 'ASC' }, // Choose the first variant if multiple exist
                    })
                )
            );

            // Validate that each product has at least one variant
            variants.forEach((variant, index) => {
                if (!variant) {
                    throw new Error(
                        `No variant found for product ${products[index].id}`
                    );
                }
            });

            console.log('Variants found:', variants);

            // Step 4: Validate store_id from the first product
            const storeId = products[0]?.store_id;
            if (!storeId) {
                throw new Error('Store ID not found in the product.');
            }
            console.log('Store ID found:', storeId);

            // Grab the default sales channel... the first one
            const salesChannel = await this.salesChannelRepository_.findOne({
                where: {}, // Empty where clause to find any sales channel
                order: { created_at: 'ASC' }, // Sort by creation time, oldest first
            });

            if (!salesChannel) {
                throw new Error('No sales channels found.');
            }

            const sales_channel_id = salesChannel.id;
            console.log('Sales Channel ID:', sales_channel_id);

            console.log('Creating cart with:', {
                customer_id: customer.id,
                email: customer.email,
                region_id: region.id,
            });
            // Step 5: Create a cart for the customer
            const cart = await this.cartRepository_.save(
                this.cartRepository_.create({
                    customer_id: customer.id,
                    email: customer.email,
                    region_id: region.id,
                    sales_channel_id: sales_channel_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
            );
            console.log('Cart created:', cart);

            // Step 6: Add line items to the cart
            const lineItems = [];
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const variant = variants[i];

                const lineItem = this.lineItemRepository_.create({
                    cart_id: cart.id,
                    title: product.title,
                    description: product.description,
                    thumbnail: product.thumbnail,
                    unit_price: variant.prices?.[0]?.amount || 1000,
                    quantity: Math.floor(Math.random() * 5) + 1,
                    currency_code: region.currency_code,
                    variant_id: variant.id, // Add variant_id here
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                const savedLineItem =
                    await this.lineItemRepository_.save(lineItem);
                lineItems.push(savedLineItem);
            }
            cart.items = lineItems;
            console.log('Line items added to cart:', cart.items);

            // Step 7: Create an order using the cart and product's store_id
            let order: Order = new Order();
            order.status = OrderStatus.PENDING;
            order.store_id = storeId; // Use store_id directly from the product
            order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
            order.payment_status = PaymentStatus.AWAITING;
            order.sales_channel_id = sales_channel_id;
            order.customer_id = customer.id;
            order.email = customer.email;
            order.cart_id = cart.id;
            order.region_id = cart.region_id;
            order.currency_code = 'usdt';
            order.created_at = new Date();
            order.updated_at = new Date();

            order = await this.orderRepository_.save(order);
            console.log('Order created successfully:', order);

            // Step 8: Link line items to the order
            order.items = cart.items;
            const lineItemPromises = cart.items.map((item) => {
                item.order_id = order.id;
                return this.lineItemRepository_.save(item);
            });

            await Promise.all(lineItemPromises);

            console.log('Line items linked to order:', order.items);

            this.logger.info(`Mock order created successfully: ${order.id}`);
            return order;
        } catch (error) {
            console.error('Error during mock order creation:', error.message);
            this.logger.error(`Error creating mock order: ${error.message}`);
            throw error;
        }
    }
}
