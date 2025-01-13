import { Lifetime } from 'awilix';
import {
    ProductService as MedusaProductService,
    Logger,
    MoneyAmount,
    ProductVariantMoneyAmount,
    Store,
    ProductStatus,
    ProductCategory,
} from '@medusajs/medusa';
import axios from 'axios';
import {
    CreateProductInput as MedusaCreateProductInput,
    CreateProductProductVariantPriceInput,
} from '@medusajs/medusa/dist/types/product';
import { Product } from '../models/product';
import { ProductVariant } from '@medusajs/medusa';
import { StoreRepository } from '../repositories/store';
import { CachedExchangeRateRepository } from '../repositories/cached-exchange-rate';
import PriceSelectionStrategy from '../strategies/price-selection';
import CustomerService from '../services/customer';
import { ProductVariantRepository } from '../repositories/product-variant';
import { In, IsNull, Not } from 'typeorm';
import { createLogger, ILogger } from '../utils/logging/logger';
import { SeamlessCache } from '../utils/cache/seamless-cache';
import { filterDuplicatesById } from '../utils/filter-duplicates';
import { PriceConverter } from '../utils/price-conversion';
import { getCurrencyPrecision } from '../currency.config';
import fs from 'fs';
import csv from 'csv-parser';
import * as readline from 'readline';
import ProductVariantService from './product-variant';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

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

// Define the expected structure of the data
export type csvProductData = {
    category: string; // category handle from DB
    images: string;
    title: string;
    subtitle: string;
    description: string;
    status: ProductStatus; // 'draft' or 'published'
    thumbnail: string;
    discountable: string; // '0' or '1'
    weight: number;
    handle: string; // must be unique from DB and other rows from csv
    variant: string; // Size[XL] | Color[White] | Gender[Male]
    variant_price: number;
    variant_inventory_quantity: number;
    variant_allow_backorder: string; // '0' or '1'
    variant_manage_inventory: string; // '0' or '1'
    variant_sku?: string;
    variant_barcode?: string;
    variant_ean?: string;
    variant_upc?: string;
    variant_hs_code?: string;
    variant_origin_country?: string;
    variant_mid_code?: string;
    variant_material?: string;
    variant_weight?: number;
    variant_length?: number;
    variant_height?: number;
    variant_width?: number;
    category_id?: string; // optional: created when data is valid, and retrieved from DB
    invalid_error?: string; // optional: created when data is invalid, and indicates the type of error
};

export type Price = {
    currency_code: string;
    amount: number;
};

type UpdateProductInput = Omit<Partial<CreateProductInput>, 'variants'> & {
    variants?: UpdateProductProductVariantDTO[];
};

