import { createLogger, ILogger } from '../utils/logging/logger';
import { StoreShippingSpecRepository } from '../repositories/store-shipping-spec';
import { PriceConverter } from '../utils/price-conversion';
import StoreService from './store';
import {
    TransactionBaseService,
    CartService,
    Cart,
    CustomerService,
} from '@medusajs/medusa';
import { Store } from '../models/store';

export default class StoreShippingSpecService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly storeShippingSpecRepository_: typeof StoreShippingSpecRepository;
    protected readonly storeService_: StoreService;
    protected readonly cartService_: CartService;
    protected readonly customerService_: CustomerService;
    protected readonly priceConverter: PriceConverter;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'StoreShippingSpecService');
        this.storeShippingSpecRepository_ =
            container.storeShippingSpecRepository;
        this.storeService_ = container.storeService;
    }

    async calculateShippingPriceForCart(cartId: string): Promise<number> {
        let output = 0;
        let currency = 'usdc';

        try {
            //this subtotal is calculated to compare with the shipping cost
            let subtotal = 0;

            const cart: Cart = await this.cartService_.retrieve(cartId, {
                relations: [
                    'items.variant.product.store',
                    'items.variant.prices', //TODO: we need prices?
                    'customer',
                    'shipping_address.country',
                ],
            });

            if (!cart) throw new Error(`Cart with id ${cartId} not found`);

            if (!cart?.items?.length) {
                return 0;
            }

            //get customer if there is one
            if (!cart.customer) {
                if (cart.customer_id?.length) {
                    cart.customer = await this.customerService_.retrieve(
                        cart.customer_id
                    );
                }
            }

            //get currency from customer, or cart if there is no customer
            currency = cart.customer
                ? cart.customer.preferred_currency_id
                : (cart?.items[0]?.currency_code ?? 'usdc');

            output = 0; // subtotal;
            output = output < 0 ? 0 : output;
            output = output > 0 ? 0 : output;

            //TODO: here put the business logic

            //convert to final currency
            if (currency != 'usdc')
                output = await this.priceConverter.convertPrice(
                    output, //estimate.data.total,
                    'usdc',
                    currency
                );
        } catch (e) {
            this.logger.error(
                `Error calculating shipping costs in BuckydropService`,
                e
            );
            output = 0;
        }

        return output;
    }
}
