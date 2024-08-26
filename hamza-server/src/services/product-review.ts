import { TransactionBaseService, Logger, OrderStatus } from '@medusajs/medusa';
import { Lifetime } from 'awilix';
import { ProductReviewRepository } from '../repositories/product-review';
import { ProductReview } from '../models/product-review';
import { Order } from '../models/order';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { Customer } from '../models/customer';
import { ProductVariantRepository } from '../repositories/product-variant';
import { Product } from '../models/product';
import { In, Not } from 'typeorm';

class ProductReviewService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly productReviewRepository_: typeof ProductReviewRepository;
    protected readonly orderRepository_: typeof OrderRepository;
    protected readonly logger: Logger;

    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
        this.productReviewRepository_ = container.productReviewRepository;
        this.orderRepository_ = container.orderRepository;
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

    async customerHasLeftReview(
        order_id: string,
        customer_id: string,
        variant_id: string
    ) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);
        let productId: string;
        try {
            const variantProduct = await this.productVariantRepository_.findOne(
                {
                    where: { id: variant_id }, // Assuming product_id is the ID of the variant
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
        const productReviews = await productReviewRepository.find({
            where: { order_id: order_id, customer_id, product_id: productId },
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

    // Order has no relations to product ...

    async getNotReviewedOrders(customer_id: string) {
        const orderRepository = this.activeManager_.getRepository(Order);
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        // Fetch all non-archived orders for the customer
        // TODO: This should be swapped to shipped in production
        //            .andWhere('order.status != :status', { fulfillment_status: 'shipped?' })
        const orders = await orderRepository
            .createQueryBuilder('order')
            .select(['order.id', 'order.status'])
            .where('order.customer_id = :customer_id', { customer_id })
            .andWhere('order.status != :archivedStatus', {
                archivedStatus: 'archived',
            })
            .andWhere('order.status != :cancelledStatus', {
                cancelledStatus: 'canceled',
            })
            .getMany();

        // If no orders are found, throw an error
        if (!orders || orders.length === 0) {
            return [];
        }

        // Fetch all reviews for the customer
        const reviews = await productReviewRepository
            .createQueryBuilder('review')
            .select('review.order_id')
            .where('review.customer_id = :customer_id', { customer_id })
            .getMany();

        // Extract order_ids from reviews
        const reviewedOrderIds = reviews.map((review) => review.order_id);

        // Filter the orders to find those not reviewed
        const unreviewedOrderIds = orders
            .filter((order) => !reviewedOrderIds.includes(order.id))
            .map((order) => order.id);

        if (unreviewedOrderIds.length === 0) {
            return [];
        }

        // Fetch detailed information only for unreviewed orders
        const unreviewedOrders = await orderRepository.find({
            where: {
                id: In(unreviewedOrderIds),
                customer_id: customer_id,
                status: Not(OrderStatus.ARCHIVED),
            },
            relations: ['items'],
        });

        return unreviewedOrders;
    }

    async getSpecificReview(order_id: string, product_id: string) {
        console.log(`ProductID is ${product_id}`);
        try {
            const productReviewRepository =
                this.activeManager_.getRepository(ProductReview);
            const productReview = await productReviewRepository.findOne({
                where: { order_id, product_id: product_id },
            });

            console.log(`ProductReview is ${JSON.stringify(productReview)}`);
            if (productReview === undefined) {
                return { content: '', rating: 0 };
            }
            const { content, rating } = productReview;

            return { content, rating };
        } catch (e) {
            this.logger.error(`Error fetching specific review: ${e}`);
            throw e;
        }
    }

    async getReviews(product_id: string) {
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

        const reviews = await productReviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.product', 'product')
            .select([
                'review', // Assuming you want the review's ID; add other review fields as needed
                'product.thumbnail', // This specifies that only the thumbnail field from the product should be included
            ])
            .where('review.customer_id = :customer_id', { customer_id })
            .getMany();

        if (!reviews.length) {
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

    // async updateProduct(
    //     product_id,
    //     reviewUpdates,
    //     ratingUpdates,
    //     customer_id,
    //     order_id
    // ) {
    //     const productReviewRepository =
    //         this.activeManager_.getRepository(ProductReview);
    //
    //     let productId;
    //
    //     try {
    //         const variantProduct = await this.productVariantRepository_.findOne(
    //             {
    //                 where: { id: product_id }, // Assuming product_id is the ID of the variant
    //             }
    //         );
    //
    //         if (!variantProduct) {
    //             throw new Error('Product variant not found');
    //         }
    //
    //         productId = variantProduct.product_id; // This assumes that variantProduct actually contains a product_id
    //     } catch (e) {
    //         this.logger.error(`Error fetching product variant: ${e}`);
    //         throw e; // Rethrow or handle the error appropriately
    //     }
    //
    //     // Ensure productId was successfully retrieved before proceeding
    //     if (!productId) {
    //         throw new Error('Unable to retrieve product ID for the review');
    //     }
    //
    //     const existingReview = await productReviewRepository.findOne({
    //         where: { product_id: productId, customer_id, order_id },
    //     });
    //
    //     this.logger.debug(`existingReview: ${existingReview.content}`);
    //
    //     if (!existingReview) {
    //         throw new Error('Review not found'); // Proper error handling if the review doesn't exist
    //     }
    //
    //     existingReview.content = reviewUpdates;
    //     existingReview.rating = ratingUpdates;
    //
    //     return await productReviewRepository.save(existingReview);
    // }

    async updateProduct(
        product_id: string,
        review: string,
        rating: number,
        customer_id: string,
        order_id: string
    ) {
        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        const existingReview = await productReviewRepository.findOne({
            where: {
                product_id: product_id,
                customer_id: customer_id,
                order_id: order_id,
            },
        });

        this.logger.debug(
            `Searching for review with Product ID: ${product_id}, Customer ID: ${customer_id}, Order ID: ${order_id}`
        );
        if (!existingReview) {
            this.logger.error('Review not found');
            throw new Error('Review not found');
        } else {
            this.logger.debug(
                `Found review with Rating: ${existingReview.rating}`
            );
        }

        if (!existingReview) {
            throw new Error('Review not found'); // Proper error handling if the review doesn't exist
        }

        existingReview.rating = rating;
        existingReview.content = review;

        return await productReviewRepository.save(existingReview);
    }

    // TODO: lock to not allow multiple reviews for this item...
    async addProductReview(
        product_id,
        { title, customer_id, content, rating, order_id }
    ) {
        if (
            !product_id ||
            !title ||
            !customer_id ||
            !content ||
            !rating ||
            !order_id
        ) {
            throw new Error(
                'Product review requires title, customer_id, content, and rating'
            );
        }

        const productReviewRepository =
            this.activeManager_.getRepository(ProductReview);

        const reviews = await productReviewRepository.find({
            where: { product_id, customer_id, order_id },
        });

        if (reviews.length > 0) {
            return 'REVIEW EXISTS!';
        } else {
            console.log(`Review does not exist, lets create one`);
        }

        const createdReview = productReviewRepository.create({
            product_id: product_id,
            title: title,
            customer_id: customer_id, // Assuming there is a customer_id field
            content: content,
            rating: rating,
            order_id: order_id,
        });
        const productReview = await productReviewRepository.save(createdReview);

        return productReview;
    }
}

export default ProductReviewService;
