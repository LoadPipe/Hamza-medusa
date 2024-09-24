import {
    Cart,
    FindConfig,
    CartService as MedusaCartService,
    MoneyAmount,
    Logger,
} from '@medusajs/medusa';
import CustomerRepository from '@medusajs/medusa/dist/repositories/customer';
import { LineItem } from '../models/line-item';
import { Lifetime } from 'awilix';
import { PriceConverter } from '../utils/price-conversion';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import { createLogger, ILogger } from '../utils/logging/logger';
import ShippingOptionRepository from '@medusajs/medusa/dist/repositories/shipping-option';
import { CartEmailRepository } from 'src/repositories/cart-email';
import { IsNull } from 'typeorm';

export default class CartService extends MedusaCartService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected readonly customerRepository_: typeof CustomerRepository;
    protected readonly lineItemRepository_: typeof LineItemRepository;
    protected readonly cartEmailRepository_: typeof CartEmailRepository;
    protected readonly shippingOptionRepository_: typeof ShippingOptionRepository;
    protected readonly priceConverter: PriceConverter;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.customerRepository_ = container.customerRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.shippingOptionRepository_ = container.shippingOptionRepository;
        this.cartEmailRepository_ = container.cartEmailRepository;
        this.logger = createLogger(container, 'CartService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
    }

    async retrieve(cartId: string, options?: FindConfig<Cart>, totalsConfig?: { force_taxes?: boolean; }): Promise<Cart> {
        //add items & variant prices, and store (for default currency)
        if (options?.relations) {
            options.relations.push('items.variant.prices');
            options.relations.push('items.variant.product.store');
        }
        else {
            if (!options) options = {};
            options.relations = ['items.variant.prices', 'items.variant.product.store'];
        }
        const cart = await super.retrieve(cartId, options, totalsConfig);

        if (cart?.items) {

            //get customer preferred currency
            let userPreferredCurrency = 'usdc';
            if (cart.customer_id) {
                if (cart.customer_id && !cart.customer)
                    cart.customer = await this.customerRepository_.findOne({ where: { id: cart.customer_id } });

                userPreferredCurrency = cart.customer?.preferred_currency_id ?? userPreferredCurrency;
            }

            //adjust price for each line item, convert if necessary
            const itemsToSave: LineItem[] = [];
            for (let item of cart.items) {
                let storeCurrency = item.variant.product.store?.default_currency_code;
                item.currency_code = storeCurrency;
                item.unit_price = item.variant.prices.find(p => p.currency_code === storeCurrency).amount;
                if (storeCurrency != userPreferredCurrency) {
                    this.logger.info(`cart item with currency ${storeCurrency} amount ${item.unit_price} changing to ${userPreferredCurrency}`)

                    const newPrice = await this.priceConverter.getPrice(
                        { baseAmount: item.unit_price, baseCurrency: storeCurrency, toCurrency: userPreferredCurrency }
                    );
                    item.unit_price = newPrice;
                    item.currency_code = userPreferredCurrency;

                    itemsToSave.push(item);
                }
                item.variant.product.store = null;
            }

            if (itemsToSave.length) {
                Promise.all(
                    itemsToSave.map(i => this.lineItemRepository_.save(i))
                );
            }
        }

        const cartEmail = await this.cartEmailRepository_.findOne({ where: { id: cartId } });
        if (cartEmail)
            cart.email = cartEmail.email_address;

        return cart;
    }

    async recover(customerId: string): Promise<Cart> {
        const carts = await this.cartRepository_.find({
            where: { customer_id: customerId, completed_at: IsNull() },
            order: { updated_at: "desc" }
        });

        console.log('carts.length is', carts.length);
        return carts?.length ? carts[0] : null;
    }

    async addDefaultShippingMethod(cartId: string): Promise<void> {
        const cart = await super.retrieve(cartId, { relations: ['shipping_methods'] });

        if (cart && cart.shipping_methods.length === 0) {
            this.logger.debug(`Auto-adding shipping method for cart ${cart.id}`);
            const option = await this.shippingOptionRepository_.findOne({ where: { provider_id: 'bucky-fulfillment' } });
            await this.addShippingMethod(cart.id, option.id);
        }
    }

    async addOrUpdateLineItems(
        cartId: string,
        lineItems: LineItem | LineItem[],
        config: { validateSalesChannels: boolean }
    ): Promise<void> {
        const cart: Cart = await this.retrieve(cartId, {
            relations: ['customer', 'customer.walletAddresses'],
        });

        //get preferred currency from customer
        const preferredCurrency = cart?.customer?.preferred_currency_id;

        //if not an array, make it one
        if (!Array.isArray(lineItems)) {
            lineItems = [lineItems];
        }

        //get all currencies
        const promises: Promise<string>[] = [];
        for (let n = 0; n < lineItems.length; n++) {
            promises.push(
                this.getCurrencyForLineItem(lineItems[n], preferredCurrency)
            );
        }

        //assign currency results
        const results: string[] = await Promise.all(promises);
        for (let n = 0; n < lineItems.length; n++) {
            lineItems[n].currency_code = results[n];
        }

        //call super
        await super.addOrUpdateLineItems(
            cartId,
            lineItems.length === 1 ? lineItems[0] : lineItems,
            config
        );
    }

    private async getCurrencyForLineItem(
        lineItem: LineItem,
        preferredCurrency: string
    ): Promise<string> {
        const variant = await this.productVariantService_.retrieve(
            lineItem.variant_id,
            { relations: ['prices'] }
        );

        //find the preferred currency price, or default
        let price: MoneyAmount = null;
        price = variant.prices.find(
            (p) => p.currency_code === (preferredCurrency ?? 'usdc')
        );

        //if no preferred, return the first
        return price?.currency_code ?? 'usdc';
    }
}
