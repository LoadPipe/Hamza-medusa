import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let productService: ProductService = req.scope.resolve('productService');
    const handler = new RouteHandler(req, res, 'POST', '/products/add-product');

    await handler.handle(async () => {
        const productData = req.body as {
            keyword: string,
            storeId: string,
            collectionId: string,
            salesChannelId: string,
        }; // Assuming only keyword is needed

        if (!productData.keyword) {
            return res.status(400).json({
                status: false,
                message: 'Missing required keyword field',
            });
        }

        try {
            const addedProduct = await productService.addProductFromBuckyDrop(
                productData.storeId,
                productData.collectionId,
                [productData.salesChannelId],
                productData.keyword,
            );
            handler.logger.debug(`Product added: ${addedProduct}`);
            return res
                .status(200)
                .json({ status: true, product: addedProduct });
        } catch (error) {
            handler.logger.error(`Error adding product: ${error.message}`);
            return res.status(500).json({
                status: false,
                message: 'Failed to add product',
                error: error.message,
            });
        }
    });
};
