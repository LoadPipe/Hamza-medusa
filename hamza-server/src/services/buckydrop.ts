import {
    TransactionBaseService,
    ProductStatus,
    CartService,
    Cart,
    OrderStatus,
    FulfillmentStatus,
    CustomerService
} from '@medusajs/medusa';
import ProductService from '../services/product';
import OrderService from '../services/order';
import { BuckyLogRepository } from '../repositories/bucky-log';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { PriceConverter } from '../strategies/price-selection';
import {
    BuckyClient,
    IBuckyShippingCostRequest,
    ICreateBuckyOrderProduct,
} from '../buckydrop/bucky-client';
import { CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { createLogger, ILogger } from '../utils/logging/logger';
import { IsNull, Not, FindManyOptions } from 'typeorm';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
    bucky_metadata?: Record<string, unknown>;
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
    protected readonly buckyLogRepository: typeof BuckyLogRepository;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.cartService_ = container.cartService;
        this.orderRepository_ = container.orderRepository;
        this.orderService_ = container.orderService;
        this.customerService_ = container.customerService;
        this.logger = createLogger(container, 'BuckydropService');
        this.priceConverter = new PriceConverter(this.logger);
        this.buckyLogRepository = container.buckyLogRepository;
        this.buckyClient = new BuckyClient(this.buckyLogRepository);
    }

    async importProductsByKeyword(
        keyword: string,
        storeId: string,
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
        collectionId: string,
        salesChannelId: string
    ): Promise<Product[]> {
        //retrieve products from bucky and convert them
        const input: CreateProductInput = await this.mapBuckyDataToProductInput(
            this.buckyClient,
            { goodsLink },
            ProductStatus.PUBLISHED,
            storeId,
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

            if (!cart.customer) {
                cart.customer = await this.customerService_.retrieve(
                    cart.customer_id
                );
            }

            currency = cart.customer.preferred_currency_id;

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

            if (subtotal > 0) {
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

                output = subtotal;
                output =
                    output < SHIPPING_COST_MIN ? SHIPPING_COST_MIN : output;
                output =
                    output > SHIPPING_COST_MAX ? SHIPPING_COST_MAX : output;

                //convert to final currency
                if (currency != 'usdc')
                    output = await this.priceConverter.convertPrice(
                        estimate.data.total,
                        'usdc',
                        currency
                    );
            }

            //if price was not yet converted, or nothing came back, do it now
            if (!gotPrice) {
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
        } catch (e) {
            this.logger.error(
                `Error calculating shipping costs in BuckydropService`,
                e
            );
            output = SHIPPING_COST_MIN;
        }

        return output;
    }

    async calculateShippingPriceForProduct(
        cart: Cart,
        product: Product
    ): Promise<number> {
        return 0;
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
                    `${cart.billing_address.address_1 ?? ''} ${cart.billing_address.address_2 ?? ''}`.trim(),
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
            const order: Order = await this.orderService_.retrieve(orderId);
            const buckyData: any = order.bucky_metadata;

            if (order && buckyData) {
                //get order details from buckydrop
                const orderDetail = await this.buckyClient.getOrderDetails(
                    buckyData.data.shopOrderNo ?? buckyData.shopOrderNo
                );

                //get the order status
                if (orderDetail) {
                    const status =
                        orderDetail?.data?.poOrderList[0]?.orderStatus;
                    if (status) {
                        //translate the status
                        switch (parseInt(status)) {
                            case 0:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 1:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 2:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 3:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 4:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 5:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 6:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.SHIPPED;
                                break;
                            case 7:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.SHIPPED;
                                break;
                            case 8:
                                order.status = OrderStatus.CANCELED;
                                order.fulfillment_status =
                                    FulfillmentStatus.CANCELED;
                                break;
                            case 9:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.SHIPPED;
                                break;
                            case 10:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.SHIPPED;
                                break;
                            case 11:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status =
                                    FulfillmentStatus.SHIPPED;
                                break;
                            case 10:
                                order.status = OrderStatus.COMPLETED;
                                order.fulfillment_status =
                                    FulfillmentStatus.FULFILLED;
                                break;
                        }
                    }

                    //save the tracking data
                    buckyData.tracking = orderDetail;
                    order.bucky_metadata = buckyData;

                    //save the order
                    await this.orderRepository_.save(order);
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

    async getPendingOrders(): Promise<Order[]> {
        const options: FindManyOptions<Order> = {
            where: {
                status: OrderStatus.PENDING,
                bucky_metadata: Not(IsNull()),
            },
        };
        const orders: Order[] = await this.orderRepository_.find(options);
        return (
            orders?.filter((o) => o.bucky_metadata?.status === 'pending') ?? []
        );
    }

    private async mapVariants(productDetails: any) {
        /*
        0: {
            "props": [{
                "propId": 3216,
                "valueId": 2351853,
                "propName": "Color",
                "valueName": "1 orange"
            }, {
                "propId": 3151,
                "valueId": 891417773,
                "propName": "model",
                "valueName": "Candy color lacquer open ring ring diameter * wire diameter 8*1.2mm"
            }],
            "skuCode": "5141273114409",
            "price": {
                "priceCent": 2,
                "price": 0.02
            },
            "proPrice": {
                "priceCent": 2,
                "price": 0.02
            },
            "quantity": 92099,
            "imgUrl": "https://cbu01.alicdn.com/img/ibank/O1CN01PcdXOw1guZ5g0nIj9_!!2208216064202-0-cib.jpg"
        }

        1: {
        "props":[{
            "propId":3216,"valueId":47921170,
            "propName":"Color","valueName":"2 Sapphire Blue"
        },
        {
            "propId":3151,"valueId":891417773,
            "propName":"model","valueName":"Candy color lacquer open ring ring diameter * wire diameter 8*1.2mm"
        }],
        "skuCode":"5141273114410",
        "price":{"priceCent":2,"price":0.02},
        "proPrice":{"priceCent":2,"price":0.02},
        "quantity":98499,
        "imgUrl":"https://cbu01.alicdn.com/img/ibank/O1CN010yQbq61guZ5ZOyzKw_!!2208216064202-0-cib.jpg"}
        */
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
            console.log('EMPTY SKU LIST');
        }

        for (const variant of productDetails.data.skuList) {
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

            variants.push({
                title: getVariantDescriptionText(variant),
                inventory_quantity: variant.quantity,
                allow_backorder: false,
                manage_inventory: true,
                bucky_metadata: JSON.stringify({ skuCode: variant.skuCode }),
                prices,
            });
        }

        return variants;
    }

    private async mapBuckyDataToProductInput(
        buckyClient: BuckyClient,
        item: any,
        status: ProductStatus,
        storeId: string,
        collectionId: string,
        salesChannels: string[]
    ): Promise<CreateProductInput> {
        try {
            const productDetails = await buckyClient.getProductDetails(
                item.goodsLink
            );

            if (!productDetails)
                throw new Error(
                    `No product details were retrieved for product ${item.spuCode}`
                );

            const metadata = item;
            metadata.detail = productDetails.data;
            const spuCode = item?.spuCode ?? productDetails?.data?.spuCode;

            if (!spuCode?.length) throw new Error('SPU code not found');

            const output = {
                title: item?.goodsName ?? productDetails?.data?.goodsName,
                subtitle: item?.goodsName ?? productDetails?.data?.goodsName, //TODO: find a better value
                handle: spuCode,
                description: productDetails?.data?.goodsDetailHtml ?? '',
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail:
                    item?.picUrl ?? productDetails?.data?.mainItemImgs[0],
                images: productDetails?.data?.mainItemImgs,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                bucky_metadata: metadata,
                variants: await this.mapVariants(productDetails),
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
}
