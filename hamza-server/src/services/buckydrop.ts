import {
    TransactionBaseService,
    ProductStatus,
    CartService,
    Cart,
    OrderStatus,
    FulfillmentStatus,
    CustomerService,
    PaymentStatus,
} from '@medusajs/medusa';
import ProductService from '../services/product';
import OrderService from '../services/order';
import { ExternalApiLogRepository } from '../repositories/external-api-log';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { PriceConverter } from '../utils/price-conversion';
import {
    BuckyClient,
    IBuckyShippingCostRequest,
    ICreateBuckyOrderProduct,
} from '../buckydrop/bucky-client';
import {
    CreateProductProductVariantInput,
    CreateProductInput as MedusaCreateProductInput,
    ProductOptionInput,
} from '@medusajs/medusa/dist/types/product';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { createLogger, ILogger } from '../utils/logging/logger';
import {
    IsNull,
    Not,
    FindManyOptions,
    FindOptionsWhere as TypeormFindOptionsWhere,
    In,
} from 'typeorm';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
    external_source: string;
    external_metadata?: Record<string, unknown>;
    bucky_metadata?: Record<string, unknown>;
};

const PRODUCT_EXTERNAL_SOURCE: string = 'buckydrop';

type FindOptionsWhere<Order> = TypeormFindOptionsWhere<Order> & {
    bucky_metadata?: any;
};

const SHIPPING_COST_MIN: number = parseInt(
    process.env.BUCKY_MIN_SHIPPING_COST_US_CENT ?? '1000'
);
const SHIPPING_COST_MAX: number = parseInt(
    process.env.BUCKY_MAX_SHIPPING_COST_US_CENT ?? '4000'
);

// TODO: I think this code needs comments its difficult to understand.

