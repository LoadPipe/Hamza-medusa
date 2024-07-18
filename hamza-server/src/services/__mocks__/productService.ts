// __mocks__/productService.ts
class ProductService {
    async getAllProductsFromStoreWithPrices() {
        console.log('Mock getAllProductsFromStoreWithPrices called');
        return [
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
        ];
    }
}

export default ProductService;
