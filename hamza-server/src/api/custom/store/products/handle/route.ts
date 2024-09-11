import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../../services/store';
import ProductService from '../../../../../services/product';
import { RouteHandler } from '../../../../route-handler';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store/products/handle'
    );

    // Return error if no products in store
    await handler.handle(async () => {
        const { store_name, category } = req.query;

        // Validate the request
        if (!handler.requireParam('store_name')) return;

        // Fetch the store data by name
        const storeData = await storeService.getStoreByName(
            store_name.toString()
        );
        console.log('Retrieved store data:', storeData);

        const fashion = 'fashion';
        // Fetch the products by store ID
        const products = await productService.getStoreProductsByCategory(
            storeData.id.toString(),
            category.toString()
        );

        // Filter products by product handle if provided
        // let filteredProducts = products;
        // if (product_handle) {
        //     filteredProducts = products.filter(
        //         (product: any) => product.handle === product_handle.toString()
        //     );
        // }

        // Return the filtered products
        return handler.returnStatus(200, products);
    });
};

/*
import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../../services/store';
import ProductService from '../../../../../services/product';
import { RouteHandler } from '../../../../route-handler';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store/products/handle'
    );

    // Return error if no products in store
    await handler.handle(async () => {
        const { store_name, product_handle } = req.query;

        // Validate the request
        if (!handler.requireParam('store_name')) return;

        // Fetch the store data by name
        const storeData = await storeService.getStoreByName(
            store_name.toString()
        );
        console.log('Retrieved store data:', storeData);

        // Fetch the products by store ID
        const products = await productService.getCategoriesByStoreId(
            storeData.id.toString()
        );
        console.log('Retrieved products:', products);

        // Filter products by product handle if provided
        let filteredProducts = products;
        if (product_handle) {
            filteredProducts = products.filter(
                (product: any) => product.handle === product_handle.toString()
            );
        }

        // Return the filtered products
        return handler.returnStatus(200, filteredProducts);
    });
};
*/
