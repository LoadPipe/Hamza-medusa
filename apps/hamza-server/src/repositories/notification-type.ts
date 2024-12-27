import { NotificationType } from '../models/notification-type';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const NotificationTypeRepository = dataSource
    .getRepository(NotificationType)
    .extend({
        ...Object.assign(NotificationType, {
            target: NotificationType,
        }),
    });
