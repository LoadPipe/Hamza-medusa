import {
    TransactionBaseService,
    Logger,
    ProductStatus,
} from '@medusajs/medusa';
import ProductService from '../services/product';
import { Product } from '../models/product';
import { PriceConverter } from '../strategies/price-selection';
import { BuckyClient } from '../buckydrop/bucky-client';
import { CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';

type CreateProductInput = MedusaCreateProductInput & { store_id: string, bucky_metadata?: string };

export default class BuckydropService extends TransactionBaseService {
    protected readonly logger: Logger;
    protected readonly productService_: ProductService;
    protected readonly priceConverter: PriceConverter;
    protected readonly buckyClient: BuckyClient;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.logger = container.logger;
        this.priceConverter = new PriceConverter();
        this.buckyClient = new BuckyClient();
    }

    async importProductsByKeyword(
        storeId: string,
        collectionId: string,
        salesChannelId: string
    ): Promise<Product[]> {
        //retrieve products from bucky and convert them
        const buckyClient: BuckyClient = new BuckyClient();
        const searchResults = await buckyClient.searchProducts(
            'cup',
            1,
            10
        );
        this.logger.debug(`search returned ${searchResults.length} results`);
        const productData = searchResults; //[searchResults[4], searchResults[5]];

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


        //filter out failures
        products = products.filter(p => p ? p : null);

        //import the products
        const output = products?.length
            ? await this.productService_.bulkImportProducts(storeId, products)
            : [];

        //TODO: best to return some type of report; what succeeded, what failed
        return output;
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
                bucky_metadata: JSON.stringify(item),
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
