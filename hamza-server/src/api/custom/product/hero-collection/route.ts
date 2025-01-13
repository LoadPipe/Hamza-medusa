import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/product/hero-collection'
    );

    try {
        let productData = await ProductRepository.find({
            select: ['id'],
            take: 4,
        });

        const productIds = productData.map((product) => product.id);

        const products = await productService.getProductCollection(productIds);

        handler.returnStatus(200, { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        handler.returnStatus(500, { error: 'Internal Server Error' });
    }
};
