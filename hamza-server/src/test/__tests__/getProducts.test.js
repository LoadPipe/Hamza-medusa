import ProductService from '../__mocks__/productService';

describe('All Products test suite', () => {
    let productService;

    beforeEach(() => {
        productService = new ProductService();
    });

    it('should call mock product array', async () => {
        const products =
            await productService.getAllProductsFromStoreWithPrices();
        expect(products).toEqual([
            {
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
            },
        ]);
    });
});
