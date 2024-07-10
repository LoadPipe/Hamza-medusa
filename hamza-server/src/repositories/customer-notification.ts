import { CustomerNotification } from '../models/customer-notification';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const CustomerNotificationRepository = dataSource
    .getRepository(CustomerNotification)
    .extend({
        ...Object.assign(CustomerNotification, {
            target: CustomerNotification,
        }),
    });
