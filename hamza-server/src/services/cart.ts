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
import { IsNull, Not } from 'typeorm';

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

    async retrieve(
        cartId: string,
        options?: FindConfig<Cart>,
        totalsConfig?: { force_taxes?: boolean },
        saveLineItems: boolean = false
    ): Promise<Cart> {
        //add items & variant prices, and store (for default currency)
        if (options?.relations) {
            if (!options.relations.includes('items.variant.prices'))
                options.relations.push('items.variant.prices');
            if (!options.relations.includes('items.variant.product.store'))
                options.relations.push('items.variant.product.store');
        } else {
            if (!options) options = {};
            options.relations = [
                'items.variant.prices',
                'items.variant.product.store',
            ];
        }
        const cart = await super.retrieve(cartId, options, totalsConfig);

        //handle items - mainly currency conversion
        if (cart?.items) {
            //get customer preferred currency
            let userPreferredCurrency = 'usdc';
            if (cart.customer_id) {
                if (cart.customer_id && !cart.customer)
                    cart.customer = await this.customerRepository_.findOne({
                        where: { id: cart.customer_id },
                    });

                userPreferredCurrency =
                    cart.customer?.preferred_currency_id ??
                    userPreferredCurrency;
            }

            //adjust price for each line item, convert if necessary
            const itemsToSave: LineItem[] = [];
            for (let item of cart.items) {
                //detect if currency has changed in line item
                let storeCurrency =
                    item.variant.product.store?.default_currency_code;
                const originalCurrency = item.currency_code;
                let originalPrice = item.unit_price;

                item.currency_code = storeCurrency;

                //now detect if price has changed
                let newPrice = item.variant.prices.find(
                    (p) => p.currency_code === storeCurrency
                ).amount;

                item.unit_price = newPrice;

                if (storeCurrency != userPreferredCurrency) {
                    newPrice = await this.priceConverter.getPrice({
                        baseAmount: item.unit_price,
                        baseCurrency: storeCurrency,
                        toCurrency: userPreferredCurrency,
                    });
                }
                item.unit_price = newPrice;
                item.currency_code = userPreferredCurrency;

                //if EITHER currency OR price has changed, the item will beupdated
                const priceChanged = originalPrice != item.unit_price;
                const currencyChanged = originalCurrency != item.currency_code;

                if (priceChanged || currencyChanged) {
                    const reason = priceChanged
                        ? currencyChanged
                            ? 'Price and currency have both changed'
                            : 'Price has changed'
                        : 'Currency has changed';

                    this.logger.info(
                        `cart item with currency ${originalCurrency} price ${originalPrice} changing to ${item.currency_code} ${item.unit_price}`
                    );
                    this.logger.debug(
                        `${reason}, updating line item in cart ${cart.id}`
                    );

                    itemsToSave.push(item);
                }
            }

            //if any items to update, update them asynchronously
            try {
                if (saveLineItems && itemsToSave?.length) {
                    await this.lineItemRepository_.save(itemsToSave);
                }
            } catch (error) {
                this.logger.error(
                    `Line items save has errored for cart ${cart.id}`,
                    error
                );
            }
        }

        //get cart email
        const cartEmail = await this.cartEmailRepository_.findOne({
            where: { id: cartId },
        });
        if (cartEmail) cart.email = cartEmail.email_address;

        return cart;
    }

    async recover(customerId: string, cartId: string): Promise<Cart> {
        //get last cart
        const carts = await this.cartRepository_.find({
            where: {
                customer_id: customerId,
                completed_at: IsNull(),
                deleted_at: IsNull(),
            },
            order: { updated_at: 'DESC' },
            take: 1,
        });

        let previousCart = carts?.length ? carts[0] : null;
        console.log('previous cart: ', previousCart);

        //don't consider previous cart if completed or deleted
        if (previousCart) {
            if (previousCart.deleted_at || previousCart.completed_at)
                previousCart = null;
        }

        //is there also a non-logged-in cart from cookies?
        let anonCart = null;
        if (cartId?.length && cartId != previousCart?.id) {
            anonCart = await this.cartRepository_.findOne({
                where: {
                    id: cartId,
                    completed_at: IsNull(),
                    deleted_at: IsNull(),
                },
            });
        }

        //if only anon cart, use that
        let cart = null;
        if (!previousCart && anonCart) {
            cart = anonCart;
        } else {
            //use previous user cart by default
            cart = previousCart;

            //and if there's an anon cart too, merge it in
            if (anonCart) {
                //merge carts
                cart = await this.mergeCarts(previousCart, anonCart);
            }

            return cart;
        }
    }

    async addDefaultShippingMethod(
        cartId: string,
        force: boolean = false
    ): Promise<void> {
        const cart = await super.retrieve(cartId, {
            relations: ['shipping_methods'],
        });

        if (cart && (force || cart.shipping_methods.length === 0)) {
            this.logger.debug(
                `Auto-adding shipping method for cart ${cart.id}`
            );
            const option = await this.shippingOptionRepository_.findOne({
                where: { provider_id: 'bucky-fulfillment' },
            });
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

        try {
            //call super
            await super.addOrUpdateLineItems(
                cartId,
                lineItems.length === 1 ? lineItems[0] : lineItems,
                config
            );
        } catch (error: any) {
            this.logger.error(
                `Error adding ${lineItems.length} line items to cart ${cartId}`,
                error
            );
        }
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

    private async mergeCarts(cart1: Cart, cart2: Cart): Promise<Cart> {
        try {
            //make sure both carts contain items
            if (!cart2?.items) {
                cart2 = await this.cartRepository_.findOne({
                    where: { id: cart2.id },
                    relations: ['items'],
                });
            }

            if (cart2?.items.length) {
                if (!cart1.items) {
                    cart1 = await this.cartRepository_.findOne({
                        where: { id: cart1.id },
                        relations: ['items'],
                    });
                }

                //move cart 2's line items to cart 1
                await this.addOrUpdateLineItems(cart1.id, cart2.items, {
                    validateSalesChannels: false,
                });
            }
        } catch (e) {
            this.logger.error('Error merging carts', e);
        }

        return cart1;
    }
}
