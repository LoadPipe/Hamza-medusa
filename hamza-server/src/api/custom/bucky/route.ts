import { MedusaRequest, MedusaResponse, Logger, ProductCollectionService, ProductStatus, SalesChannelService } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreService from '../../../services/store';
import ProductService, { BulkImportProductInput } from '../../../services/product';
import { Product } from '../../../models/product';
import { Config } from '../../../config';
import { BuckyClient } from '../../../buckydrop/bucky-client';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    let productService: ProductService = req.scope.resolve('productService');
    let salesChannelService: SalesChannelService = req.scope.resolve('salesChannelService');
    const productCollectionService: ProductCollectionService = req.scope.resolve(
        'productCollectionService'
    );

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/admin/custom/bucky'
    );

    const getImportData = async () => {
        const output = {
            storeId: 'store_01J4W6J3RXZ4JDH4XYZZQP4S2R',
            collectionId: 'pcol_01HSGAMXDJD725MR3VSW63B0RD',
            salesChannelId: 'sc_01J4W6GT9V06AQF2G0T01ZPXVE'
        };

        return output;
    };

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
        const importData = await getImportData();

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

