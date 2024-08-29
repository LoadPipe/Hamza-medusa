import { Lifetime } from 'awilix';
import {
    PaymentCollectionService as MedusaPaymentCollectionService,
    Logger,
} from '@medusajs/medusa';
import { CreatePaymentCollectionInput as MedusaCreatePaymentCollectionInput } from '@medusajs/medusa/dist/types/payment-collection';
import PaymentCollectionRepository from '../repositories/payment-collection';
import { PaymentCollection } from '../models/payment-collection';
import { DeepPartial } from 'typeorm';
import { DatabaseLogger, ILogger } from '../utils/logging/logger';

type CreatePaymentCollectionInput = MedusaCreatePaymentCollectionInput & {
    store_id?: string;
};

export default class PaymentCollectionService extends MedusaPaymentCollectionService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly paymentCollectionRepository_: typeof PaymentCollectionRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.paymentCollectionRepository_ =
            container.paymentCollectionRepository;
        this.logger = new DatabaseLogger(container);
    }

    async create(
        data: CreatePaymentCollectionInput
    ): Promise<PaymentCollection> {
        this.logger.debug(`creating payment collection ${data}`);
        const { store_id, ...rest } = data;

        return await this.paymentCollectionRepository_.save({
            ...rest,
            store_id,
        });
    }

    async update(
        id: string,
        data: DeepPartial<PaymentCollection>
    ): Promise<PaymentCollection> {
        // First, find the payment collection that you want to update
        // Then, update the payment collection with the new data
        const updatedPaymentCollection = Object.assign(id, data);
        return await this.paymentCollectionRepository_.save(
            updatedPaymentCollection
        );
    }
}
