import { Lifetime } from 'awilix';
import {
    ProductService as MedusaProductService,
    Logger,
    MoneyAmount,
    ProductVariantMoneyAmount,
    Store,
} from '@medusajs/medusa';
import {
    CreateProductInput,
    CreateProductProductVariantPriceInput,
} from '@medusajs/medusa/dist/types/product';
import { Product } from '../models/product';
import { StoreRepository } from '../repositories/store';
import PriceSelectionStrategy, { PriceConverter } from '../strategies/price-selection';
import CustomerService from '../services/customer';
import { ProductVariantRepository } from '../repositories/product-variant';
import { BuckyClient } from '../buckydrop/bucky-client';
import { getCurrencyAddress } from '../currency.config';

export type BulkImportProductInput = CreateProductInput & { price: number };

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

    async bulkImportProducts(
        storeId: string,
        productData: BulkImportProductInput[],
    ): Promise<Product[]> {
        try {
            const priceConverter: PriceConverter = new PriceConverter();

            console.log("products to import:")
            console.log(productData);

            const addedProducts = await Promise.all(
                productData.map((product) =>
                    super.create(product)
                )
            );

            // Ensure all products have valid IDs
            const validProducts = addedProducts.filter((p) => p && p.id);
            if (validProducts.length !== addedProducts.length) {
                throw new Error('Some products were not created successfully');
            }

            //get the store 
            const store: Store = await this.storeRepository_.findOne({
                where: { id: storeId }
            });

            if (!store) {
                throw new Error(`Store ${storeId} not found.`);
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

                    //get the correct price
                    const input = productData.find(pd => pd.handle == savedProduct.handle);
                    if (input) {
                        // Define the prices for the variant in different currencies
                        const prices = [
                            {
                                currency_code: 'eth', amount: await priceConverter.getPrice(
                                    { baseAmount: input.price, baseCurrency: 'usdc', toCurrency: 'eth' }
                                )
                            },
                            {
                                currency_code: 'usdc', amount: await priceConverter.getPrice(
                                    { baseAmount: input.price, baseCurrency: 'usdc', toCurrency: 'usdc' }
                                )
                            },
                            {
                                currency_code: 'usdt', amount: await priceConverter.getPrice(
                                    { baseAmount: input.price, baseCurrency: 'usdc', toCurrency: 'usdt' }
                                )
                            },
                        ];

                        // Update prices for the variant
                        await this.updateVariantPrice(savedVariant.id, prices);
                    }

                    return savedVariant;
                });

            // Wait for all variants to be created and priced;
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
