import { Lifetime } from 'awilix';
import { StoreService as MedusaStoreService, Store } from '@medusajs/medusa';
import { User } from '../models/user';
import StoreRepository from '../repositories/store';
import axios from 'axios';

class StoreService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;
    }

    async createStore(
        user: User,
        store_name: string,
        collection: string
    ): Promise<Store> {
        let owner_id = user.id;
        console.log('owner_id: ', owner_id);
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        let newStore = storeRepo.create();
        // newStore.owner = user; // Set the owner
        newStore.name = store_name; // Set the store name
        newStore.owner_id = owner_id; // Set the owner_id
        newStore = await storeRepo.save(newStore);
        console.log('New Store Saved:', newStore);
        await this.populateProductsWithStoreId(newStore, collection);
        return newStore; // Return the newly created and saved store
    }

    // TODO: Should I pull this out of the store service? -G
    async populateProductsWithStoreId(
        store: Store,
        collection: String
    ): Promise<any> {
        let collectionListUrl = `http://localhost:9000/store/products?collection_id[]=${collection}`;
        console.log('Fetching products from collection: ', collectionListUrl);
        let updateProductUrl = `http://localhost:9000/routes/products`;
        try {
            // Get a list of products belonging to a collection
            const collectionListResponse = await axios.get(collectionListUrl);
            const products = collectionListResponse.data.products;
            console.log(
                'Products fetched',
                products.length,
                products[0].id,
                products[1].id,
                products[2].id,
                products[3].id,
                products[4].id
            );

            // Map `each` product to a `POST` request to update product with `store_id`
            const updatePromises = products.map((product) => {
                const body = {
                    product_id: product.id,
                    store_id: store.id,
                };
                return axios.post(updateProductUrl, body);
            });

            await Promise.all(updatePromises);
            console.log(
                'All products have been successfully updated with store_id'
            );
        } catch (error) {
            console.error('Error processing products:', error);
        }
    }
}

export default StoreService;
