import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    try {
        // Define the array of product IDs to filter (replace with actual IDs or get them dynamically)
        const productIds = [
            'prod_01JG3NZFJMKG7NAEPAC5DXDQAP',
            'prod_01JG3NZFP9VRWE3386W0ZJN832',
            'prod_01JG3NZH68N388AD9K1PH8E480',
            'prod_01JG3NZGXCKNPY32C9MNPM5760',
        ];

        // Call the getProductCollection function
        const products = await productService.getProductCollection(productIds);

        // Return the product details in the response
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
