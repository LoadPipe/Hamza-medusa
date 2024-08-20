import {
    TransactionBaseService,
    Logger,
    ProductStatus,
    CartService,
    Cart,
    LineItem,
    OrderStatus,
    FulfillmentStatus
} from '@medusajs/medusa';
import ProductService from '../services/product';
import OrderService from '../services/order';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { PriceConverter } from '../strategies/price-selection';
import { BuckyClient, IBuckyShippingCostRequest } from '../buckydrop/bucky-client';
import { CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';
import { UpdateProductInput as MedusaUpdateProductInput } from '@medusajs/medusa/dist/types/product';

type CreateProductInput = MedusaCreateProductInput & { store_id: string, bucky_metadata?: string };
//type UpdateProductInput = MedusaUpdateProductInput & { store_id: string, bucky_metadata?: string };

export default class BuckydropService extends TransactionBaseService {
    protected readonly logger: Logger;
    protected readonly productService_: ProductService;
    protected readonly cartService_: CartService;
    protected readonly orderService_: OrderService;
    protected readonly priceConverter: PriceConverter;
    protected readonly buckyClient: BuckyClient;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.cartService_ = container.cartService;
        this.logger = container.logger;
        this.priceConverter = new PriceConverter();
        this.buckyClient = new BuckyClient();
    }

    async importProductsByKeyword(
        keyword: string,
        storeId: string,
        collectionId: string,
        salesChannelId: string
    ): Promise<Product[]> {
        //retrieve products from bucky and convert them
        const buckyClient: BuckyClient = new BuckyClient();
        const searchResults = await buckyClient.searchProducts(
            keyword,
            1,
            3
        );
        this.logger.debug(`search returned ${searchResults.length} results`);
        const productData = searchResults; //[searchResults[4], searchResults[5]];

        //doing it this way incurs the wrath of the API rate limit
        /*
        let products: CreateProductInput[] = await Promise.all(
            productData.map((p) =>
                this.mapBuckyDataToProductInput(
                    buckyClient,
                    p,
                    ProductStatus.PUBLISHED,
                    storeId,
                    collectionId,
                    [salesChannelId]
                )
            )
        );
        */

        let productInputs: CreateProductInput[] = [];
        for (let p of productData) {
            productInputs.push(await
                this.mapBuckyDataToProductInput(
                    buckyClient,
                    p,
                    ProductStatus.PUBLISHED,
                    storeId,
                    collectionId,
                    [salesChannelId]
                )
            );
        }


        //filter out failures
        productInputs = productInputs.filter(p => p ? p : null);

        //import the products
        const output = productInputs?.length
            ? await this.productService_.bulkImportProducts(storeId, productInputs)
            : [];

        //TODO: best to return some type of report; what succeeded, what failed
        return output;
    }

    async calculateShippingPriceForCart(cartId: string): Promise<number> {
        const cart: Cart = await this.cartService_.retrieve(cartId, {
            relations: [
                'items.variant.product.store',
                'items.variant.prices', //TODO: we need prices?
                'customer'
            ],
        });

        //calculate prices
        const input: IBuckyShippingCostRequest = {
            lang: 'en',
            countryCode: cart.shipping_address.country_code,
            country: cart.shipping_address.country.name,
            provinceCode: cart.shipping_address.province,
            province: cart.shipping_address.province,
            detailAddress: `${cart.shipping_address.address_1 ?? ''} ${cart.shipping_address.address_2 ?? ''}`.trim(),
            postCode: cart.shipping_address.postal_code,
            productList: []
        };

        for (let item of cart.items) {
            if (item.variant.bucky_metadata?.length) {
                const variantMetadata = JSON.parse(item.variant.bucky_metadata);
                const productMetadata = JSON.parse(item.variant.product.bucky_metadata);
                input.productList.push({
                    length: variantMetadata.length,
                    width: variantMetadata.width,
                    height: variantMetadata.height,
                    weight: variantMetadata.weight,
                    categoryCode: productMetadata.detail.categoryCode
                });
            }
        }

        return 0;
    }

    async calculateShippingPriceForProduct(cart: Cart, product: Product): Promise<number> {
        return 0;
    }

    async reconcileOrderStatus(orderId: string): Promise<void> {
        try {
            //get order & metadata
            const order: Order = await this.orderService_.retrieve(orderId);
            const buckyData = order.bucky_metadata?.length ? JSON.parse(order.bucky_metadata) : null;

            if (order && buckyData) {

                //get order details from buckydrop
                const orderDetail = await this.buckyClient.getOrderDetails(
                    buckyData.data.shopOrderNo ?? buckyData.shopOrderNo
                );

                //get the order status
                if (orderDetail) {
                    const status = orderDetail.orderDetails?.data?.poOrderList[0]?.orderStatus;
                    if (status) {

                        //translate the status 
                        switch (parseInt(status)) {
                            case 0:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 1:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 2:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 3:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 4:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 5:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 6:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                                break;
                            case 7:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.SHIPPED;
                                break;
                            case 8:
                                order.status = OrderStatus.CANCELED;
                                order.fulfillment_status = FulfillmentStatus.CANCELED;
                                break;
                            case 9:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.SHIPPED;
                                break;
                            case 10:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.SHIPPED;
                                break;
                            case 11:
                                order.status = OrderStatus.PENDING;
                                order.fulfillment_status = FulfillmentStatus.SHIPPED;
                                break;
                            case 10:
                                order.status = OrderStatus.COMPLETED;
                                order.fulfillment_status = FulfillmentStatus.FULFILLED;
                                break;
                        }
                    }
                }
            }
        }
        catch (e: any) {
            this.logger.error(`Error reconciling order status for order ${orderId}`, e);
        }
    }

    private async mapVariants(item: any, productDetails: any) {
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
            }
            else {
                output = productDetails.data.goodsName;
            }
            return output;
        }

        for (const variant of productDetails.data.skuList) {
            console.log(JSON.stringify(variant));
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
            console.log('productDetails:');
            console.log(productDetails);

            const metadata = item;
            metadata.detail = productDetails.data;

            return {
                title: item.goodsName,
                subtitle: item.goodsName, //TODO: find a better value
                handle: item.spuCode,
                description: productDetails.data.goodsDetailHtml,
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail: item.picUrl,
                images: productDetails.data.mainItemImgs,
                collection_id: collectionId,
                weight: Math.round(item.weight || 100),
                discountable: true,
                store_id: storeId,
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                bucky_metadata: JSON.stringify(metadata),
                variants: await this.mapVariants(item, productDetails),
            };
        } catch (error) {
            this.logger.error(
                'Error mapping Bucky data to product input',
                error
            );
            return null;
        }
    }
}
