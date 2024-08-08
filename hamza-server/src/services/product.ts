import { Lifetime } from 'awilix';
import {
    ProductService as MedusaProductService,
    Logger,
} from '@medusajs/medusa';
import {
    CreateProductInput,
    CreateProductProductVariantPriceInput,
} from '@medusajs/medusa/dist/types/product';
import { Product } from '../models/product';
import logger from '@medusajs/medusa-cli/dist/reporter';
import { StoreRepository } from '../repositories/store';
import {
    ProductVariant,
    MoneyAmount,
    ProductVariantMoneyAmount,
} from '@medusajs/medusa';
import { ProductVariantRepository } from '../repositories/product-variant';
import { BuckyClient } from '../buckydrop/bucky-client';
import { ProductStatus } from '@medusajs/medusa';
export type UpdateProductProductVariantDTO = {
    id?: string;
    store_id?: string;
    title?: string;
    sku?: string;
    ean?: string;
    upc?: string;
    barcode?: string;
    hs_code?: string;
    inventory_quantity?: number;
    allow_backorder?: boolean;
    manage_inventory?: boolean;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    origin_country?: string;
    mid_code?: string;
    material?: string;
    metadata?: Record<string, unknown>;
    prices?: CreateProductProductVariantPriceInput[];
    options?: {
        value: string;
        option_id: string;
    }[];
};

type UpdateProductInput = Omit<Partial<CreateProductInput>, 'variants'> & {
    variants?: UpdateProductProductVariantDTO[];
};

