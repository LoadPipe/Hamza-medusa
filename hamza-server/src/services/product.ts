import { Lifetime } from 'awilix';
import {
    ProductService as MedusaProductService,
    Logger,
    MoneyAmount,
    ProductVariantMoneyAmount,
    Store,
    ProductStatus,
} from '@medusajs/medusa';
import {
    CreateProductInput,
    CreateProductProductVariantPriceInput,
} from '@medusajs/medusa/dist/types/product';
import { Product } from '../models/product';
import { StoreRepository } from '../repositories/store';
import PriceSelectionStrategy, {
    PriceConverter,
} from '../strategies/price-selection';
import CustomerService from '../services/customer';
import { ProductVariantRepository } from '../repositories/product-variant';
import { In, IsNull, Not } from 'typeorm';
import { createLogger, ILogger } from '../utils/logging/logger';

export type BulkImportProductInput = CreateProductInput;

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
    protected readonly logger: ILogger;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly customerService_: CustomerService;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'ProductService');
        this.storeRepository_ = container.storeRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.customerService_ = container.customerService;
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
            const moneyAmounts = [];
            const variantMoneyAmounts = [];

            for (const price of prices) {
                const moneyAmount = moneyAmountRepo.create({
                    currency_code: price.currency_code,
                    amount: price.amount, // Assuming the amount is the same for all currencies; adjust if needed
                });
                const savedMoneyAmount =
                    await moneyAmountRepo.save(moneyAmount);

                moneyAmounts.push(savedMoneyAmount);

                const productVariantMoneyAmount =
                    productVariantMoneyAmountRepo.create({
                        variant_id: variantId,
                        money_amount_id: savedMoneyAmount.id,
                    });

                variantMoneyAmounts.push(productVariantMoneyAmount);
            }

            // Save all ProductVariantMoneyAmount entries in one go
            await productVariantMoneyAmountRepo.save(variantMoneyAmounts);
            this.logger.info(
                `Updated prices for variant ${variantId} in currencies: eth, usdc, usdt`
            );
        } catch (e) {
            this.logger.error('Error updating variant prices:', e);
        }
    }

    // do the detection here does the product exist already / update product input

    async bulkImportProducts(
        storeId: string,
        productData: (CreateProductInput | UpdateProductInput)[],
        deleteExisting: boolean = true
    ): Promise<Product[]> {
        try {
            //get the store
            const store: Store = await this.storeRepository_.findOne({
                where: { id: storeId },
            });

            if (!store) {
                throw new Error(`Store ${storeId} not found.`);
            }

            //get existing products by handle
            const productHandles: string[] = productData.map((p) => p.handle);
            const existingProducts: Product[] =
                await this.productRepository_.find({
                    where: { handle: In(productHandles) },
                    relations: ['variants'],
                });

            const addedProducts = await Promise.all(
                productData.map((product) => {
                    return new Promise<Product>(async (resolve, reject) => {
                        const productHandle = product.handle;

                        try {
                            // Check if the product already exists by handle
                            const existingProduct = existingProducts.find(
                                (p) => p.handle === product.handle
                            );

                            //delete existing product
                            if (existingProduct) {
                                if (deleteExisting) {
                                    this.logger.info(
                                        `Deleting existing product ${existingProduct.id} with handle ${existingProduct.handle}`
                                    );
                                    await this.delete(existingProduct.id);
                                } else {
                                    this.logger.warn(
                                        `Could not import, existing product ${existingProduct.id} with handle ${existingProduct.handle} found`
                                    );
                                    resolve(null);
                                }
                            }

                            // If the product does not exist, create a new one
                            this.logger.info(
                                `Creating new product with handle: ${productHandle}`
                            );
                            resolve(
                                await super.create(
                                    product as CreateProductInput
                                )
                            );
                        } catch (error) {
                            this.logger.error(
                                `Error processing product with handle: ${productHandle}`,
                                error
                            );
                            resolve(null);
                        }
                    });
                })
            );

            // Ensure all products are non-null and have valid IDs
            const validProducts = addedProducts.filter((p) => p && p.id);
            this.logger.info(
                `${validProducts.length} out of ${productData.length} products were imported`
            );
            if (validProducts.length !== addedProducts.length) {
                this.logger.warn('Some products were not created successfully');
            }

            this.logger.debug(
                `Added products: ${validProducts.map((p) => p.id).join(', ')}`
            );
            return validProducts;
        } catch (error) {
            this.logger.error(
                'Error in adding products from BuckyDrop:',
                error
            );
            throw error;
        }
    }

    async getProductsFromStoreWithPrices(storeId: string): Promise<Product[]> {
        return await this.convertPrices(
            (
                await this.productRepository_.find({
                    where: {
                        store_id: storeId,
                        status: ProductStatus.PUBLISHED,
                    },
                    relations: ['variants.prices', 'reviews'],
                })
            ).filter((p) => p.variants?.length)
        );
    }

    async getAllProductsFromStoreWithPrices(): Promise<Product[]> {
        const products = await this.convertPrices(
            await this.productRepository_.find({
                relations: ['variants.prices', 'reviews'],
                where: {
                    status: ProductStatus.PUBLISHED,
                    store_id: Not(IsNull()),
                },
            })
        );

        // Sort products so those with weight 69 come first
        const sortedProducts = products
            .sort((a, b) => {
                if (a.weight === 69 && b.weight !== 69) {
                    return -1;
                }
                if (a.weight !== 69 && b.weight === 69) {
                    return 1;
                }
                return 0;
            })
            .filter((p) => p.variants?.length);

        return sortedProducts;
    }

    async getProductsFromStore(storeId: string): Promise<Product[]> {
        // this.logger.log('store_id: ' + storeId); // Potential source of the error
        return (
            await this.productRepository_.find({
                where: { store_id: storeId, status: ProductStatus.PUBLISHED },
                // relations: ['store'],
            })
        ).filter((p) => p.variants?.length);
    }

    async getCategoriesByStoreId(storeId: string): Promise<Product[]> {
        try {
            const query = `
                SELECT pc.*
                FROM product p
                JOIN product_category_product pcp ON p.id = pcp.product_id
                JOIN product_category pc ON pcp.product_category_id = pc.id
                WHERE p.store_id = $1
            `;

            const categories = await this.productRepository_.query(query, [
                storeId,
            ]);
            return categories;
        } catch (error) {
            this.logger.error('Error fetching categories by store ID:', error);
            throw new Error(
                'Failed to fetch categories for the specified store.'
            );
        }
    }

    async getStoreFromProduct(productId: string): Promise<Object> {
        try {
            const product = await this.productRepository_.findOne({
                where: { id: productId },
                relations: ['store'],
            });

            return product.store;
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

    /**
     * Fetches all products for a specific store and category.
     *
     * 1. Retrieves product categories with their associated products, variants, prices, and reviews.
     * 2. If the categoryName is not "all", filters the categories based on the given category name.
     * 3. Filters products within the selected category (or all categories if "all") by the provided store ID.
     * 4. Updates the product pricing for the filtered products.
     * 5. Returns the filtered list of products.
     *
     * @param {string} storeId - The ID of the store to fetch products from.
     * @param {string} categoryName - The category to filter products by, or "all" to fetch all categories.
     * @returns {Array} - A list of products for the specified store and category.
     * @throws {Error} - If there is an issue fetching the products or updating prices.
     */
    async getStoreProductsByCategory(storeId: string, categoryName: string) {
        try {
            if (categoryName.toLowerCase() === 'all') {
                return await this.getProductsFromStoreWithPrices(storeId);
            }
            // Query to get all products for the given store ID
            const categories = await this.productCategoryRepository_.find({
                select: ['id', 'name', 'metadata'],
                relations: [
                    'products',
                    'products.variants.prices',
                    'products.reviews',
                ],
            });

            let filteredCategories = categories;

            //Filter for the specific category
            filteredCategories = categories.filter(
                (cat) => cat.name.toLowerCase() === categoryName
            );

            // Filter products for the category (or all categories) by storeId and status 'published'
            const filteredProducts = filteredCategories.map((cat) => {
                return {
                    ...cat,
                    products: cat.products.filter(
                        (product) =>
                            product.store_id === storeId &&
                            product.status === 'published'
                    ),
                };
            });

            // Update product pricing
            await Promise.all(
                filteredProducts.map((cat) => this.convertPrices(cat.products))
            );

            return filteredProducts; // Return all product data
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products by handle:',
                error
            );
            throw new Error('Failed to fetch products by handle.');
        }
    }

    async getAllProductsByCategoryHandle(storeId: string, handle: string) {
        console.log(storeId);
        const productCategory = await this.productCategoryRepository_.findOne({
            where: {
                handle: handle,
            },
            relations: ['products.variants.prices'],
        });

        if (!productCategory) {
            throw new Error('Product category not found');
        }

        const products = productCategory.products.filter(
            (product) =>
                product.store_id === storeId &&
                product.status === ProductStatus.PUBLISHED &&
                product.store_id
        );
        return productCategory.products;
    }

    /**
     * Fetches all product categories along with their associated products, variants, prices, and reviews.
     *
     * 1. Retrieves product categories from the repository, including their related products, product variants, prices, and reviews.
     * 2. Filters out unpublished products or products without a store ID.
     * 3. Removes categories that have no associated products after filtering.
     * 4. Converts the product prices based on the appropriate currency.
     * 5. Returns the filtered list of categories with their corresponding products.
     *
     * @returns {Array} - A list of product categories with associated products and their updated prices.
     * @throws {Error} - If there is an issue fetching the categories or updating prices.
     */
    async getAllProductCategories() {
        try {
            // Fetch categories along with related products, variants, prices, and reviews
            const productCategories =
                await this.productCategoryRepository_.find({
                    select: ['id', 'name', 'metadata'],
                    relations: [
                        'products',
                        'products.variants.prices',
                        'products.reviews',
                    ],
                });

            //remove products that aren't published
            for (let cat of productCategories) {
                if (cat.products)
                    cat.products = cat.products.filter(
                        (p) => p.status == ProductStatus.PUBLISHED && p.store_id
                    );
            }

            // Filter out categories that have no associated products that are published
            const filteredCategories = productCategories.filter(
                (category) => category.products && category.products.length > 0
            );

            //convert price currencies as needed
            await Promise.all(
                filteredCategories.map((cat) =>
                    this.convertPrices(cat.products)
                )
            );

            return filteredCategories; // Return the filtered categories
        } catch (error) {
            this.logger.error(
                'Error fetching product categories with prices:',
                error
            );
            throw new Error('Failed to fetch product categories with prices.');
        }
    }

    /**
     * Fetches all products for a specific category by category name.
     *
     * 1. Retrieves all product categories from the repository, including related products, product variants, prices, and reviews.
     * 2. Filters the categories by the provided category name.
     * 3. Filters products within the selected category by status 'published' and ensures each product has a valid store ID.
     * 4. Updates the product pricing for the filtered products.
     * 5. Returns the filtered list of products for the specified category.
     *
     * @param {string} categoryName - The category to filter products by.
     * @returns {Array} - A list of products for the specified category with updated prices.
     * @throws {Error} - If there is an issue fetching the products or updating prices.
     */
    async getAllProductByCategory(categoryName: string) {
        try {
            if (categoryName.toLowerCase() === 'all') {
                const products = await this.convertPrices(
                    await this.productRepository_.find({
                        relations: ['variants.prices', 'reviews'],
                        where: {
                            status: ProductStatus.PUBLISHED,
                            store_id: Not(IsNull()),
                        },
                    })
                );

                return products;
            }

            const categories = await this.productCategoryRepository_.find({
                select: ['id', 'name', 'metadata'],
                relations: [
                    'products',
                    'products.variants.prices',
                    'products.reviews',
                ],
            });

            let filteredCategories = categories;

            //Filter for the specific category
            filteredCategories = categories.filter(
                (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
            );

            // Filter products for the category (or all categories) by storeId and status 'published'
            const filteredProducts = filteredCategories.map((cat) => {
                return {
                    ...cat,
                    products: cat.products.filter(
                        (product) =>
                            product.status === ProductStatus.PUBLISHED &&
                            product.store_id
                    ),
                };
            });

            // Update product pricing
            await Promise.all(
                filteredProducts.map((cat) => this.convertPrices(cat.products))
            );

            return filteredProducts; // Return all product data
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products by handle:',
                error
            );
            throw new Error('Failed to fetch products by handle.');
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
                where: {
                    store_id: store.id,
                    status: ProductStatus.PUBLISHED,
                },
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
                numberOfFollowers: store.store_followers,
                description: store.store_description,
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

    private async convertPrices(
        products: Product[],
        customerId: string = ''
    ): Promise<Product[]> {
        for (const prod of products) {
            for (const variant of prod.variants) {
                const strategy: PriceSelectionStrategy =
                    new PriceSelectionStrategy({
                        customerService: this.customerService_,
                        productVariantRepository:
                            this.productVariantRepository_,
                        logger: this.logger,
                    });
                const results = await strategy.calculateVariantPrice(
                    [{ variantId: variant.id, quantity: 1 }],
                    { customer_id: customerId }
                );
                if (results.has(variant.id))
                    variant.prices = results.get(variant.id).prices;
            }
        }

        return products;
    }
}

export default ProductService;
