import {
    TransactionBaseService,
    ProductStatus,
    ProductVariant,
} from '@medusajs/medusa';
import ProductService from '../services/product';
import OrderService from '../services/order';
import { Product } from '../models/product';
import { PriceConverter } from '../utils/price-conversion';
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
import { GlobetopperClient } from '../globetopper/globetopper-client';

const PRODUCT_EXTERNAL_SOURCE: string = 'globetopper';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
    external_source: string;
    external_metadata?: Record<string, unknown>;
};

// TODO: I think this code needs comments its difficult to understand.

export default class GlobetopperService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly productService_: ProductService;
    protected readonly orderRepository_: typeof OrderRepository;
    protected readonly priceConverter: PriceConverter;
    protected readonly apiClient: GlobetopperClient;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.orderRepository_ = container.orderRepository;
        this.logger = createLogger(container, 'GlobetopperService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
        this.apiClient = new GlobetopperClient();
    }

    public async import(
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannelId: string
    ): Promise<Product[]> {
        try {
            //get products in two API calls
            const gtProducts = await this.apiClient.searchProducts();
            const gtCatalogue = await this.apiClient.getCatalog();

            const productInputs: (CreateProductInput & { store_id: string })[] =
                [];

            //sort the output
            const gtRecords = gtProducts.data.records.sort(
                (a, b) => (a?.operator?.id ?? 0) < (b?.operator?.id ?? 0)
            );
            const gtCat = gtCatalogue.data.records.sort(
                (a, b) =>
                    (a?.topup_product_id ?? 0) < (b?.topup_product_id ?? 0)
            );

            //create product inputs for each product
            for (let record of gtRecords) {
                const productDetails = gtCat.find(
                    (r) => r.topup_product_id == (record?.operator?.id ?? 0)
                );

                if (productDetails) {
                    productInputs.push(
                        await this.mapDataToProductInput(
                            record,
                            productDetails,
                            ProductStatus.PUBLISHED,
                            storeId,
                            categoryId,
                            collectionId,
                            [salesChannelId]
                        )
                    );
                }
            }

            this.logger.debug(`importing ${productInputs.length} products`);

            //insert products into DB
            const products = await this.productService_.bulkImportProducts(
                storeId,
                productInputs
            );

            return products;
        } catch (e: any) {
            this.logger.error('Error importing GlobeTopper products', e);
        }

        return [];
    }

    public async processPointOfSale(
        orderId: string,
        firstName: string,
        lastName: string,
        email: string,
        variants: ProductVariant[],
        quantities: number[]
    ): Promise<void> {
        const promises: Promise<any>[] = [];

        //make a list of promises
        for (let n = 0; n < variants.length; n++) {
            const quantity = quantities[n] ?? 1;
            const variant = variants[n];

            //account for quantity of each
            for (let i = 0; i < quantity; i++) {
                /*
                There is a decision to be made here: if there are 3 $5 XYZ cards, 
                should we make it just 1 $15 one? I'm going to go with a no for now, 
                but we can come back to this. 
                (If they truly are gifts, buyer might intend 3 different ones for 3 different people)

                We could get more granular but then we'd specialize in gift cards. Maybe better to see 
                how well they sell first
                */
                promises.push(
                    this.apiClient.purchase({
                        productID: variant.product.external_id,
                        amount: variant.external_metadata?.amount as number,
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        order_id: orderId,
                    })
                );
            }
        }

        //here you have an array of outputs, 1 for each variant
        const purchaseOutputs = await Promise.all(promises);

        //TODO: what to do with the outputs now?
    }

    private async mapDataToProductInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[]
    ): Promise<CreateProductInput> {
        try {
            /*
        {
            "name": "Airbnb AU",
            "description": null,
            "notes": null,
            "display": [
                "100.00"
            ],
            "user_display": "100.00",
            "operator": {
                "id": 3046,
                "name": "Airbnb AU",
                "sku": null,
                "phone": "1xxxxxxxxxx",
                "metadata": [],
                "country": {
                "iso2": "AU",
                "iso3": "AUS",
                "name": "Australia",
                "dial_code": "+61-x-xxxx-xxxx",
                "currency": {
                    "code": "AUD",
                    "name": "Australian Dollar"
                }
                }
            },
            "min": "100.00",
            "max": "100.00",
            "increment": "0.00",
            "is_a_range": false,
            "locval": [67.39],
            "type": {
                "id": 2,
                "name": "Pin"
            },
            "category": {
                "id": 6,
                "name": "Gift Card",
                "description": "Digital Gift Cards"
            },
            "discount": [
                {
                "id": 22983,
                "display": "100.00",
                "discount": 0
                },
                {
                "id": "*",
                "display": "*",
                "discount": "1.95000"
                }
            ],
            "fees": [],
            "request_attributes": [
                {
                "name": "amount",
                "label": "Amount",
                "description": null,
                "required": true
                },
                {
                "name": "email",
                "label": "Email Address",
                "description": null,
                "required": true
                },
                {
                "name": "first_name",
                "label": "First Name",
                "description": null,
                "required": true
                },
                {
                "name": "last_name",
                "label": "Last Name",
                "description": null,
                "required": true
                },
                {
                "name": "notif_email",
                "label": "Notification Email",
                "description": "The email address to which a notification should be sent.",
                "required": false
                },
                {
                "name": "notif_tele",
                "label": "Notification SMS",
                "description": "The telephone number to which a notification should be sent.",
                "required": false
                },
                {
                "name": "order_id",
                "label": "Order ID",
                "description": null,
                "required": true
                },
                {
                "name": "quantity",
                "label": "Quantity",
                "description": null,
                "required": true
                }
            ],
            "additional_details": [
                {
                "id": 22983,
                "value": "100.00",
                "meta_data": []
                }
            ],
            "delivered_value": "100.000"
        };
      
      
      CATALOG: 
      {
        "id": 21,
        "topup_product_id": 1426,
        "status": "Published",
        "brand": "Amazon UAE",
        "reward_format": "Code",
        "reward_example": null,
        "card_image": "https://crm.globetopper.com/brandImages/60ede95dd5a4f.jpg",
        "usage": "Online",
        "expiration": "10 years from the date of issue",
        "brand_description": "Amazon Gift Card is the perfect way to give your loved ones exactly what they're hoping for, even if you don't know what it is. Recipients can choose from millions of items storewide. Amazon Gift Card stored value never expires, so they can buy something immediately or wait for that sale of a lifetime.\n\nAmazon Gift Card United Arab Emirates can ONLY be used on www.amazon.ae",
        "redemption_instruction": "Login into your Amazon Account.\nClick \"Apply a Gift Card to Your Account\".\nEnter your claim code and click \"Apply to Your Account\".",
        "brand_disclaimer": null,
        "term_and_conditions": "https://www.amazon.ae/gp/help/customer/display.html?nodeId=201936990",
        "restriction_and_policies": null,
        "brand_additional_information": null,
        "dashboard_display": true,
        "currency": "Arab Emirates Dirham",
        "country": "United Arab Emirates",
        "iso2": "AE",
        "iso3": "ARE",
        "value_type": "Variable",
        "denomination": "50.00 - 1,000.00 by 0.00"
        }
      */

            //const metadata = item;
            //metadata.detail = productDetails.data;
            const externalId = item?.operator?.id;

            if (!externalId) throw new Error('SPU code not found');

            const optionNames = this.getUniqueProductOptionNames(item);
            const variants = await this.mapVariants(
                item,
                productDetail,
                optionNames
            );

            //add variant images to the main product images
            const images = []; //TODO: get images

            const output = {
                title: item?.name,
                subtitle: productDetail.brand_description, //TODO: find a better value
                handle: externalId, //TODO: create a better handle
                description: `${productDetail.brand_description} <br/>${productDetail.redemption_instruction}`, //TODO: make better description
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail: item?.picUrl ?? productDetail?.card_image,
                images,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                external_id: externalId,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_metadata: productDetail,
                categories: categoryId?.length ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                options: optionNames.map((o) => {
                    return { title: o };
                }),
                variants,
            };

            if (!output.variants?.length)
                throw new Error(
                    `No variants were detected for product ${externalId}`
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
        item: any,
        productDetail: any,
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
                //output = productDetails.data.goodsName;
            }
            return output;
        };

        /*for (const variant of productDetails.data.skuList) {
            //get price
            const baseAmount = variant.proPrice
                ? variant.proPrice.priceCent
                : variant.price.priceCent;

            //TODO: get from someplace global
            const currencies = ['eth', 'usdc', 'usdt'];
            const prices = [];
            for (const currency of currencies) {
                prices.push();
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
        }*/

        variants.push({
            title: item?.name,
            inventory_quantity: 9999,
            allow_backorder: false,
            manage_inventory: true,
            external_id: item?.operator?.id,
            external_source: PRODUCT_EXTERNAL_SOURCE,
            metadata: { imgUrl: productDetail?.card_image },
            prices: [
                {
                    currency_code: 'usdc',
                    amount: Math.floor(item.min * 100),
                },
                {
                    currency_code: 'usdt',
                    amount: Math.floor(item.min * 100),
                },
                {
                    currency_code: 'eth',
                    amount: await this.priceConverter.getPrice({
                        baseAmount: Math.floor(item.min * 100),
                        baseCurrency: 'usdc',
                        toCurrency: 'eth',
                    }),
                },
            ],
            options: [],
        });

        return variants;
    }

    private getUniqueProductOptionNames(productDetails: any): string[] {
        const output: string[] = [];
        return output;

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
