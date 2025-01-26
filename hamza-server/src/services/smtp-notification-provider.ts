import {
    AbstractNotificationService,
    CartService,
    Logger,
    OrderService,
} from '@medusajs/medusa';
import NotificationDataService from './notification-data-handler';
import SmtpMailService from './smtp-mail';
import ordersDataParser from '../utils/notification/order-data-handler';
import { createLogger, ILogger } from '../utils/logging/logger';
import CustomerNotificationSerivce from './customer-notification';
import { Lifetime } from 'awilix';

class SmtpNotificationService extends AbstractNotificationService {
    LIFE_TIME = Lifetime.SINGLETON;
    static identifier = 'smtp-notification';
    private notificationDataService: NotificationDataService;
    private customerNotificationService_: CustomerNotificationSerivce;
    private cartService_: CartService;
    private smtpMailService: SmtpMailService;
    private logger: ILogger;
    private orderService_: OrderService;

    constructor(container) {
        super(container);
        this.notificationDataService = new NotificationDataService(container);
        this.customerNotificationService_ =
            container.customerNotificationService;
        this.cartService_ = container.cartService;
        this.smtpMailService = container.smtpMailService;
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
                const customerId = data.customerId;
                if (
                    !this.customerNotificationService_.hasNotifications(
                        customerId,
                        ['email', 'orderStatusChanged']
                    )
                ) {
                    return;
                }

                this.logger.info(`sending email to ${JSON.stringify(data)}`);

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
                const customer = ordersData[0]?.customer;
                const cart = await this.cartService_.retrieve(
                    ordersData[0]?.cart_id
                );

                const toEmail =
                    data.email ??
                    cart?.email ??
                    (customer?.is_verified ? customer.email : null);
                this.logger.info(`sending email to recipient ${toEmail}`);

                if (toEmail) {
                    await this.smtpMailService.sendMail({
                        from: process.env.SMTP_FROM,
                        subject: 'Order Placed on Hamza.market',
                        mailData: parsedOrdersData,
                        to: toEmail,
                        templateName: 'order-placed',
                    });
                    return {
                        to: toEmail,
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
