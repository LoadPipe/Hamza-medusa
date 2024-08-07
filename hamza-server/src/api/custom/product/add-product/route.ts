import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(req, res, 'POST', '/products/add-product');

    await handler.handle(async () => {
        const productData = req.body as CreateProductInput; // Type assertion here

        // Optionally, add validation here to ensure all required fields are present
        if (!productData.title || !productData.handle) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields',
            });
        }

        const addedProduct = await productService.addProduct(productData);
        handler.logger.debug(`Product added: ${addedProduct.id}`);
        return res.status(200).json({ status: true, product: addedProduct });
    });
};
