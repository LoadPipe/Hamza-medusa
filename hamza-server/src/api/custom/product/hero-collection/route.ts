import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        // Retrieve the product repository from the request scope
        const productRepository = req.scope.resolve('productRepository');

        // Find the product using the repository
        const productCollection = await productRepository.findOne({
            where: { id: 'prod_01JG3NZFJMKG7NAEPAC5DXDQAP' },
        });

        console.log('PRODUCT COLL', productCollection);
        // Return the product details in the response
        res.status(200).json({ product: productCollection });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
