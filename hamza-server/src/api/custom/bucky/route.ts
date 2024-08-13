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

    const mapBuckyDataToProductInput = async (
        buckyClient: BuckyClient,
        item: any,
        status: ProductStatus,
        storeId: string,
        collectionId: string,
        salesChannels: string[]
    ) => {
        const productDetails = await buckyClient.getProductDetails(item.productLink);
        const baseAmount = productDetails.data.price.priceCent * 100;
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
            variants: [{
                title: item.productName,
                inventory_quantity: 10,
                allow_backorder: false,
                manage_inventory: true,
                prices
            }]
        };
    };

    await handler.handle(async () => {
        const importData = await getImportData();

        //retrieve products from bucky and convert them
        const buckyClient: BuckyClient = new BuckyClient();
        const productData = await buckyClient.searchProducts('ring', 1, 10);
        let products = await Promise.all(productData.map(
            p => mapBuckyDataToProductInput(
                buckyClient,
                p,
                ProductStatus.PUBLISHED,
                importData.storeId,
                importData.collectionId,
                [importData.salesChannelId])
        ));

        products = [products[6]];

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
