import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { PaymentCollectionRepository as MedusaPaymentCollectionRepository } from '@medusajs/medusa/dist/repositories/payment-collection';
import { PaymentCollection } from '../models/payment-collection';

export const PaymentCollectionRepository = dataSource
    .getRepository(PaymentCollection)
    .extend({
        ...Object.assign(MedusaPaymentCollectionRepository, {
            target: PaymentCollection,
        }),
    });

export default PaymentCollectionRepository;
