// __tests__/getProducts.test.js
import ProductService from '../__mocks__/productService';

// Mock the ProductService
jest.mock('../__mocks__/productService');

test('getAllProductsFromStoreWithPrices returns mocked products', async () => {
    const productService = new ProductService();
    const products = await productService.getAllProductsFromStoreWithPrices();
    console.log('Received products:', products); // Debugging statement
    expect(products).toEqual([
        expect.objectContaining({
            store_id: '',
            reviews: [],
            massmarket_prod_id: null,
            id: '',
            created_at: '',
            updated_at: '',
            deleted_at: null,
            title: '',
            subtitle: '',
            description: '',
            handle: '',
            is_giftcard: false,
            status: '',
            thumbnail: '',
            weight: 69,
            collection_id: '',
            metadata: null,
            variants: [{}],
        }),
    ]);
});