export default class BuckydropService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly productService_: ProductService;
    protected readonly cartService_: CartService;
    protected readonly customerService_: CustomerService;
    protected readonly orderService_: OrderService;
    protected readonly orderRepository_: typeof OrderRepository;
    protected readonly priceConverter: PriceConverter;
    protected readonly buckyClient: BuckyClient;
    protected readonly externalApiLogRepository: typeof ExternalApiLogRepository;
    public static readonly EXTERNAL_SOURCE: string = PRODUCT_EXTERNAL_SOURCE;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.cartService_ = container.cartService;
        this.orderRepository_ = container.orderRepository;
        this.orderService_ = container.orderService;
        this.customerService_ = container.customerService;
        this.logger = createLogger(container, 'BuckydropService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
        this.externalApiLogRepository = container.externalApiLogRepository;
        this.buckyClient = new BuckyClient(this.externalApiLogRepository);
    }

    async importProductsByKeyword(
        keyword: string,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannelId: string,
        count: number = 10,
        page: number = 1,
        goodsId: string = null
    ): Promise<Product[]> {
        //retrieve products from bucky and convert them
        const searchResults = await this.buckyClient.searchProducts(
            keyword,
            page,
            count
        );

        this.logger.debug(`search returned ${searchResults.length} results`);
        let productData = searchResults;

        if (goodsId)
            productData = productData.filter((p) => p.goodsId === goodsId);

        let productInputs: CreateProductInput[] = [];
        for (let p of productData) {
            productInputs.push(
                await this.mapBuckyDataToProductInput(
                    this.buckyClient,
                    p,
                    ProductStatus.PUBLISHED,
                    storeId,
                    categoryId,
                    collectionId,
                    [salesChannelId]
                )
            );
        }

        //filter out failures
        productInputs = productInputs.filter((p) => (p ? p : null));

        this.logger.debug(`importing ${productInputs.length} products...`);

        //import the products
        const output = productInputs?.length
            ? await this.productService_.bulkImportProducts(
                  storeId,
                  productInputs
              )
            : [];

        //TODO: best to return some type of report; what succeeded, what failed
        return output;
    }

    async importProductsByLink(
        goodsLink: string,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannelId: string
    ): Promise<Product[]> {
        //retrieve products from bucky and convert them
        const input: CreateProductInput = await this.mapBuckyDataToProductInput(
            this.buckyClient,
            { goodsLink },
            ProductStatus.PUBLISHED,
            storeId,
            categoryId,
            collectionId,
            [salesChannelId]
        );

        //import if mapped
        return input
            ? await this.productService_.bulkImportProducts(storeId, [input])
            : [];
    }

    async calculateShippingPriceForCart(cartId: string): Promise<number> {
        let output = 0;
        let currency = 'usdc';
        let gotPrice = false;

        try {
            //this subtotal is calculated to compare with the shipping cost
            let subtotal = 0;

            const cart: Cart = await this.cartService_.retrieve(cartId, {
                relations: [
                    'items.variant.product.store',
                    'items.variant.prices', //TODO: we need prices?
                    'customer',
                    'shipping_address.country',
                ],
            });

            if (!cart) throw new Error(`Cart with id ${cartId} not found`);

            if (!cart?.items?.length) {
                return 0;
            }

            //get customer if there is one
            if (!cart.customer) {
                if (cart.customer_id?.length) {
                    cart.customer = await this.customerService_.retrieve(
                        cart.customer_id
                    );
                }
            }

            //get currency from customer, or cart if there is no customer
            currency = cart.customer
                ? cart.customer.preferred_currency_id
                : (cart?.items[0]?.currency_code ?? 'usdc');

            /*
            //calculate prices
            const input: IBuckyShippingCostRequest = {
                lang: 'en',
                countryCode: cart.shipping_address.country_code,
                country: cart.shipping_address.country.name,
                provinceCode: cart.shipping_address.province,
                province: cart.shipping_address.province,
                detailAddress:
                    `${cart.shipping_address.address_1 ?? ''} ${cart.shipping_address.address_2 ?? ''}`.trim(),
                postCode: cart.shipping_address.postal_code,
                productList: [],
            };

            //generate input for each product in cart that is bucky
            for (let item of cart.items) {
                if (item.variant.bucky_metadata?.length) {
                    const variantMetadata: any = item.variant.bucky_metadata;
                    const productMetadata: any =
                        item.variant.product.bucky_metadata;
                    input.productList.push({
                        length: variantMetadata.length ?? 100,
                        width: variantMetadata.width ?? 100,
                        height: variantMetadata.height ?? 100,
                        weight: variantMetadata.weight ?? 100,
                        categoryCode: productMetadata.detail.categoryCode,
                    });

                    subtotal += item.unit_price * item.quantity;
                }
            }

            //if (subtotal > 0) {
            /*
            const estimate =
                await this.buckyClient.getShippingCostEstimate(input);

            //convert to usd first
            if (estimate?.data?.total) {
                output = await this.priceConverter.convertPrice(
                    estimate.data.total,
                    'cny',
                    'usdc'
                );
                gotPrice = true;
            }
            */

            output = SHIPPING_COST_MAX; // subtotal;
            output = output < SHIPPING_COST_MIN ? SHIPPING_COST_MIN : output;
            output = output > SHIPPING_COST_MAX ? SHIPPING_COST_MAX : output;

            //convert to final currency
            if (currency != 'usdc')
                output = await this.priceConverter.convertPrice(
                    output, //estimate.data.total,
                    'usdc',
                    currency
                );
            // }

            //if price was not yet converted, or nothing came back, do it now
            /*if (!gotPrice) {
                //this needs to be converted to USDC in order to compare
                if (output <= 0 && subtotal > 0) {
                    subtotal = await this.priceConverter.convertPrice(
                        subtotal,
                        currency,
                        'usdc'
                    );

                    //final calculated price should be
                    output = subtotal;
                    output =
                        output < SHIPPING_COST_MIN ? SHIPPING_COST_MIN : output;
                    output =
                        output > SHIPPING_COST_MAX ? SHIPPING_COST_MAX : output;
                }

                output = await this.priceConverter.convertPrice(
                    output,
                    'usdc',
                    currency
                );
            }
            */
        } catch (e) {
            this.logger.error(
                `Error calculating shipping costs in BuckydropService`,
                e
            );
            output = SHIPPING_COST_MIN;
        }

        return output;
    }

    async processPendingOrder(orderId: string): Promise<Order> {
        const order: Order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });

        if (order && order?.cart_id && order.bucky_metadata) {
            //get cart
            const cart: Cart = await this.cartService_.retrieve(order.cart_id, {
                relations: ['billing_address.country', 'customer'],
            });

            //get data to send to bucky
            const { variants, quantities } =
                await this.orderService_.getBuckyProductVariantsFromOrder(
                    order
                );

            //create list of products
            const productList: ICreateBuckyOrderProduct[] = [];
            for (let n = 0; n < variants.length; n++) {
                const prodMetadata: any = variants[n].product.bucky_metadata;
                const varMetadata: any = variants[n].bucky_metadata;

                productList.push({
                    spuCode: prodMetadata?.detail.spuCode,
                    skuCode: varMetadata.skuCode,
                    productCount: quantities[n],
                    platform: prodMetadata?.detail?.platform,
                    productPrice:
                        prodMetadata?.detail?.proPrice?.price ??
                        prodMetadata?.detail?.price?.price ??
                        0,
                    productName: prodMetadata?.detail?.goodsName,
                });
            }

            //create order via Bucky API
            this.logger.info(`Creating buckydrop order for ${orderId}`);
            const output: any = await this.buckyClient.createOrder({
                partnerOrderNo: order.id.replace('_', ''),
                //partnerOrderNoName: order.id, //TODO: what go here?
                country: cart.billing_address.country.name ?? '', //TODO: what format?
                countryCode: cart.billing_address.country.iso_2 ?? '', //TODO: what format?
                province: cart.billing_address.province ?? '',
                city: cart.billing_address.city ?? '',
                detailAddress:
                    `${cart.billing_address.address_1 ?? ''}{' '}${cart.billing_address.address_2 ?? ''}`.trim(),
                postCode: cart.billing_address.postal_code,
                contactName:
                    `${cart.billing_address.first_name ?? ''} ${cart.billing_address.last_name ?? ''}`.trim(),
                contactPhone: cart.billing_address.phone?.length
                    ? cart.billing_address.phone
                    : '0809997747',
                email: cart.email?.length ? cart.email : cart.customer.email,
                orderRemark: '',
                productList,
            });
            this.logger.info(`Created buckydrop order for ${orderId}`);

            //save the output
            order.bucky_metadata = output;

            order.status = output?.success
                ? OrderStatus.PENDING
                : OrderStatus.REQUIRES_ACTION;
            await this.orderRepository_.save(order);

            this.logger.info(`Saved order ${orderId}`);
        } else {
            this.logger.warn(
                `Allegedly pending bucky drop order ${orderId} is either not found, has no cart, or has no buckydrop metadata`
            );
        }

        return order;
    }

    async reconcileOrderStatus(orderId: string): Promise<Order> {
        try {
            //get order & metadata
            let order: Order = await this.orderService_.retrieve(orderId);
            const buckyData: any = order.bucky_metadata;

            if (
                order &&
                (buckyData?.data?.shopOrderNo || buckyData?.shopOrderNo)
            ) {
                //get order details from buckydrop
                const orderDetail = await this.buckyClient.getOrderDetails(
                    buckyData.data.shopOrderNo ?? buckyData.shopOrderNo
                );

                //get the order status
                if (orderDetail) {
                    const status =
                        orderDetail?.data?.poOrderList[0]?.orderStatus;

                    //save the tracking data
                    buckyData.tracking = orderDetail;
                    order.bucky_metadata = buckyData;

                    if (status) {
                        //translate the status
                        switch (parseInt(status)) {
                            case 0:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.NOT_FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 1:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.NOT_FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 2:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.NOT_FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 3:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.NOT_FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 4:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.NOT_FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 5:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.NOT_FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 6:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.SHIPPED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 7:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.SHIPPED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 8:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.CANCELED,
                                    FulfillmentStatus.CANCELED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 9:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.SHIPPED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 10:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.SHIPPED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 11:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.PENDING,
                                    FulfillmentStatus.SHIPPED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                            case 10:
                                order = await this.orderService_.setOrderStatus(
                                    order,
                                    OrderStatus.COMPLETED,
                                    FulfillmentStatus.FULFILLED,
                                    null,
                                    null,
                                    orderDetail
                                );
                                break;
                        }
                    }
                }
            }

            return order;
        } catch (e: any) {
            this.logger.error(
                `Error reconciling order status for order ${orderId}`,
                e
            );
        }
    }

    async cancelOrder(orderId: string): Promise<Order> {
        try {
            const order: Order = await this.orderService_.retrieve(orderId);
            const buckyData: any = order.bucky_metadata;
            let cancelOutput: any = null;

            if (order && buckyData) {
                //get order details from buckydrop
                const shopOrderNo: string =
                    buckyData.data.shopOrderNo ?? buckyData.shopOrderNo;
                let purchaseCode =
                    buckyData?.tracking?.data?.poOrderList.orderCode;

                if (shopOrderNo) {
                    //get PO number from order details
                    const orderDetail =
                        await this.buckyClient.getOrderDetails(shopOrderNo);
                    purchaseCode = orderDetail?.data?.poOrderList.orderCode;
                    if (orderDetail) buckyData.tracking = orderDetail;
                    let canceled: boolean = false;

                    //first try cancelling purchase order
                    if (purchaseCode) {
                        cancelOutput =
                            await this.buckyClient.cancelPurchaseOrder(
                                purchaseCode
                            );
                        canceled = cancelOutput?.success === 'true';
                    }

                    //if not canceled yet, try to cancel the shop order
                    if (!canceled) {
                        if (shopOrderNo) {
                            cancelOutput =
                                await this.buckyClient.cancelShopOrder(
                                    shopOrderNo
                                );
                            canceled = cancelOutput?.success === 'true';
                        }
                    }

                    if (cancelOutput) {
                        //save the tracking data
                        order.bucky_metadata = buckyData;
                        buckyData.cancel = cancelOutput;

                        //save the order
                        await this.orderRepository_.save(order);
                    } else {
                        this.logger.warn(
                            `Order ${orderId}: no Buckydrop cancellation was performed`
                        );
                    }
                } else {
                    this.logger.warn(
                        `Order ${orderId} has no BD shop order number`
                    );
                }
            } else {
                if (!order) this.logger.warn(`Order ${orderId} not found.`);
                else
                    this.logger.warn(
                        `Order ${orderId} is not a Buckydrop order (or has no BD metadata)`
                    );
            }

            return order;
        } catch (e) {
            this.logger.error(`Error cancelling order ${orderId}`, e);
        }
    }

    async getOrdersToVerify(): Promise<Order[]> {
        const where: FindOptionsWhere<Order> = {
            bucky_metadata: Not(IsNull()),
            status: OrderStatus.PENDING,

            payment_status: PaymentStatus.AWAITING,
            fulfillment_status: FulfillmentStatus.NOT_FULFILLED,
        };

        let orders: Order[] = await this.orderRepository_.find({
            where: where,
        });

        orders =
            orders?.filter((o) => {
                const tzOffset = o.updated_at.getTimezoneOffset();
                console.log('timezone offset', tzOffset);
                const localDate = new Date(
                    o.updated_at.getTime() - tzOffset * 60000
                );

                //order must be at least two hours old
                return (
                    Math.floor(localDate.getTime() / 1000) <
                    Math.floor(Date.now() / 1000) -
                        60 *
                            parseInt(
                                process.env
                                    .VERIFY_ORDER_PAYMENT_DELAY_MINUTES ?? '120'
                            )
                );
            }) ?? [];

        orders =
            orders?.filter((o) => o.bucky_metadata?.status === 'pending') ?? [];

        return orders;
    }

    async getOrdersToProcess(): Promise<Order[]> {
        const options: FindManyOptions<Order> = {
            where: {
                status: OrderStatus.PENDING,
                payment_status: PaymentStatus.CAPTURED,
                fulfillment_status: FulfillmentStatus.NOT_FULFILLED,
                bucky_metadata: Not(IsNull()),
            },
        };
        const orders: Order[] = await this.orderRepository_.find(options);
        return (
            orders?.filter((o) => o.bucky_metadata?.status === 'pending') ?? []
        );
    }

    async getOrdersToTrack(): Promise<Order[]> {
        const options: FindManyOptions<Order> = {
            where: {
                status: OrderStatus.PENDING,
                payment_status: PaymentStatus.CAPTURED,
                fulfillment_status: Not(
                    In([FulfillmentStatus.CANCELED, FulfillmentStatus.RETURNED])
                ),
                bucky_metadata: Not(IsNull()),
            },
        };
        const orders: Order[] = await this.orderRepository_.find(options);
        return (
            orders?.filter((o) => o.bucky_metadata?.status !== 'pending') ?? []
        );
    }

    private async mapBuckyDataToProductInput(
        buckyClient: BuckyClient,
        item: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[]
    ): Promise<CreateProductInput> {
        try {
            const productDetails = await buckyClient.getProductDetails(
                item.goodsLink
            );

            /*
            const productDetails = {
                success: true,
                data: {
                    goodsId: '727750291125',
                    spuCode: '727750291125',
                    goodsName: 'Student dormitory toothbrushing cup, mouthwash cup, residential school toiletries set, electric toothbrush, tooth utensil, tooth cylinder shelf',
                    goodsLink: 'https://item.taobao.com/item.htm?id=727750291125',
                    shop: { shopId: '117163621', shopName: 'Royal Combine Family Store' },
                    price: { priceCent: 4180, price: 41.8 },
                    proPrice: { priceCent: 2090, price: 20.9 },
                    freight: { priceCent: 0, price: 0 },
                    picUrl: 'https://img.alicdn.com/bao/uploaded/i2/2455411701/O1CN01yHeQkI1OR6gOJtPAu_!!0-item_pic.jpg',
                    platform: 'TB',
                    categoryCode: '121404022',
                    goodsCatName: 'Washing cup',
                    mainItemImgs: [
                        'https://img.alicdn.com/bao/uploaded/i2/2455411701/O1CN01yHeQkI1OR6gOJtPAu_!!0-item_pic.jpg',
                        'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01OqhGTC1OR6gdwdpTJ_!!2455411701.jpg',
                        'https://img.alicdn.com/bao/uploaded/i3/2455411701/O1CN01ej8a8F1OR6gPK6Qi5_!!2455411701.jpg',
                        'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01Ql8rsp1OR6giTpjeG_!!2455411701.jpg',
                        'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01nyX5Vj1OR6ggHEF6w_!!2455411701.jpg'
                    ],
                    productProps: [
                        {
                            propId: 1627207,
                            valueId: 25792702667,
                            propName: 'Color',
                            valueName: 'Round ❤ Upgrade with Handle - Ocean Blue [Loadable Electric Toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 25792702668,
                            propName: 'Color',
                            valueName: 'Round ❤ Upgrade with Handle - Simple White [Can Put Electric Toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 25792702669,
                            propName: 'Color',
                            valueName: 'Round ❤ Upgrade with Handle - Cute Pink [Can Put Electric Toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149914,
                            propName: 'Color',
                            valueName: 'Round ❤ upgrade with handle - blue water blue [can put electric toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149915,
                            propName: 'Color',
                            valueName: 'Entering 2 - round with handle [blue water + ocean blue]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149916,
                            propName: 'Color',
                            valueName: 'Entering two - round with handle [blue water + cherry tree pink]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149917,
                            propName: 'Color',
                            valueName: 'Entering 3 - round with handle [blue water blue + ocean blue + cherry tree pink]'
                        }
                    ],
                    skuList: [
                        {
                            props: [
                                {
                                    propId: 1627207,
                                    valueId: 25792702667,
                                    propName: 'Color',
                                    valueName: 'Round ❤ Upgrade with Handle - Ocean Blue [Loadable Electric Toothbrush]'
                                }
                            ],
                            skuCode: '5220066635288',
                            price: { priceCent: 2190, price: 21.9 },
                            quantity: 200,
                            imgUrl: 'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01QRZ7qo1OR6Ywp7vVt_!!2455411701.jpg'
                        }, {
                            props: [
                                {
                                    propId: 1627207,
                                    valueId: 25792702668,
                                    propName: 'Color',
                                    valueName: 'Round ❤ Upgrade with Handle - Simple White [Can Put Electric Toothbrush]'
                                }
                            ],
                            skuCode: '5220066635289',
                            price: { priceCent: 2190, price: 21.9 },
                            quantity: 200,
                            imgUrl: 'https://img.alicdn.com/bao/uploaded/i3/2455411701/O1CN010QTYC51OR6Z6xNjEc_!!2455411701.jpg'
                        }

                    ],
                    repositoryInfo: { quantity: '6800', quantityText: '库存6800件' },
                    beginCount: 0,
                    guaranteeFlag: 0,
                    goodsDetailHtml: '<p><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01PTqAZx1OR6YyPE1Vk_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i2/2455411701/O1CN01FF2vdK1OR6YyqmTLG_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01OqhGTC1OR6gdwdpTJ_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i3/2455411701/O1CN01puks6H1OR6ZaS2N54_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01nyX5Vj1OR6ggHEF6w_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01Ql8rsp1OR6giTpjeG_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01YMgJcK1OR6Yz4jAjM_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i2/2455411701/O1CN01ReNlS71OR6Z0NTaXg_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01bR43Qw1OR6Z06we8X_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01EEe66i1OR6Z3gyR1Q_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i3/2455411701/O1CN01jw1nQd1OR6Ywom6jZ_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01couYQR1OR6Yz4jhzj_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01ctjZc41OR6Z1TfRzp_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01wilFHc1OR6Z8eU4G5_!!2455411701.jpg"></p>',
                    soldOutTag: 1,
                    isSupplier: 0,
                    popularity: 4
                },
                errKey: '',
                code: 0,
                info: 'Success',
                currentTime: 1726058167982
            };*/

            if (!productDetails)
                throw new Error(
                    `No product details were retrieved for product ${item.spuCode}`
                );

            const metadata = item;
            metadata.detail = productDetails.data;
            const spuCode = item?.spuCode ?? productDetails?.data?.spuCode;

            if (!spuCode?.length) throw new Error('SPU code not found');

            const optionNames =
                this.getUniqueProductOptionNames(productDetails);
            const tagName = productDetails.data.goodsCatName;
            const variants = await this.mapVariants(
                productDetails,
                optionNames
            );

            //add variant images to the main product images
            const images = productDetails?.data?.mainItemImgs ?? [];
            for (const v of variants) {
                if (
                    v.metadata?.imgUrl &&
                    !images.find((i) => i === v.metadata.imgUrl)
                )
                    images.push(v.metadata.imgUrl);
            }

            const output = {
                title: item?.goodsName ?? productDetails?.data?.goodsName,
                subtitle: item?.goodsName ?? productDetails?.data?.goodsName, //TODO: find a better value
                handle: spuCode,
                description: productDetails?.data?.goodsDetailHtml ?? '',
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail:
                    item?.picUrl ?? productDetails?.data?.mainItemImgs[0],
                images,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_id: spuCode,
                categories: categoryId?.length ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                tags: tagName?.length ? [{ id: tagName, value: tagName }] : [],
                bucky_metadata: metadata,
                external_metadata: metadata,
                options: optionNames.map((o) => {
                    return { title: o };
                }),
                variants,
            };

            if (!output.variants?.length)
                throw new Error(
                    `No variants were detected for product ${spuCode}`
                );

            return output;
        } catch (error) {
            this.logger.error(
                'Error mapping Bucky data to product input',
                error
            );
            return null;
        }
    }

    private async mapVariants(
        productDetails: any,
        optionNames: string[]
    ): Promise<CreateProductProductVariantInput[]> {
        const variants = [];

        const getVariantDescriptionText = (data: any) => {
            let output: string = '';
            if (data.props) {
                for (let prop of data.props) {
                    output += prop.valueName + ' ';
                }
                output = output.trim();
            } else {
                output = productDetails.data.goodsName;
            }
            return output;
        };

        if (!productDetails.data.skuList?.length) {
            this.logger.warn('EMPTY SKU LIST');
        }

        for (const variant of productDetails.data.skuList) {
            //get price
            const baseAmount = variant.proPrice
                ? variant.proPrice.priceCent
                : variant.price.priceCent;

            //TODO: get from someplace global
            const currencies = ['eth', 'usdc', 'usdt'];
            const prices = [];
            for (const currency of currencies) {
                prices.push({
                    currency_code: currency,
                    amount: await this.priceConverter.getPrice({
                        baseAmount,
                        baseCurrency: 'cny',
                        toCurrency: currency,
                    }),
                });
            }

            //get option names/values
            const options = [];
            if (variant.props) {
                for (const opt of optionNames) {
                    options.push({
                        value:
                            variant.props.find((o) => o.propName === opt)
                                ?.valueName ?? '',
                    });
                }
            }

            variants.push({
                title: getVariantDescriptionText(variant),
                inventory_quantity: variant.quantity,
                allow_backorder: false,
                manage_inventory: true,
                bucky_metadata: variant,
                external_metadata: variant,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                metadata: { imgUrl: variant.imgUrl },
                prices,
                options: options,
            });
        }

        return variants;
    }

    private getUniqueProductOptionNames(productDetails: any): string[] {
        const output: string[] = [];

        for (const variant of productDetails.data.skuList) {
            for (const prop of variant.props) {
                if (!output.find((p) => p === prop.propName)) {
                    output.push(prop.propName);
                }
            }
        }

        return output;
    }
}
