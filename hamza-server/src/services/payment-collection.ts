import { Lifetime } from 'awilix';
import {
    PaymentCollection,
    PaymentCollectionService as MedusaPaymentCollectionService,
} from '@medusajs/medusa';
import { CreatePaymentCollectionInput as MedusaCreatePaymentCollectionInput } from '@medusajs/medusa/dist/types/payment-collection';
import PaymentCollectionRepository from '../repositories/payment-collection';
import { DeepPartial } from 'typeorm';

type CreatePaymentCollectionInput = MedusaCreatePaymentCollectionInput & {
    store_id?: string;
};

export default class PaymentCollectionService extends MedusaPaymentCollectionService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly paymentCollectionRepository_: typeof PaymentCollectionRepository;

    constructor(container) {
        super(container);
        this.paymentCollectionRepository_ =
            container.paymentCollectionRepository;
    }

    async create(
        data: CreatePaymentCollectionInput
    ): Promise<PaymentCollection> {
        console.log('creating payment collection', data);
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
        console.log('updating payment collection', id, data);
        // First, find the payment collection that you want to update
        // Then, update the payment collection with the new data
        const updatedPaymentCollection = Object.assign(id, data);
        return await this.paymentCollectionRepository_.save(
            updatedPaymentCollection
        );
    }
}
