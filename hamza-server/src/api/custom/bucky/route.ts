import { MedusaRequest, MedusaResponse, Logger, ProductCollectionService, ProductStatus, SalesChannelService } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreService from '../../../services/store';
import ProductService from '../../../services/product';
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

    await handler.handle(async () => {
        const importData = await getImportData();

        //retrieve products from bucky and convert them 
        const importer = new BuckyImporter(productService);
        const output = await importer.doImport(
            "sports",
            importData.storeId,
            importData.collectionId,
            importData.salesChannelId
        );

        //salesChannelService.retrieve()

        return res
            .status(200)
            .json({ status: true, products: output });
    });
};


class BuckyImporter {
    productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }
    async doImport(
        keyword: string,
        storeId: string,
        collectionId: string,
        salesChannelId: string
    ): Promise<Product[]> {

        const bucky: BuckyClient = new BuckyClient();
        const products = (await bucky.searchProducts(
            keyword, 1, 10
        )).map(p => {
            return this.mapBuckyDataToProductInput(p,
                ProductStatus.PUBLISHED,
                storeId,
                collectionId,
                [salesChannelId])
        });

        //import the products
        const output = products?.length ?
            await this.productService.bulkImportProducts(products)
            : [];

        return output;
    }

    private mapBuckyDataToProductInput(
        item: any,
        status: ProductStatus,
        storeId: string,
        collectionId: string,
        salesChannels: string[]
    ) {
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
            sales_channels: salesChannels.map(sc => { return { id: sc } }),
            bucky_metadata: JSON.stringify(item)
        };
    }
}