class ProductService extends MedusaProductService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly cacheExchangeRateRepository: typeof CachedExchangeRateRepository;
    protected readonly customerService_: CustomerService;
    protected readonly productVariantService_: ProductVariantService;
    protected readonly priceConverter_: PriceConverter;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'ProductService');
        this.storeRepository_ = container.storeRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.cacheExchangeRateRepository =
            container.cachedExchangeRateRepository;
        this.customerService_ = container.customerService;
        this.productVariantService_ = container.productVariantService;
        this.priceConverter_ = new PriceConverter(
            this.logger,
            this.cacheExchangeRateRepository
        );
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

    // get all products from product table
    async reindexProducts() {
        try {
            // Fetch all products
            const products = await this.productRepository_.find();

            // Handle empty product list
            if (products.length === 0) {
                this.logger.info('No products found to index.');
                return;
            }

            const cleanProducts = products.map((product) => ({
                id: product.id,
                title: product.title,
                description: product.description.replace(/<[^>]*>/g, ''), // Strip HTML
                thumbnail: product.thumbnail,
                handle: product.handle,
                status: product.status, // Include status for all products, including drafts
            }));

            // Prepare the HTTP request headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
                },
            };

            // URL of the Meilisearch API
            const url = 'http://localhost:7700/indexes/products/documents';

            // Send products to be indexed
            const indexResponse = await axios.post(url, cleanProducts, config);

            // Check if the indexing was successful
            if (indexResponse.status === 200 || indexResponse.status === 202) {
                this.logger.info(
                    `Reindexed ${cleanProducts.length} products successfully.`
                );
            } else {
                this.logger.error(
                    'Failed to index products:',
                    indexResponse.status
                );
                return;
            }

            // Delete drafts immediately after reindexing
            const deleteResponse = await axios.post(
                'http://localhost:7700/indexes/products/documents/delete',
                { filter: 'status = draft' },
                config
            );
            // Check if the deletion was successful
            if (
                deleteResponse.status === 200 ||
                deleteResponse.status === 202
            ) {
                this.logger.info(
                    'Draft products have been removed from the index.'
                );
            } else {
                this.logger.error(
                    'Failed to delete draft products:',
                    deleteResponse.status
                );
            }
        } catch (e) {
            this.logger.error('Error reindexing products:', e);
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
            this.logger.error('Error in bulk importing products:', error);
            throw error;
        }
    }

    async getProductsFromStoreWithPrices(storeId: string): Promise<Product[]> {
        return this.convertProductPrices(
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

    async getAllProductsWithPrices(): Promise<Product[]> {
        const products = await this.convertProductPrices(
            await this.productRepository_.find({
                relations: ['variants.prices', 'reviews'],
                where: {
                    status: ProductStatus.PUBLISHED,
                    store_id: Not(IsNull()),
                },
            })
        );

        //TODO: sort alphabetically by title
        const sortedProducts = products
            .sort((a, b) => {
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
                relations: ['variants'],
            })
        ).filter((p) => p.variants?.length);
    }

    async getCategoriesByStoreId(storeId: string): Promise<string[]> {
        try {
            const getAllProducts = await categoryCache.retrieve(
                this.productCategoryRepository_
            );
            const filterdProductsByStoreId = getAllProducts.filter((c) =>
                c.products.find((p) => p.store_id === storeId)
            );

            const uniqueCategoryNames = Array.from(
                new Set(
                    filterdProductsByStoreId.map((category) => category.name)
                )
            );

            return uniqueCategoryNames;
        } catch (error) {
            this.logger.error('Error fetching categories by store ID:', error);
            throw new Error(
                'Failed to fetch categories for the specified store.'
            );
        }
    }

    async getCategoriesByStoreId2(storeId: string): Promise<ProductCategory[]> {
        try {
            const categories = await categoryCache.retrieve(
                this.productCategoryRepository_
            );
            return categories.filter((c) =>
                c.products.find((p) => p.store_id === storeId)
            );
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
                return this.getProductsFromStoreWithPrices(storeId);
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
                filteredProducts.map((cat) =>
                    this.convertProductPrices(cat.products)
                )
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
    async getAllProductCategories(): Promise<ProductCategory[]> {
        try {
            return await categoryCache.retrieve(
                this.productCategoryRepository_
            );
        } catch (error) {
            this.logger.error(
                'Error fetching product categories with prices:',
                error
            );
            throw new Error('Failed to fetch product categories with prices.');
        }
    }

    /**
     * Filters products based on selected categories, upper price limit, and lower price limit.
     *
     * @param {string[]} categories - An array of category names to filter products by.
     * @param {number} upperPrice - The upper price limit for filtering products.
     * @param {number} lowerPrice - The lower price limit for filtering products.
     * @param {number} lowerPrice - Optional param to filter further by store.
     * @returns {Array} - A list of products filtered by the provided criteria.
     */
    async getFilteredProducts(
        categories: string[], // Array of strings representing category names
        upperPrice: number = 0, // Number representing the upper price limit
        lowerPrice: number = 0, // Number representing the lower price limit
        filterCurrencyCode: string = 'usdc',
        storeId?: string
    ) {
        try {
            //prepare category names for query
            let normalizedCategoryNames = categories.map((name) =>
                name.toLowerCase().replace('-', ' ')
            );
            if (
                normalizedCategoryNames.length > 1 &&
                normalizedCategoryNames[0] === 'all'
            )
                normalizedCategoryNames = normalizedCategoryNames.slice(1);

            const key = normalizedCategoryNames.sort().join(',');

            if (filterCurrencyCode === 'eth') {
                const factor = Math.pow(10, getCurrencyPrecision('usdc').db);
                upperPrice = await this.priceConverter_.convertPrice(
                    upperPrice * factor,
                    'usdc',
                    'eth'
                );
                lowerPrice = await this.priceConverter_.convertPrice(
                    lowerPrice * factor,
                    'usdc',
                    'eth'
                );
            } else {
                const factor = Math.pow(
                    10,
                    getCurrencyPrecision(filterCurrencyCode).db
                );
                upperPrice = upperPrice * factor;
                lowerPrice = lowerPrice * factor;
            }

            //retrieve products from cache
            let products = await productFilterCache.retrieveWithKey(key, {
                categoryRepository: this.productCategoryRepository_,
                categoryNames: normalizedCategoryNames,
                upperPrice,
                lowerPrice,
                filterCurrencyCode,
                convertProductPrices: async (prods) => {
                    return this.convertProductPrices(prods);
                },
            });

            //filter by store id if provided
            if (storeId) {
                products = products.filter((p) => p.store_id === storeId);
            }

            return products;
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products by handle:',
                error
            );
            throw new Error('Failed to fetch products by handle.');
        }
    }

    async getProductCollection(productIds: string[]) {
        try {
            // Fetch products with matching IDs
            const products = await this.productRepository_.find({
                where: {
                    id: In(productIds),
                },
                relations: ['variants.prices'],
            });

            // Update product pricing

            let updatedProducts = await this.convertProductPrices(products);

            return updatedProducts;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products.');
        }
    }

    async getProductsForStore(store: Store) {
        try {
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

    async getProductsForMeilisearchIndex(): Promise<any[]> {
        const products = await this.getAllProductsWithPrices();
        return products.map((p) => {
            return {
                id: p.id,
                handle: p.handle,
                title: p.title,
                description: p.description,
                thumbnail: p.thumbnail,
            };
        });
    }

    async convertVariantPrice(
        variant: ProductVariant,
        customerId: string = ''
    ): Promise<ProductVariant> {
        const strategy = new PriceSelectionStrategy({
            customerService: this.customerService_,
            productVariantRepository: this.productVariantRepository_,
            logger: this.logger,
            cachedExchangeRateRepository: this.cacheExchangeRateRepository,
        });

        const results = await strategy.calculateVariantPrice(
            [{ variantId: variant.id, quantity: 1 }],
            { customer_id: customerId }
        );

        if (results.has(variant.id)) {
            variant.prices = results.get(variant.id).prices;
        }

        return variant;
    }

    private async convertProductPrices(
        products: Product[],
        customerId: string = ''
    ): Promise<Product[]> {
        const strategy: PriceSelectionStrategy = new PriceSelectionStrategy({
            customerService: this.customerService_,
            productVariantRepository: this.productVariantRepository_,
            logger: this.logger,
            cachedExchangeRateRepository: this.cacheExchangeRateRepository,
        });
        for (const prod of products) {
            for (const variant of prod.variants) {
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

    async deleteProductById(productId: string): Promise<void> {
        await this.delete(productId);
    }

    async getCategoryByHandle(
        categoryHandle: string
    ): Promise<ProductCategory | null> {
        try {
            const category = await this.productCategoryRepository_.findOne({
                where: { handle: categoryHandle },
            });

            return category || null;
        } catch (error) {
            this.logger.error(
                'Error fetching product category by handle:',
                error
            );
            throw new Error('Failed to fetch product category by handle.');
        }
    }

    async getProductByHandle(productHandle: string): Promise<Product | null> {
        try {
            const product = await this.productRepository_.findOne({
                where: { handle: productHandle },
            });

            return product || null;
        } catch (error) {
            this.logger.error('Error fetching product by handle:', error);
            throw new Error('Failed to fetch product by handle.');
        }
    }

    async getProductById(productId: string): Promise<Product | null> {
        try {
            const product = await this.productRepository_.findOne({
                where: { id: productId },
            });

            return product || null;
        } catch (error) {
            this.logger.error('Error fetching product by id:', error);
            throw new Error('Failed to fetch product by id.');
        }
    }

    async parseCsvFile(filePath: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const fileRows: any[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    fileRows.push(row);
                })
                .on('end', () => {
                    fs.unlinkSync(filePath);
                    resolve(fileRows);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    async validateCategory(categoryHandle: string): Promise<string | null> {
        const category_ = await this.getCategoryByHandle(categoryHandle);
        return category_ ? category_.id : null;
    }

    async validateCsv(
        filePath: string,
        requiredCsvHeadersForProduct: string[]
    ): Promise<{ success: boolean; message: string }> {
        const validationErrors = [];
        const fileRows = [];

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            fileRows.push(line);
        }

        const rowCount = fileRows.length;

        if (rowCount < 2) {
            validationErrors.push({
                error: 'CSV file must contain more than 2 rows',
            });
        } else {
            const headerRow = fileRows[0].split(',');
            const missingHeaders = requiredCsvHeadersForProduct.filter(
                (header) => !headerRow.includes(header)
            );
            if (missingHeaders.length > 0) {
                validationErrors.push({
                    error: `Missing headers in header row: ${missingHeaders.join(', ')}`,
                });
            }
        }
        return {
            success: validationErrors.length === 0,
            message: validationErrors.map((err) => err.error).join(', '),
        };
    }

    /**
     * validate data and return valid and invalid data
     * @param productService
     * @param data
     * @returns
     */
    async validateCsvData(
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[]
    ): Promise<{
        success: boolean;
        message: string;
        validData: csvProductData[];
        invalidData: csvProductData[];
    }> {
        const invalidData: csvProductData[] = [];
        const validData: csvProductData[] = [];

        // validates each row, and returns invalid data if any
        for (const row of data) {
            const validationError = await this.validateCsvRow(
                data,
                row,
                requiredCsvHeadersForProduct,
                requiredCsvHeadersForVariant
            );
            if (validationError) {
                row['invalid_error'] = validationError;
                invalidData.push(row);
            } else {
                validData.push(row);
            }
        }

        const success = validData.length > 0;
        const message =
            invalidData.length > 0
                ? 'Contains SOME valid data'
                : 'Contains valid data';

        return {
            success,
            message: success ? message : 'Contains invalid data',
            validData,
            invalidData,
        };
    }

    async csvRowIsVariant(
        row: csvProductData,
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForProduct: string[]
    ): Promise<boolean> {
        const isVariant =
            requiredCsvHeadersForVariant.every((header) => row[header]) &&
            requiredCsvHeadersForProduct.every(
                (header) =>
                    !row[header] ||
                    requiredCsvHeadersForVariant.includes(header)
            );
        return isVariant;
    }

    async filterCsvProductRows(
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[]
    ): Promise<csvProductData[]> {
        return data.filter(
            (item) =>
                requiredCsvHeadersForProduct.every((header) => item[header]) &&
                requiredCsvHeadersForVariant.every(
                    (header) =>
                        !item[header] ||
                        requiredCsvHeadersForProduct.includes(header)
                )
        );
    }

    async validateCsvRow(
        data: csvProductData[],
        row: csvProductData,
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[]
    ): Promise<string | null> {
        // determine if this is a product row or variant
        // then, validate accordingly.
        const isVariant = await this.csvRowIsVariant(
            row,
            requiredCsvHeadersForVariant,
            requiredCsvHeadersForProduct
        );
        // console.log('isVariant: ' + isVariant);

        if (isVariant) {
            if (requiredCsvHeadersForVariant.some((header) => !row[header])) {
                return 'required variant fields missing data';
            }
            return await this.validateCsvVariantRow(row, data);
        } else {
            if (requiredCsvHeadersForProduct.some((header) => !row[header])) {
                const missingHeader = requiredCsvHeadersForProduct.find(
                    (header) => !row[header]
                );
                return 'required product fields missing data: ' + missingHeader;
            }

            return await this.validateCsvProductRow(
                row,
                data,
                requiredCsvHeadersForProduct,
                requiredCsvHeadersForVariant
            );
        }
    }

    async validateCsvProductRow(
        row: csvProductData,
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[]
    ): Promise<string | null> {
        const productRows = await this.filterCsvProductRows(
            data,
            requiredCsvHeadersForProduct,
            requiredCsvHeadersForVariant
        );
        // console.log('productRows: ' + JSON.stringify(productRows));

        const categoryId = await this.validateCategory(row['category']);
        if (!categoryId) {
            return 'category handle does not exist';
        }
        row['category_id'] = categoryId;

        if (
            ![ProductStatus.DRAFT, ProductStatus.PUBLISHED].includes(
                row['status']
            )
        ) {
            return 'status is not valid, status must be draft or published';
        }

        if (!Number.isInteger(Number(row['weight']))) {
            return 'weight must be a whole number';
        }

        if (!['0', '1'].includes(row['discountable'])) {
            return 'discountable must be a 0 or 1';
        }

        if (!Number.isInteger(Number(row['variant_price']))) {
            return 'variant price must be a whole number';
        }

        if (!Number.isInteger(Number(row['variant_inventory_quantity']))) {
            return 'variant inventory quantity must be a whole number';
        }

        if (!['0', '1'].includes(row['variant_allow_backorder'])) {
            return 'variant allow backorder must be a 0 or 1';
        }

        if (!['0', '1'].includes(row['variant_manage_inventory'])) {
            return 'variant manage inventory must be a 0 or 1';
        }

        const product = await this.getProductByHandle(row['handle']);
        if (product) {
            return 'product handle must be unique';
        }

        // check if handle is unique from other product rows
        const handleExistsInProducts = productRows.some(
            (item) => item !== row && item['handle'] === row['handle']
        );
        if (handleExistsInProducts) {
            return 'handle must be unique from other product rows';
        }

        // check if thumbnail is a valid url
        // if (!row['thumbnail'].startsWith('http')) {
        //     return 'thumbnail must be a valid url';
        // }

        // check if thumbnail is a valid image
        // if (
        //     !row['thumbnail'].endsWith('.jpg') &&
        //     !row['thumbnail'].endsWith('.png') &&
        //     !row['thumbnail'].endsWith('.jpeg') &&
        //     !row['thumbnail'].endsWith('.svg') &&
        //     !row['thumbnail'].endsWith('.gif')
        // ) {
        //     return 'thumbnail must be a valid image';
        // }

        await this.validateCsvVariantRow(row, data);

        return null;
    }

    async validateCsvVariantRow(
        row: csvProductData,
        data: csvProductData[]
    ): Promise<string | null> {
        // START: check if barcode is unique
        if (row['variant_barcode'] && row['variant_barcode'].trim() !== '') {
            const productVariantBarcode =
                await this.productVariantService_.getVariantByBarcode(
                    row['variant_barcode']
                );
            if (productVariantBarcode) {
                return 'barcode must be unique';
            }

            const barcodeExistsInVariants = data.some(
                (item) =>
                    item !== row &&
                    item['variant_barcode'] === row['variant_barcode']
            );
            if (barcodeExistsInVariants) {
                return 'barcode must be unique from other rows';
            }
        }
        // END: check if barcode is unique

        // START: check if sku is unique
        if (row['variant_sku'] && row['variant_sku'].trim() !== '') {
            const productVariantSku =
                await this.productVariantService_.getVariantBySku(
                    row['variant_sku']
                );
            if (productVariantSku) {
                return 'sku must be unique';
            }

            const skuExistsInVariants = data.some(
                (item) =>
                    item !== row && item['variant_sku'] === row['variant_sku']
            );
            if (skuExistsInVariants) {
                return 'sku must be unique from other rows';
            }
        }
        // END: check if sku is unique

        // START: check if upc is unique
        if (row['variant_upc'] && row['variant_upc'].trim() !== '') {
            const productVariantUpc =
                await this.productVariantService_.getVariantByUpc(
                    row['variant_upc']
                );
            if (productVariantUpc) {
                return 'upc must be unique';
            }

            const upcExistsInVariants = data.some(
                (item) =>
                    item !== row && item['variant_upc'] === row['variant_upc']
            );
            if (upcExistsInVariants) {
                return 'upc must be unique from other rows';
            }
        }
        // END: check if upc is unique

        // START: check if ean is unique
        if (row['variant_ean'] && row['variant_ean'].trim() !== '') {
            const productVariantEan =
                await this.productVariantService_.getVariantByEan(
                    row['variant_ean']
                );
            if (productVariantEan) {
                return 'ean must be unique';
            }

            const eanExistsInVariants = data.some(
                (item) =>
                    item !== row && item['variant_ean'] === row['variant_ean']
            );
            if (eanExistsInVariants) {
                return 'ean must be unique from other rows';
            }
        }
        // END: check if ean is unique

        if (!Number.isInteger(Number(row['variant_price']))) {
            return 'variant price must be a whole number';
        }

        if (!Number.isInteger(Number(row['variant_inventory_quantity']))) {
            return 'variant inventory quantity must be a whole number';
        }

        if (!['0', '1'].includes(row['variant_allow_backorder'])) {
            return 'variant allow backorder must be a 0 or 1';
        }

        if (!['0', '1'].includes(row['variant_manage_inventory'])) {
            return 'variant manage inventory must be a 0 or 1';
        }

        return null;
    }

    async getPricesForVariant(
        baseAmount: number,
        baseCurrency: string
    ): Promise<Price[]> {
        //TODO: get from someplace global
        const currencies = ['eth', 'usdc', 'usdt'];
        const prices = [];

        // console.log("baseCurrency: " + baseCurrency);
        // console.log("baseAmount: " + baseAmount);

        for (const currency of currencies) {
            const price = await this.priceConverter_.getPrice({
                baseAmount,
                baseCurrency: baseCurrency,
                toCurrency: currency,
            });
            // console.log("price: " + price);
            prices.push({
                currency_code: currency,
                amount: price,
            });
        }
        //console.log(prices);
        //this.logger.debug(prices);
        return prices;
    }
}

/**
 * See SeamlessCache
 *
 * This implementation of SeamlessCache caches product categories together with products,
 * since it's a slow query.
 */
class CategoryCache extends SeamlessCache {
    constructor() {
        super(parseInt(process.env.CATEGORY_CACHE_EXPIRATION_SECONDS ?? '300'));
    }

    async retrieve(params?: any): Promise<ProductCategory[]> {
        return super.retrieve(params);
    }

    protected async getData(
        productCategoryRepository: any
    ): Promise<ProductCategory[]> {
        const categories = await productCategoryRepository.find({
            select: ['id', 'name', 'metadata', 'handle'],
            relations: [
                'products',
                'products.variants.prices',
                'products.reviews',
            ],
        });

        //remove products that aren't published
        for (let cat of categories) {
            if (cat.products)
                cat.products = cat.products.filter(
                    (p) => p.status == ProductStatus.PUBLISHED && p.store_id
                );
        }

        // Filter out categories that have no associated products that are published
        const filteredCategories = categories.filter(
            (category) => category.products && category.products.length > 0
        );

        return filteredCategories;
    }
}

/**
 * See SeamlessCache
 *
 * This implementation of SeamlessCache caches the entire output of getFilteredProducts, since it's a slow
 * query that runs often.
 */
class ProductFilterCache extends SeamlessCache {
    constructor() {
        super(parseInt(process.env.PRODUCT_CACHE_EXPIRATION_SECONDS ?? '300'));
    }

    async retrieveWithKey(key?: string, params?: any): Promise<Product[]> {
        let products = await super.retrieveWithKey(key, params);

        if (params.upperPrice !== 0 && params.lowerPrice >= 0) {
            products = products.filter((product) => {
                const price =
                    product.variants[0]?.prices.find(
                        (p) => p.currency_code === params.filterCurrencyCode
                    )?.amount ?? 0;
                return price >= params.lowerPrice && price <= params.upperPrice;
            });

            // Sort the products by price (assuming the price is in the first variant and the first price in each variant)
            products = products.sort((a, b) => {
                const priceA =
                    a.variants[0]?.prices.find(
                        (p) => p.currency_code === params.filterCurrencyCode
                    )?.amount ?? 0;
                const priceB =
                    b.variants[0]?.prices.find(
                        (p) => p.currency_code === params.filterCurrencyCode
                    )?.amount ?? 0;
                return priceA - priceB; // Ascending order
            });
        } else {
            products = products.sort((a, b) => {
                const rankA = a.display_rank ?? 0;
                const rankB = b.display_rank ?? 0;
                return rankB - rankA;
            });
        }

        return products;
    }

    protected async getData(params: any): Promise<any> {
        let products: Product[] = [];

        //get categories from cache
        const productCategories = await categoryCache.retrieve(
            params.categoryRepository
        );

        if (params.categoryNames[0] === 'all') {
            //remove products that aren't published
            products = productCategories.flatMap((cat) =>
                cat.products.filter(
                    (p) => p.status === ProductStatus.PUBLISHED && p.store_id
                )
            );
        } else {
            // Filter the categories based on the provided category names
            const filteredCategories = productCategories.filter((cat) =>
                params.categoryNames.includes(cat.name.toLowerCase())
            );

            // Gather all the products into a single list
            products = filteredCategories.flatMap((cat) =>
                cat.products.filter(
                    (p) => p.status === ProductStatus.PUBLISHED && p.store_id
                )
            );
        }

        //remove duplicates
        products = filterDuplicatesById(products);

        // Update product pricing
        await params.convertProductPrices(products);

        return products; // Return filtered products
    }
}

// GLOBAL CACHES
const categoryCache: CategoryCache = new CategoryCache();
const productFilterCache: ProductFilterCache = new ProductFilterCache();

export default ProductService;
