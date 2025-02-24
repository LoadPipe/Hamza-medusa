import { MedusaContainer, NotificationService } from '@medusajs/medusa';

export default async (container: MedusaContainer): Promise<void> => {
    const notificationService = container.resolve<NotificationService>(
        'notificationService'
    );

    notificationService.subscribe('order.placed', 'smtp-notification');
    notificationService.subscribe('giftcard.order', 'smtp-notification');
};
