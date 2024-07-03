import {
    Cart,
    FulfillmentStatus,
    OrderService as MedusaOrderService,
    OrderStatus,
    PaymentStatus,
    Logger,
    IdempotencyKeyService,
    ProductVariant,
} from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { ProductVariantRepository } from '../repositories/product-variant';
import StoreRepository from '../repositories/store';
import { LineItemService } from '@medusajs/medusa';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { Lifetime } from 'awilix';
import { In, Not } from 'typeorm';

type InjectDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    lineItemService: LineItemService;
};

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected orderRepository_: typeof OrderRepository;
    protected lineItemService: LineItemService;
    protected paymentRepository_: typeof PaymentRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly logger: Logger;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.storeRepository_ = container.storeRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.logger = container.logger;
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

            //update the cart
            cart.completed_at = new Date();
            await this.cartService_.update(cart.id, cart);

            //emitting event in event bus

            return order;
        } catch (e) {
            this.logger.error(`Error creating order: ${e}`);
        }
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
        cartProductsJson: string, //TODO: what in the actual fuck is this
        cartId: string,
        transactionId: string,
        payerAddress,
        escrowContractAddress
    ): Promise<Order[]> {
        this.logger.debug(`Cart Products ${cartProductsJson}`);
        console.log('cart id', cartId);
        //get orders & order ids
        const orders: Order[] = await this.orderRepository_.find({
            where: { cart_id: cartId, status: OrderStatus.PENDING },
        });
        const orderIds = orders.map((order) => order.id);

        //get payments associated with orders
        const payments: Payment[] = await this.paymentRepository_.find({
            where: { order_id: In(orderIds) },
        });

        //calls to update inventory
        const inventoryPromises =
            this.getPostCheckoutUpdateInventoryPromises(cartProductsJson);

        //calls to update payments
        const paymentPromises = this.getPostCheckoutUpdatePaymentPromises(
            payments,
            transactionId,
            payerAddress,
            escrowContractAddress
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
                ...inventoryPromises,
                ...paymentPromises,
                ...orderPromises,
            ]);
        } catch (e) {
            this.logger.error(`Error updating orders/payments: ${e}`);
        }

        return orders;
    }

    async cancellationStatus(orderId: string) {
        const order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        if (order.status === OrderStatus.PENDING) {
            order.status = OrderStatus.CANCELED;
            await this.orderRepository_.save(order);
            return order;
        }
    }

    async orderStatus(orderId: string) {
        const order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        return order.status;
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

    private getPostCheckoutUpdateInventoryPromises(
        cartProductsJson: string
    ): Promise<ProductVariant>[] {
        const cartObject = JSON.parse(cartProductsJson);
        return cartObject.map((item) => {
            return this.updateInventory(
                item.variant_id,
                item.reduction_quantity
            );
        });
    }

    private getPostCheckoutUpdatePaymentPromises(
        payments: Payment[],
        transactionId: string,
        payerAddress: string,
        escrowContractAddress: string
    ): Promise<Order | Payment>[] {
        const promises: Promise<Order | Payment>[] = [];

        //update payments with transaction info
        payments.forEach((p, i) => {
            promises.push(
                this.updatePaymentAfterTransaction(p.id, {
                    transaction_id: transactionId,
                    payer_address: payerAddress,
                    escrow_contract_address: escrowContractAddress,
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

    async completeOrderTemplate(cartId: string) {
        console.log('Cart ID', cartId);
        const orders = (await this.orderRepository_.find({
            where: { cart_id: cartId, status: Not(OrderStatus.ARCHIVED) },
            relations: ['cart.items.variant.product', 'store.owner'],
        })) as Order[];
        console.log(orders);
        // return orders;

        const products = [];

        orders.forEach((order) => {
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
        const uniqueCart = [];

        for (const item of products) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                uniqueCart.push(item);
            }
        }

        return uniqueCart;
    }

    async listCustomerOrders(
        customerId: string
    ): Promise<{ orders: any[]; uniqueCartIds: string[]; cartCount: number }> {
        const orders = await this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: Not(OrderStatus.ARCHIVED),
            },
            select: ['id', 'cart_id'], // Select id and cart_id
            relations: ['cart.items', 'cart', 'cart.items.variant.product'],
        });

        console.log(`Orders Line item? ${JSON.stringify(orders)}`);

        // Create a map to group orders by cart_id
        const groupedOrders = orders.reduce((acc, order) => {
            const cartId = order.cart_id;
            if (!acc[cartId]) {
                acc[cartId] = {
                    cart_id: cartId,
                    order_ids: new Set(),
                    items: {},
                };
            }

            acc[cartId].order_ids.add(order.id); // Add order ID to the set

            order.cart.items.forEach((item) => {
                const itemId = item.id;
                if (!acc[cartId].items[itemId]) {
                    acc[cartId].items[itemId] = {
                        ...item,
                        order_ids: new Set(),
                    };
                }

                acc[cartId].items[itemId].order_ids.add(order.id);
            });

            return acc;
        }, {});

        const result = Object.values(groupedOrders).map((group: any) => {
            return {
                cart_id: group.cart_id,
                order_ids: Array.from(group.order_ids), // Include order_ids in the result
                items: Object.values(group.items).map((item: any) => ({
                    ...item,
                    order_ids: Array.from(item.order_ids),
                })),
            };
        });

        const uniqueCartIds = Object.keys(groupedOrders);
        const cartCount = uniqueCartIds.length;

        return {
            orders: result,
            uniqueCartIds,
            cartCount,
        };
    }

    async orderDetails(cartId: string) {
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
}
