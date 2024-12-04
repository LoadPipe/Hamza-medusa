import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import ProductService from '../../../services/product';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';
import GlobetopperService from '../../../services/globetopper';
import { GlobetopperClient } from 'src/globetopper/globetopper-client';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const globeTopperService: GlobetopperService =
        req.scope.resolve('globetopperService');
    const productService: ProductService = req.scope.resolve('productService');
    const globetopperClient: GlobetopperClient = new GlobetopperClient();

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards'
    );

    await handler.handle(async () => {
        //require params
        if (!handler.requireParam('store_id')) return;

        //TODO: move most of this to service
        const gtProducts = await globetopperClient.searchProducts();

        const gtCatalogue = await globetopperClient.getCatalog();

        const productInputs: (CreateProductInput & { store_id: string })[] = [];

        const gtRecords = gtProducts.data.records.sort(
            (a, b) => (a?.operator?.id ?? 0) < (b?.operator?.id ?? 0)
        );
        const gtCat = gtCatalogue.data.records.sort(
            (a, b) => (a?.topup_product_id ?? 0) < (b?.topup_product_id ?? 0)
        );

        for (let record of gtRecords) {
            const productDetails = gtCat.find(
                (r) => r.topup_product_id == (record?.operator?.id ?? 0)
            );

            if (productDetails) {
                productInputs.push(
                    await globeTopperService.mapDataToProductInput(
                        record,
                        productDetails,
                        ProductStatus.PUBLISHED,
                        handler.inputParams.store_id,
                        handler.inputParams.category_id,
                        handler.inputParams.collection_id,
                        [handler.inputParams.sales_channel_id]
                    )
                );
            }
        }

        handler.logger.debug(`importing ${productInputs.length} products`);

        const products = await productService.bulkImportProducts(
            handler.inputParams.store_id,
            productInputs
        );

        return handler.returnStatus(
            200,
            {
                status: 'ok',
                inputs: productInputs,
                data: products,
                records: gtRecords,
                cat: gtCat,
            },
            100
        );
    });
};
