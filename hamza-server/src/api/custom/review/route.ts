import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/review',
        ['customer_id', 'product_id']
    );

    await handler.handle(async () => {
        const hasCustomerId = handler.inputParams.customer_id?.length;
        const hasProductId = handler.inputParams.product_id?.length;

        if (hasCustomerId) {
            //require security 
            if (!handler.enforceCustomerId(handler.inputParams.customer_id))
                return;

        }

        let reviews = [];

        if (hasCustomerId && !hasProductId) {

            //reviews by customer 
            reviews = await productReviewService.getAllCustomerReviews(
                handler.inputParams.customer_id
            );

            res.json(reviews);
        }
        else if (hasProductId && !hasCustomerId) {

            //reviews by product
            reviews = await productReviewService.getReviews(
                handler.inputParams.product_id
            );
            res.json(reviews);
        }
        else if (hasCustomerId && hasProductId) {

            //reviews by product and customer
            reviews = await productReviewService.getCustomerReviews(
                handler.inputParams.product_id,
                handler.inputParams.customer_id
            );
        }
        else {
            res.status(400).json({ message: 'Either customer_id or product_id is required' });
            return;
        }

        res.json(reviews);
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const productReviewService: ProductReviewService = req.scope.resolve(
            'productReviewService'
        );

        const handler: RouteHandler = new RouteHandler(
            req,
            res,
            'POST',
            '/custom/review',
            [
                'product_id',
                'title',
                'customer_id',
                'content',
                'rating',
                'order_id',
            ]
        );

        await handler.handle(async () => {
            const review = await productReviewService.addProductReview(
                handler.inputParams.product_id,
                {
                    title: handler.inputParams.title,
                    customer_id: handler.inputParams.customer_id,
                    content: handler.inputParams.content,
                    rating: handler.inputParams.rating,
                    order_id: handler.inputParams.order_id,
                }
            );
            res.json(review);
        });
    } catch (error) {
        console.error('Error processing POST /custom/review:', error);
        res.status(500).json({ error: 'Failed to process review' });
    }
};


export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/custom/review',
        [
            'product_id',
            'review_updates',
            'rating_updates',
            'customer_id',
            'order_id',
        ]
    );

    await handler.handle(async () => {
        //validate parameters 
        if (!handler.requireParams([
            'product_id',
            'review_updates',
            'rating_updates',
            'customer_id',
            'order_id',
        ]))
            return;

        //security
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const updatedReview = await productReviewService.updateProduct(
            handler.inputParams.product_id,
            handler.inputParams.review_updates,
            handler.inputParams.rating_updates,
            handler.inputParams.customer_id,
            handler.inputParams.order_id
        );
        res.json(updatedReview);
    });
};
