import {
    Cart,
    FindConfig,
    CartService as MedusaCartService,
    MoneyAmount,
    Logger
} from '@medusajs/medusa';
import CustomerRepository from '@medusajs/medusa/dist/repositories/customer';
import { LineItem } from '../models/line-item';
import { Lifetime } from 'awilix';
import { PriceConverter } from '../strategies/price-selection';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import { DatabaseLogger, ILogger } from '../utils/logging/logger';

export default class CartService extends MedusaCartService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected readonly customerRepository_: typeof CustomerRepository;
    protected readonly lineItemRepository_: typeof LineItemRepository;
    protected readonly priceConverter: PriceConverter = new PriceConverter();
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.customerRepository_ = container.customerRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.logger = new DatabaseLogger(container);
    }

    async retrieve(cartId: string, options?: FindConfig<Cart>, totalsConfig?: { force_taxes?: boolean; }): Promise<Cart> {
        const cart = await super.retrieve(cartId, options, totalsConfig);

        if (cart?.items) {

            let currencyCode = 'usdc';
            if (cart.customer_id) {
                if (cart.customer_id && !cart.customer)
                    cart.customer = await this.customerRepository_.findOne({ where: { id: cart.customer_id } });

                currencyCode = cart.customer?.preferred_currency_id ?? currencyCode;
            }

            const itemsToSave: LineItem[] = [];
            for (let item of cart.items) {
                if (item.currency_code != currencyCode) {
                    this.logger.debug(`cart item with currency ${item.currency_code} amount ${item.unit_price} changing to ${currencyCode}`)
                    item.currency_code = currencyCode;
                    item.unit_price = await this.priceConverter.getPrice(
                        { baseAmount: item.unit_price, baseCurrency: item.currency_code, toCurrency: currencyCode }
                    );
                    itemsToSave.push(item);
                }
            }

            if (itemsToSave.length) {
                Promise.all(
                    itemsToSave.map(i => this.lineItemRepository_.save(i))
                );
            }
        }

        return cart;
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

        //find either the preferred currency price, or just the first
        let price: MoneyAmount = null;
        if (preferredCurrency) {
            price = variant.prices.find(
                (p) => p.currency_code == preferredCurrency
            );
        }

        //if no preferred, return the first
        return price?.currency_code ?? variant.prices[0].currency_code;
    }
}
