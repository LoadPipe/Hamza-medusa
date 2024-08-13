import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import ProductService, {
    BulkImportProductInput,
} from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';
import { BuckyClient } from '../../../../buckydrop/bucky-client';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let productService: ProductService = req.scope.resolve('productService');
    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/products/add-product',
        ['keyword', 'storeId', 'collectionId', 'salesChannelId']
    );

    const mapBuckyDataToProductInput = (
        item: any,
        status: ProductStatus,
        storeId: string,
        collectionId: string,
        salesChannels: string[]
    ) => {
        return {
            title: item.productName,
            handle: item.spuCode,
            description: item.productName,
            is_giftcard: false,
            status: status as ProductStatus,
            thumbnail: item.picUrl,
            images: [item.picUrl],
            collection_id: collectionId,
            weight: Math.round(item.weight || 100),
            discountable: true,
            store_id: storeId,
            sales_channels: salesChannels.map((sc) => {
                return { id: sc };
            }),
            price: 1,
            bucky_metadata: JSON.stringify(item),
        };
    };

    await handler.handle(async () => {
        if (!handler.inputParams.keyword) {
            return res.status(400).json({
                status: false,
                message: 'Missing required keyword field',
            });
        }

        //retrieve products from bucky and convert them
        const bucky: BuckyClient = new BuckyClient();
        let products: BulkImportProductInput[] = (
            await bucky.searchProducts(handler.inputParams.keyword, 1, 10)
        ).map((p) => {
            return mapBuckyDataToProductInput(
                p,
                ProductStatus.PUBLISHED,
                handler.inputParams.storeId,
                handler.inputParams.collectionId,
                [handler.inputParams.salesChannelId]
            );
        });

        products = [products[5]];

        const productDetails = async (prod: any) => {
            try {
                const buckyData = JSON.parse(prod.bucky_metadata);
                const productLink = buckyData.productLink;
                console.log('productLink is:', productLink);
                const productDetails =
                    await bucky.getProductDetails(productLink);
                console.log(productDetails);
            } catch (error) {
                console.log(error);
            }
            return prod;
        };

        const promises: Promise<any>[] = [];

        for (let i = 0; i < products.length; i++) {
            promises.push(productDetails(products[i]));
        }

        await Promise.all(promises);
        console.log('finished');

        //import the products
        const output = products?.length
            ? await productService.bulkImportProducts(handler.inputParams.storeId, products)
            : [];

        return res.status(201).json({ status: true, products: output });
    });
};
