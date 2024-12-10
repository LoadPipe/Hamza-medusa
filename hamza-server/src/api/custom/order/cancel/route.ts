import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';
import BuckydropService from '../../../../services/buckydrop';
import CancellationRequestService from '../../../../services/cancellation-request';

//CANCELs an order, given its order id
//TODO: does not need to be DELETE (cancelling is not deleting)
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const cancellationRequestService: CancellationRequestService =
        req.scope.resolve('cancellationRequestService');
    const buckyService: BuckydropService =
        req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/custom/order/cancel',
        ['order_id', 'cancel_reason']
    );

    await handler.handle(async () => {
        //validate
        if (
            !handler.inputParams.order_id ||
            !handler.inputParams.cancel_reason
        ) {
            return handler.returnStatusWithMessage(
                400,
                'order_id && cancel reason is required'
            );
        }

        //normal cancellation
        // let order = await orderService.cancelOrder(
        //     handler.inputParams.order_id,
        //     handler.inputParams.cancel_reason
        // );

        // Create a cancellation request
        const cancellationRequest =
            await cancellationRequestService.createCancellationRecord(
                handler.inputParams.order_id,
                handler.inputParams.cancel_reason
            );

        if (!cancellationRequest) {
            handler.logger.error(
                `Failed to create cancellation request for order_id: ${handler.inputParams.order_id}`
            );
            return handler.returnStatusWithMessage(
                500,
                'Failed to create cancellation request'
            );
        }

        handler.logger.debug(
            `Cancellation request created for order_id: $ handler.inputParams.order_id,}`
        );

        //check customer id
        // if (!handler.enforceCustomerId(order.customer_id)) return;

        // if (!order) {
        //     handler.logger.error(
        //         `Order not found or could not be canceled for order_id: ${handler.inputParams.order_id}`
        //     );
        //     return handler.returnStatusWithMessage(
        //         404,
        //         'Order not found or could not be canceled'
        //     );
        // }

        //buckydrop cancellation
        // if (order.bucky_metadata)
        //     order = await buckyService.cancelOrder(
        //         handler.inputParams.order_id
        //     );

        // handler.logger.debug(
        //     `Order ${handler.inputParams.order_id} cancelled.`
        // );
        handler.returnStatus(200, {
            message: 'Order cancellation request created successfully',
            cancellationRequest,
        });
    });
};
