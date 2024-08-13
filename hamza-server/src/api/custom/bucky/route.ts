import { MedusaRequest, MedusaResponse, Logger, ProductCollectionService, ProductStatus, SalesChannelService } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreService from '../../../services/store';
import ProductService, { BulkImportProductInput } from '../../../services/product';
import { Product } from '../../../models/product';
import { Config } from '../../../config';
import { BuckyClient } from '../../../buckydrop/bucky-client';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import ProductCollectionRepository from 'src/repositories/product-collection';
import { Not } from 'typeorm';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    let productService: ProductService = req.scope.resolve('productService');
    let salesChannelService: SalesChannelService = req.scope.resolve('salesChannelService');
    let productCollectionRepository: typeof ProductCollectionRepository = req.scope.resolve('productCollectionRepository');
    const productCollectionService: ProductCollectionService = req.scope.resolve(
        'productCollectionService'
    );

    /*
    Dynamic store id and collection id and sc id on import 
    Translate SkuList into variants 
     1. create variant for each sku
     2. associate (somehow) the sku with the variant 
    */

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/admin/custom/bucky'
    );

    const getImportData = async () => {
        const output = {
            storeId: 'store_01J54ZXRJ6CCTSWXD24DJ4H4GP',
            collectionId: 'pcol_01HRVF8HCVY8B00RF5S54THTPC',
            salesChannelId: 'sc_01J54ZW3CCERRE45GE775VMG08'
        };

        output.storeId = (await storeService.getStoreByName("Medusa Merch")).id;
        output.collectionId = (await productCollectionRepository.findOne({ where: { store_id: output.storeId } })).id;
        //sales channel 

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
            price: item.price.priceCent,
            bucky_metadata: JSON.stringify(item),
        };
    };

    await handler.handle(async () => {
        const importData = await getImportData();

        //retrieve products from bucky and convert them
        const bucky: BuckyClient = new BuckyClient();
        let products: BulkImportProductInput[] = (
            await bucky.searchProducts("shoes", 1, 10)
        ).map((p) => {
            return mapBuckyDataToProductInput(
                p,
                ProductStatus.PUBLISHED,
                importData.storeId,
                importData.collectionId,
                [importData.salesChannelId]
            );
        });

        products = [products[1]];

        const getProductDetails = async (prod: any) => {
            try {
                const buckyData = JSON.parse(prod.bucky_metadata);
                const productLink = buckyData.productLink;
                const productDetails =
                    await bucky.getProductDetails(productLink);

                //get product images
                for (let img of productDetails.data.productImageList) {
                    if (!prod.images.find(i => i === img)) {
                        prod.images.push(img);
                    }
                }

                buckyData.skuCode = productDetails.skuList[0].skuCode;
                prod.bucky_metadata = JSON.stringify(buckyData);
            } catch (error) {
                console.log(error);
            }
            return prod;
        };

        const promises: Promise<any>[] = [];

        for (let i = 0; i < products.length; i++) {
            promises.push(getProductDetails(products[i]));
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

