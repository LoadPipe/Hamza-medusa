import { Lifetime } from 'awilix';
import { TransactionBaseService } from '@medusajs/medusa';
import { CustomerNotificationRepository } from '../repositories/customer-notification';
import { NotificationTypeRepository } from '../repositories/notification-type';
import { createLogger, ILogger } from '../utils/logging/logger';
import { CustomerNotification } from 'src/models/customer-notification';

const notificationTypes = [
    { name: 'order_shipped' },
    //{ name: 'posted a new product' },
    { name: 'order status changed' },
    { name: 'promotions/discounts' },
    { name: 'survey_update' },
    //{ name: 'sms' },
    { name: 'email' },
    //{ name: 'LINE' },
    //{ name: 'whatsapp' },
];

class CustomerNotificationService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly customerNotificationRepository: typeof CustomerNotificationRepository;
    protected readonly notificationTypeRepository: typeof NotificationTypeRepository;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'CustomerNotificationSerivce');
        this.customerNotificationRepository =
            container.customerNotificationRepository;
        this.notificationTypeRepository = container.notificationTypeRepository;
    }

    async getNotificationTypes(customerId: string): Promise<string[]> {
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
        notificationType: string //TODO should be an array
    ): Promise<CustomerNotification> {
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

    async removeNotification(customerId: string): Promise<boolean> {
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

    async setDefaultNotifications(customerId: string): Promise<void> {
        await this.addOrUpdateNotification(customerId, 'email, orderShipped, orderStatusChanged');
    }
}

export default CustomerNotificationService;
