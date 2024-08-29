import { Lifetime } from 'awilix';
import { Logger, TransactionBaseService } from '@medusajs/medusa';
import { CustomerNotificationRepository } from '../repositories/customer-notification';
import { NotificationTypeRepository } from '../repositories/notification-type';
import { createLogger, ILogger } from '../utils/logging/logger';
// import { NotificationType } from '../models/notification-type';

const notificationTypes = [
    { name: 'order_shipped' },
    { name: ' posted a new product' },
    { name: 'order status changed' },
    { name: 'promotions/discounts' },
    { name: ' survey_update' },
    { name: 'sms' },
    { name: 'email' },
    { name: 'LINE' },
    { name: 'whatsapp' },
];

class CustomerNotificationSerivce extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly customerNotificationRepository: typeof CustomerNotificationRepository;
    protected readonly notificationTypeRepository: typeof NotificationTypeRepository;

    constructor(container) {
        super(container);
        this.logger = createLogger(container);
        this.customerNotificationRepository =
            container.customerNotificationRepository;
        this.notificationTypeRepository = container.notificationTypeRepository;
    }

    // TODO: Will this be useful for the full implementation when we have two tables later?

    // async createNotificationTypes(): Promise<NotificationType[]> {
    //     const notificationTypes = [
    //         { name: 'order_shipped' },
    //         { name: 'posted a new product' },
    //         { name: 'order status changed' },
    //         { name: 'promotions/discounts' },
    //         { name: 'survey_update' },
    //         { name: 'sms' },
    //         { name: 'email' },
    //         { name: 'LINE' },
    //         { name: 'whatsapp' },
    //     ];
    //
    //     const createdNotificationTypes: NotificationType[] = [];
    //
    //     try {
    //         for (const type of notificationTypes) {
    //             const notificationType =
    //                 this.notificationTypeRepository.create(type);
    //             const savedNotificationType =
    //                 await this.notificationTypeRepository.save(
    //                     notificationType
    //                 );
    //             createdNotificationTypes.push(savedNotificationType);
    //         }
    //     } catch (e) {
    //         this.logger.error(`Error creating notification types: ${e}`);
    //         throw e;
    //     }
    //
    //     return createdNotificationTypes;
    // }

    async getNotifications(customerId: string) {
        try {
            const notification =
                await this.customerNotificationRepository.findOne({
                    where: { customer_id: customerId },
                });

            if (notification && notification.notification_type) {
                return notification.notification_type
                    .split(',')
                    .map((type) => type.trim());
            } else {
                return [];
            }
        } catch (e) {
            this.logger.error(`Error getting notification: ${e}`);
            throw e;
        }
    }

    async addOrUpdateNotification(
        customerId: string,
        notificationType: string
    ) {
        try {
            const existingNotification =
                await this.customerNotificationRepository.findOne({
                    where: { customer_id: customerId },
                });

            if (existingNotification) {
                // Update the existing notification
                existingNotification.updated_at = new Date();
                existingNotification.notification_type = notificationType;
                const updatedNotification =
                    await this.customerNotificationRepository.save(
                        existingNotification
                    );
                return updatedNotification;
            } else {
                // Create a new notification
                const notification = this.customerNotificationRepository.create(
                    {
                        customer_id: customerId,
                        notification_type: notificationType,
                    }
                );
                const newNotification =
                    await this.customerNotificationRepository.save(
                        notification
                    );
                return newNotification;
            }
        } catch (e) {
            this.logger.error(`Error adding or updating notification: ${e}`);
            throw e;
        }
    }

    async removeNotification(customerId: string) {
        try {
            const existingNotification =
                await this.customerNotificationRepository.findOne({
                    where: { customer_id: customerId },
                });

            if (existingNotification) {
                existingNotification.notification_type = '';
                await this.customerNotificationRepository.save(
                    existingNotification
                );
                return true;
            } else {
                return false;
            }
        } catch (e) {
            this.logger.error(`Error removing notification: ${e}`);
            throw e;
        }
    }
}

export default CustomerNotificationSerivce;
