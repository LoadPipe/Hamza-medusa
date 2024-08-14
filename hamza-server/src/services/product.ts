import { Lifetime } from 'awilix';
import {
    ProductService as MedusaProductService,
    Logger,
    ProductVariant,
    PriceSelectionResult,
    MoneyAmount,
    Image,
    ProductVariantMoneyAmount,
} from '@medusajs/medusa';
import {
    CreateProductInput,
    CreateProductProductSalesChannelInput,
    CreateProductProductVariantPriceInput,
    FindProductConfig,
    ProductSelector,
} from '@medusajs/medusa/dist/types/product';
import { Product } from '../models/product';
import logger from '@medusajs/medusa-cli/dist/reporter';
import { StoreRepository } from '../repositories/store';
import PriceSelectionStrategy from '../strategies/price-selection';
import CustomerService from '../services/customer';
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
    protected readonly customerService_: CustomerService;
    private buckyClient: BuckyClient;

    constructor(container) {
        super(container);
        this.logger = container.logger;
        this.storeRepository_ = container.storeRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.customerService_ = container.customerService;
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
            const moneyAmounts = [];
            const variantMoneyAmounts = [];

            for (const price of prices) {
                // Create a MoneyAmount entity for each currency
                const currencies = ['eth', 'usdc', 'usdt'];

                for (const currency of currencies) {
                    const moneyAmount = moneyAmountRepo.create({
                        currency_code: currency,
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

    async bulkImportProducts(
        productsData: CreateProductInput[]
    ): Promise<Product[]> {
        try {
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
                async (savedProduct) => {
                    const variantData = {
                        title: savedProduct.title,
                        product_id: savedProduct.id,
                        inventory_quantity: 10,
                        allow_backorder: false,
                        manage_inventory: true,
                    };

                    const variant =
                        this.productVariantRepository_.create(variantData);
                    const savedVariant =
                        await this.productVariantRepository_.save(variant);

                    // Define the prices for the variant in different currencies
                    const prices = [
                        { currency_code: 'eth', amount: 1000 },
                        { currency_code: 'usdc', amount: 1200 },
                        { currency_code: 'usdt', amount: 1300 },
                    ];

                    // Update prices for the variant
                    await this.updateVariantPrice(savedVariant.id, prices);

                    return savedVariant;
                }
            );

            // Wait for all variants to be created and priced
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

    async getProductsFromStoreWithPrices(storeId: string): Promise<Product[]> {
        return await this.convertPrices(
            await this.productRepository_.find({
                where: { store_id: storeId },
                relations: ['variants.prices', 'reviews'],
            })
        );
    }

    async getAllProductsFromStoreWithPrices(): Promise<Product[]> {
        const products = await this.convertPrices(
            await this.productRepository_.find({
                relations: ['variants.prices', 'reviews'],
            })
        );

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

    private mapBuckyDataToProductInput(
        item: any,
        status: ProductStatus,
        storeId: string,
        collectionId: string,
        salesChannels: string[]
    ) {
        console.log(salesChannels);
        return {
            title: item.productName,
            handle: item.spuCode,
            description: item.productName,
            is_giftcard: false,
            status: status as ProductStatus,
            thumbnail: item.picUrl,
            images: [item.picUrl],
            collection_id: collectionId,
            weight: Math.round(item.weight || 100),
            discountable: true,
            store_id: storeId,
            sales_channels: salesChannels.map(sc => { return { id: sc } }),
            bucky_metadata: JSON.stringify(item)
        };
    }

    private async convertPrices(products: Product[], customerId: string = ''): Promise<Product[]> {
        for (const prod of products) {
            for (const variant of prod.variants) {
                const strategy: PriceSelectionStrategy = new PriceSelectionStrategy({
                    customerService: this.customerService_,
                    productVariantRepository: this.productVariantRepository_,
                    logger: this.logger
                });
                const results = await strategy.calculateVariantPrice(
                    [{ variantId: variant.id, quantity: 1 }],
                    { customer_id: customerId }
                );
                if (results.has(variant.id))
                    variant.prices = results.get(variant.id).prices;
            }
        }

        return products
    }
}

export default ProductService;
