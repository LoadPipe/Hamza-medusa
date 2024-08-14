import {
    MedusaRequest,
    MedusaResponse,
    Logger,
    ProductStatus,
    SalesChannelService,
} from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreService from '../../../services/store';
import ProductService, {
    BulkImportProductInput,
} from '../../../services/product';
import { BuckyClient } from '../../../buckydrop/bucky-client';
import ProductCollectionRepository from '../../../repositories/product-collection';
import { PriceConverter } from '../../../strategies/price-selection';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    let productService: ProductService = req.scope.resolve('productService');
    let salesChannelService: SalesChannelService = req.scope.resolve(
        'salesChannelService'
    );
    let productCollectionRepository: typeof ProductCollectionRepository =
        req.scope.resolve('productCollectionRepository');
    const priceConverter = new PriceConverter();

    /*
    Dynamic store id and collection id and sc id on import 
    Translate SkuList into variants 
     1. create variant for each sku
     2. associate (somehow) the sku with the variant 
    */

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky'
    );

    const getImportData = async () => {
        const output = {
            storeId: '',
            collectionId: '',
            salesChannelId: '',
        };

        output.storeId = (await storeService.getStoreByName('Medusa Merch')).id;
        output.collectionId = (
            await productCollectionRepository.findOne({
                where: { store_id: output.storeId },
            })
        ).id;

        const salesChannels = await salesChannelService.list({}, { take: 1 });
        output.salesChannelId = salesChannels[0].id;

        return output;
    };

    const mapVariants = async (item: any, productDetails: any) => {
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

        for (const variant of productDetails.data.skuList) {
            const baseAmount = variant.price.priceCent * 100;
            const prices = [
                {
                    currency_code: 'eth', amount: await priceConverter.getPrice(
                        { baseAmount, baseCurrency: 'usdc', toCurrency: 'eth' }
                    )
                },
                {
                    currency_code: 'usdc', amount: await priceConverter.getPrice(
                        { baseAmount, baseCurrency: 'usdc', toCurrency: 'usdc' }
                    )
                },
                {
                    currency_code: 'usdt', amount: await priceConverter.getPrice(
                        { baseAmount, baseCurrency: 'usdc', toCurrency: 'usdt' }
                    )
                },
            ];

            variants.push({
                title: item.productName,
                inventory_quantity: 100000,
                allow_backorder: false,
                manage_inventory: true,
                bucky_metadata: JSON.stringify({ skuCode: variant.skuCode }),
                prices
            });
        }

        return variants;
    }

    const mapBuckyDataToProductInput = async (
        buckyClient: BuckyClient,
        item: any,
        status: ProductStatus,
        storeId: string,
        collectionId: string,
        salesChannels: string[]
    ) => {
        const productDetails = await buckyClient.getProductDetails(item.productLink);
        console.log(productDetails);
        return;

        return {
            title: item.productName,
            handle: item.spuCode,
            description: item.productName,
            is_giftcard: false,
            status: status as ProductStatus,
            thumbnail: item.picUrl,
            images: productDetails.data.productImageList,
            collection_id: collectionId,
            weight: Math.round(item.weight || 100),
            discountable: true,
            store_id: storeId,
            sales_channels: salesChannels.map((sc) => {
                return { id: sc };
            }),
            bucky_metadata: JSON.stringify(item),
            variants: await mapVariants(item, productDetails)
        };
    };

    await handler.handle(async () => {
        const importData = await getImportData();

        //retrieve products from bucky and convert them
        const buckyClient: BuckyClient = new BuckyClient();
        const productData = await buckyClient.searchProducts('sports', 1, 10);
        let products = await Promise.all(productData.map(
            p => mapBuckyDataToProductInput(
                buckyClient,
                p,
                ProductStatus.PUBLISHED,
                importData.storeId,
                importData.collectionId,
                [importData.salesChannelId])
        ));

        products = [products[0]];

        //import the products
        const output = products?.length
            ? await productService.bulkImportProducts(
                handler.inputParams.storeId,
                products
            )
            : [];

        return res.status(201).json({ status: true, products: output });
    });
};
