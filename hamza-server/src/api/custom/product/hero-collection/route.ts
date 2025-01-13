import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    try {
        let productData = await ProductRepository.find({
            select: ['id'],
            take: 4,
        });

        const productIds = productData.map((product) => product.id);

        const products = await productService.getProductCollection(productIds);

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
