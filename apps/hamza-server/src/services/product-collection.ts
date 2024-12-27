import { Lifetime } from 'awilix';
import {
    ProductCollectionService as MedusaProductCollectionService,
    Logger,
} from '@medusajs/medusa';
import {
    CreateProductCollection as MedusaCreateProductCollection,
    UpdateProductCollection as MedusaUpdateProductCollection,
} from '@medusajs/medusa/dist/types/product-collection';
import { ProductCollection } from '../models/product-collection';
import { ProductCollectionRepository } from '../repositories/product-collection';
import { In, UpdateResult } from 'typeorm';
import { createLogger, ILogger } from '../utils/logging/logger';

type UpdateProductCollection = MedusaUpdateProductCollection & {
    store_id?: string;
};

type CreateProductCollection = MedusaCreateProductCollection & {
    store_id?: string;
};

export default class ProductCollectionService extends MedusaProductCollectionService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productCollectionRepository_: typeof ProductCollectionRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.productCollectionRepository_ =
            container.productCollectionRepository;
        this.logger = createLogger(container, 'ProductCollectionService');
    }

    async update(
        id: string,
        input: UpdateProductCollection
    ): Promise<ProductCollection> {
        const result: UpdateResult =
            await this.productCollectionRepository_.update(id, input);
        return this.productCollectionRepository_.findOne({
            where: { id },
        });
    }

    async create(input: CreateProductCollection): Promise<ProductCollection> {
        return this.productCollectionRepository_.save(input);
    }

    async addProducts(
        collection_id: string,
        product_ids: string[]
    ): Promise<ProductCollection> {
        //get the collection
        const collection: ProductCollection =
            await this.productCollectionRepository_.findOne({
                where: { id: collection_id },
            });

        //verify that collection exists
        if (!collection)
            throw new Error(`Collection with id ${collection} not found.`);

        //verify that each product
        await this.verifyProductsInStore(collection.store_id, product_ids);

        //add the products
        await super.addProducts(collection_id, product_ids);

        //return the array of products
        return this.productCollectionRepository_.findOne({
            where: { id: collection_id },
        });
    }

    protected async verifyProductsInStore(
        store_id: string,
        product_ids: string[]
    ): Promise<boolean> {
        //TODO: complete this check; will require extending product repository too

        //get all products
        const products = await this.productRepository_.find({
            where: { id: In(product_ids) /*store_id: store_id*/ },
        });

        //check each one
        products.forEach((p) => {
            //if (p.store_id != store_id) return false;
        });

        return true;
    }
}
