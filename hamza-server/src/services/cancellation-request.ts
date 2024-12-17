import { Lifetime } from 'awilix';
import { CancellationRequestRepository } from '../repositories/cancellation-request';
import { createLogger, ILogger } from '../utils/logging/logger';
import { CancellationRequest } from '../models/cancellation-request';
import { generateEntityId, TransactionBaseService } from '@medusajs/medusa';

export default class CancellationRequestService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SINGLETON;

    private cancellationRequestRepository: typeof CancellationRequestRepository;
    protected logger: ILogger;

    constructor(container) {
        super(container);
        this.cancellationRequestRepository =
            container.cancellationRequestRepository;
        this.logger = createLogger(container, 'CancellationService');
    }

    /**
     * Creates a cancellation record.
     *
     * @param {string} orderId - The ID of the order to cancel.
     * @param {string} reason - The reason for the cancellation.
     * @param {string} [buyerNote] - Optional note from the buyer.
     * @returns {Promise<CancellationRequest>} - The created cancellation request.
     */
    async createCancellationRecord(
        orderId: string,
        reason: string,
        buyerNote?: string
    ): Promise<CancellationRequest> {
        this.logger.info(`Creating cancellation record for order: ${orderId}`);

        try {
            const existing = await this.cancellationRequestRepository.findOne({
                where: { order_id: orderId },
            });

            if (existing) {
                existing.reason = reason;
                if (buyerNote) existing.buyer_note = buyerNote;

                return await this.cancellationRequestRepository.save(existing);
            }

            const cancellationRequest =
                await this.cancellationRequestRepository.create({
                    order_id: orderId,
                    reason,
                    buyer_note: buyerNote || null,
                    status: 'requested',
                });

            if (!cancellationRequest.id)
                cancellationRequest.id = generateEntityId('id', 'cancelreq');

            const savedRequest =
                await this.cancellationRequestRepository.save(
                    cancellationRequest
                );

            this.logger.info(
                `Cancellation record created successfully: ${savedRequest.id}`
            );

            return savedRequest;
        } catch (error) {
            this.logger.error(
                `Error creating cancellation record for order ${orderId}: ${error.message}`
            );
            throw new Error(
                `Failed to create cancellation record for order ${orderId}`
            );
        }
    }
}
