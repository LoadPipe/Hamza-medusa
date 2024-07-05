import { TransactionBaseService, Logger } from '@medusajs/medusa';
import { Lifetime } from 'awilix';
import { ProductReviewRepository } from '../repositories/product-review';
import { ProductReview } from '../models/product-review';
import { Customer } from '../models/customer';
import { ProductVariantRepository } from '../repositories/product-variant';
import { Product } from '../models/product';

class ProductReviewService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly productReviewRepository_: typeof ProductReviewRepository;
    protected readonly logger: Logger;

    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
        this.productReviewRepository_ = container.productReviewRepository;
        this.logger = container.logger;
    }

    async customerIsVerified(customer_id) {
        const customerRepository = this.activeManager_.getRepository(Customer);
        this.logger.debug(`Customer ID is: ${customer_id}`);
        const customer = await customerRepository.findOne({
            where: { id: customer_id },
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        this.logger.debug(`Customer Email is: ${customer.email}`);

        // Returns true if the email does NOT include '@evm.blockchain'
        return customer.email.includes('@evm.blockchain');
    }

    async customerHasBoughtProduct(customer_id, product_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const productReview = await productReviewRepository.find({
            where: { product_id, customer_id },
        });

        if (!productReview) {
            this.logger.debug(
                `No product review found for product_id: ${product_id} and customer_id: ${customer_id}`
            );
            return null;
        }

        return !!productReview;
    }

    async customerHasLeftReview(order_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const productReviews = await productReviewRepository.find({
            where: { order_id: order_id },
        });
        this.logger.debug(`productReviews: ${JSON.stringify(productReviews)}`);

        if (productReviews.length === 0) {
            this.logger.debug(
                `No product review found for order_id: ${order_id}`
            );
            return true;
        }

        return false;
    }

    async getSpecificReview(order_id, product_id) {
        let productId;

        try {
            const variantProduct = await this.productVariantRepository_.findOne(
                {
                    where: { id: product_id }, // Assuming product_id is the ID of the variant
                }
            );

            if (!variantProduct) {
                throw new Error('Product variant not found');
            }

            productId = variantProduct.product_id; // This assumes that variantProduct actually contains a product_id
        } catch (e) {
            this.logger.error(`Error fetching product variant: ${e}`);
            throw e; // Rethrow or handle the error appropriately
        }

        // Ensure productId was successfully retrieved before proceeding
        if (!productId) {
            throw new Error('Unable to retrieve product ID for the review');
        }

        try {
            const productReviewRepository =
                this.activeManager_.getRepository(ProductReview);
            const productReview = await productReviewRepository.findOne({
                where: { order_id, product_id: productId },
            });

            const { content, rating } = productReview;

            return { content, rating };
        } catch (e) {
            this.logger.error(`Error fetching specific review: ${e}`);
            throw e;
        }
    }

    async getReviews(product_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id },
            relations: { customer: true },
            select: {
                customer: {
                    first_name: true,
                    last_name: true,
                },
            },
        });

        if (!reviews) {
            throw new Error('No reviews found');
        }

        return reviews;
    }

    async getCustomerReviews(product_id, customer_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id, customer_id },
        });

        if (!reviews) {
            throw new Error('No reviews found');
        }

        return reviews;
    }

    async getAllCustomerReviews(customer_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const reviews = await productReviewRepository.find({
            where: { customer_id },
        });

        if (!reviews) {
            throw new Error('No reviews found');
        }

        return reviews;
    }

    async getReviewCount(product_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id },
        });

        if (!reviews) {
            throw new Error('No reviews found');
        }

        return reviews.length;
    }

    async getAverageRating(product_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id },
        });

        if (!reviews) {
            throw new Error('No reviews found');
        }

        const averageRating =
            reviews.reduce((acc: any, review: any) => acc + review.rating, 0) /
            reviews.length;

        this.logger.debug(`The average rating is: ${averageRating.toFixed(2)}`);
        return averageRating;
    }

    async updateProductReview(product_id, reviewUpdates, customer_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        const existingReview = await productReviewRepository.findOne({
            where: { product_id, customer_id },
        });

        this.logger.debug(`existingReview: ${existingReview.content}`);

        if (!existingReview) {
            throw new Error('Review not found'); // Proper error handling if the review doesn't exist
        }

        existingReview.content = reviewUpdates;

        return await productReviewRepository.save(existingReview);
    }

    async updateProduct(
        product_id,
        reviewUpdates,
        ratingUpdates,
        customer_id,
        order_id
    ) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        let productId;

        try {
            const variantProduct = await this.productVariantRepository_.findOne(
                {
                    where: { id: product_id }, // Assuming product_id is the ID of the variant
                }
            );

            if (!variantProduct) {
                throw new Error('Product variant not found');
            }

            productId = variantProduct.product_id; // This assumes that variantProduct actually contains a product_id
        } catch (e) {
            this.logger.error(`Error fetching product variant: ${e}`);
            throw e; // Rethrow or handle the error appropriately
        }

        // Ensure productId was successfully retrieved before proceeding
        if (!productId) {
            throw new Error('Unable to retrieve product ID for the review');
        }

        const existingReview = await productReviewRepository.findOne({
            where: { product_id: productId, customer_id, order_id },
        });

        this.logger.debug(`existingReview: ${existingReview.content}`);

        if (!existingReview) {
            throw new Error('Review not found'); // Proper error handling if the review doesn't exist
        }

        existingReview.content = reviewUpdates;
        existingReview.rating = ratingUpdates;

        return await productReviewRepository.save(existingReview);
    }

    async updateProductRating(product_id, rating, customer_id) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        const existingReview = await productReviewRepository.findOne({
            where: { product_id, customer_id },
        });

        this.logger.debug(`existingReview: ${existingReview.rating}`);

        if (!existingReview) {
            throw new Error('Review not found'); // Proper error handling if the review doesn't exist
        }

        existingReview.rating = rating;

        return await productReviewRepository.save(existingReview);
    }

    async addProductReview(product_id, data) {
        if (
            !product_id ||
            !data.title ||
            !data.customer_id ||
            !data.content ||
            !data.rating ||
            !data.order_id
        ) {
            throw new Error(
                'Product review requires title, customer_id, content, and rating'
            );
        }

        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        let productId;

        try {
            const variantProduct = await this.productVariantRepository_.findOne(
                {
                    where: { id: product_id }, // Assuming product_id is the ID of the variant
                }
            );

            if (!variantProduct) {
                throw new Error('Product variant not found');
            }

            productId = variantProduct.product_id; // This assumes that variantProduct actually contains a product_id
        } catch (e) {
            this.logger.error(`Error fetching product variant: ${e}`);
            throw e; // Rethrow or handle the error appropriately
        }

        // Ensure productId was successfully retrieved before proceeding
        if (!productId) {
            throw new Error('Unable to retrieve product ID for the review');
        }

        const createdReview = productReviewRepository.create({
            product_id: productId,
            title: data.title,
            customer_id: data.customer_id, // Assuming there is a customer_id field
            content: data.content,
            rating: data.rating,
            order_id: data.order_id,
        });
        const productReview = await productReviewRepository.save(createdReview);

        return productReview;
    }
}

export default ProductReviewService;
