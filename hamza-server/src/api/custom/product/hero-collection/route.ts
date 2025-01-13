import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    try {
        // Define the array of product IDs to filter (replace with actual IDs or get them dynamically)
        const productIds = [
            'prod_01JHEZTBGEVK1H55VF71DR3AR0',
            'prod_01JHEZQB0D2267TDZ67AQ0KZ81',
            'prod_01JHEZQB5GY6KXK09E0D50AXPM',
            'prod_01JHEZQBAGT0D5QJXTZ5QD7A9D',
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
