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
        if (handler.inputParams.customer_id?.length) {
            //require security 
            if (!handler.enforceCustomerId(handler.inputParams.customer_id))
                return;

            //reviews by customer 
            const reviews = await productReviewService.getAllCustomerReviews(
                handler.inputParams.customer_id
            );

            res.json(reviews);
        }
        else if (handler.inputParams.product_id?.length) {

            //reviews by product
            const reviews = await productReviewService.getReviews(
                handler.inputParams.product_id
            );
            res.json(reviews);
        } else {
            res.status(400).json({ message: 'Either customer_id or product_id is required' });
        }
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