class ProductService extends MedusaProductService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: Logger;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    private buckyClient: BuckyClient;

    constructor(container) {
        super(container);
        this.logger = container.logger;
        this.storeRepository_ = container.storeRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.buckyClient = new BuckyClient();
    }

    async updateProduct(
        productId: string,
        update: UpdateProductInput
    ): Promise<Product> {
        this.logger.debug(
            `Received update for product: ${productId}, ${update}`
        );
        const result = await super.update(productId, update);
        return result;
    }

    async updateVariantPrice(
        variantId: string,
        prices: CreateProductProductVariantPriceInput[]
    ): Promise<void> {
        const moneyAmountRepo = this.activeManager_.getRepository(MoneyAmount);
        const productVariantMoneyAmountRepo = this.activeManager_.getRepository(
            ProductVariantMoneyAmount
        );

        try {
            for (const price of prices) {
                const moneyAmount = await moneyAmountRepo.create({
                    currency_code: price.currency_code,
                    amount: price.amount,
                });
                const savedMoneyAmount =
                    await moneyAmountRepo.save(moneyAmount);

                const productVariantMoneyAmount =
                    await productVariantMoneyAmountRepo.create({
                        variant_id: variantId,
                        money_amount_id: savedMoneyAmount.id,
                    });

                await productVariantMoneyAmountRepo.save(
                    productVariantMoneyAmount
                );
            }
        } catch (e) {
            console.log(e);
        }
    }

    async addProductFromBuckyDrop(keyword: string): Promise<any> {
        try {
            const data = await this.buckyClient.searchProducts(keyword, 1, 10);
            if (!data.success || !data.data.records.length) {
                throw new Error('No products found or error in fetching data');
            }

            // Map and create products
            const productsData = data.data.records.map(
                this.mapBuckyDataToProductInput
            );
            const addedProducts = await Promise.all(
                productsData.map((product) => super.create(product))
            );

            // Ensure all products have valid IDs
            const validProducts = addedProducts.filter((p) => p && p.id);
            if (validProducts.length !== addedProducts.length) {
                throw new Error('Some products were not created successfully');
            }

            // Create variants for each valid product
            const variantCreationPromises = validProducts.map(
                (savedProduct) => {
                    const variantData = {
                        title: savedProduct.title,
                        product_id: savedProduct.id,
                        inventory_quantity: 10,
                        allow_backorder: false,
                        manage_inventory: true,
                    };

                    const variant =
                        this.productVariantRepository_.create(variantData);
                    return this.productVariantRepository_.save(variant);
                }
            );

            // Wait for all variants to be created
            const variants = await Promise.all(variantCreationPromises);

            console.log(
                `Added products: ${validProducts.map((p) => p.id).join(', ')}`
            );
            return validProducts;
        } catch (error) {
            console.error('Error in adding products from BuckyDrop:', error);
            throw error;
        }
    }

    private mapBuckyDataToProductInput(item) {
        return {
            title: item.productName,
            handle: item.spuCode,
            description: item.productName,
            is_giftcard: false,
            status: 'draft' as ProductStatus,
            thumbnail: item.picUrl,
            weight: Math.round(item.weight || 100),
            length: Math.round(item.length || 10),
            height: Math.round(item.height || 10),
            width: Math.round(item.width || 10),
            hs_code: item.hs_code || '123456',
            origin_country: item.origin_country || 'US',
            mid_code: item.mid_code || 'ABC123',
            material: item.material || 'Cotton',
            type: null,
            collection_id: 'pcol_01HSGAM4918EX0DETKY6E662WT',
            discountable: true,
            store_id: 'store_01J3CF347H10K4C8D889DST58Z',
        };
    }

    async getProductsFromStoreWithPrices(storeId: string): Promise<Product[]> {
        return this.productRepository_.find({
            where: { store_id: storeId },
            relations: ['variants.prices', 'reviews'],
        });
    }

    async getAllProductsFromStoreWithPrices(): Promise<Product[]> {
        const products = await this.productRepository_.find({
            relations: ['variants.prices', 'reviews'],
        });

        // Sort products so those with weight 69 come first
        const sortedProducts = products.sort((a, b) => {
            if (a.weight === 69 && b.weight !== 69) {
                return -1;
            }
            if (a.weight !== 69 && b.weight === 69) {
                return 1;
            }
            return 0;
        });

        return sortedProducts;
    }

    async getProductsFromStore(storeId: string): Promise<Product[]> {
        // this.logger.log('store_id: ' + storeId); // Potential source of the error
        return this.productRepository_.find({
            where: { store_id: storeId },
            // relations: ['store'],
        });
    }

    async getStoreFromProduct(productId: string): Promise<string> {
        try {
            const product = await this.productRepository_.findOne({
                where: { id: productId },
                relations: ['store'],
            });

            return product.store.name;
        } catch (error) {
            this.logger.error('Error fetching store from product:', error);
            throw new Error('Failed to fetch store from product');
        }
    }

    async getProductsFromReview(storeId: string) {
        try {
            const products = await this.productRepository_.find({
                where: { store_id: storeId },
                relations: ['reviews'],
            });

            let totalReviews = 0;
            let totalRating = 0;

            products.forEach((product) => {
                product.reviews.forEach((review) => {
                    totalRating += review.rating;
                });
                totalReviews += product.reviews.length;
            });

            const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            const reviewStats = { reviewCount: totalReviews, avgRating };

            return reviewStats;
        } catch (error) {
            // Handle the error here
            console.error(
                'Error occurred while fetching products from review:',
                error
            );
            throw new Error('Failed to fetch products from review.');
        }
    }

    async getProductsFromStoreName(storeName: string) {
        try {
            const store = await this.storeRepository_.findOne({
                where: { name: storeName },
            });

            if (!store) {
                return null;
            }

            let totalReviews = 0;
            let totalRating = 0;

            const products = await this.productRepository_.find({
                where: { store_id: store.id },
                relations: ['reviews'],
            });

            let thumbnail = store.icon;
            let productCount = products.length;
            let createdAt = store.created_at;
            let reviews = [];

            products.forEach((product) => {
                product.reviews.forEach((review) => {
                    totalRating += review.rating;
                    reviews.push({
                        id: review.id,
                        title: review.title,
                        rating: review.rating,
                        review: review.content,
                        createdAt: review.created_at,
                    });
                });
                totalReviews += product.reviews.length;
            });

            const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            const reviewStats = {
                reviewCount: totalReviews,
                reviews: reviews,
                avgRating,
                productCount,
                createdAt,
                numberOfFollowers: store.numberOfFollowers,
                thumbnail,
            };

            return reviewStats;
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products from review:',
                error
            );
            throw new Error('Failed to fetch products from review.');
        }
    }
}

export default ProductService;
