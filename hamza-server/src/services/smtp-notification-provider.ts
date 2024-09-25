import {
    AbstractNotificationService,
    Logger,
    OrderService,
} from '@medusajs/medusa';
import NotificationDataService from './notification-data-handler';
import SmtpMailService from './smtp-mail';
import ordersDataParser from '../utils/notification/order-data-handler';
import { createLogger, ILogger } from '../utils/logging/logger';
import CustomerNotificationSerivce from './customer-notification';
import { NotificationType } from './customer-notification';

class SmtpNotificationService extends AbstractNotificationService {
    static identifier = 'smtp-notification';
    private notificationDataService: NotificationDataService;
    private customerNotificationService_: CustomerNotificationSerivce;
    private smtpMailService: SmtpMailService;
    private logger: ILogger;
    private orderService_: OrderService;

    constructor(container) {
        super(container);
        this.notificationDataService = new NotificationDataService(container);
        this.customerNotificationService_ = container.customerNotificationService;
        this.smtpMailService = new SmtpMailService();
        this.logger = createLogger(container, 'SmtpNotificationService');
        this.orderService_ = container.orderService;
    }

    async sendNotification(
        event: string,
        data: any,
        attachmentGenerator: unknown
    ): Promise<{
        to: string;
        status: string;
        data: Record<string, unknown>;
    }> {
        switch (event) {
            case 'order.placed':
                if (this.logger) console.log('sending email to ', data);
                const customerId = data.customerId;
                if (!this.customerNotificationService_.hasNotifications(
                    customerId,
                    [NotificationType.Email, NotificationType.OrderStatusChanged])
                ) {
                    return;
                }

                let ordersData = await Promise.all(
                    data.orderIds.map(async (orderId: string) => {
                        return await this.orderService_.retrieve(orderId, {
                            select: [
                                'shipping_total',
                                'discount_total',
                                'tax_total',
                                'refunded_total',
                                'gift_card_total',
                                'subtotal',
                                'total',
                            ],
                            relations: [
                                'customer',
                                'billing_address',
                                'shipping_address',
                                'discounts',
                                'discounts.rule',
                                'shipping_methods',
                                'shipping_methods.shipping_option',
                                'payments',
                                'fulfillments',
                                'returns',
                                'gift_cards',
                                'gift_card_transactions',
                                'store',
                                'items',
                                'cart.items',
                                'cart.items.variant',
                                'cart.items.variant.product',
                            ],
                        });
                    })
                );

                let parsedOrdersData = ordersDataParser(ordersData);
                if (
                    ordersData[0].customer &&
                    ordersData[0].customer.is_verified == true
                ) {
                    await this.smtpMailService.sendMail({
                        from: process.env.SMTP_FROM,
                        subject: 'Order Placed',
                        mailData: parsedOrdersData,
                        to:
                            ordersData[0].customer &&
                            ordersData[0].customer.email,
                        templateName: 'order-placed',
                    });
                    return {
                        to: ordersData[0].customer.email,
                        status: 'success',
                        data: data,
                    };
                }

                return null;

            default:
                return null;
        }
    }

    resendNotification(
        notification: unknown,
        config: unknown,
        attachmentGenerator: unknown
    ): Promise<{
        to: string;
        status: string;
        data: Record<string, unknown>;
    }> {
        throw new Error('Method not implemented.');
    }
}

export default SmtpNotificationService;
