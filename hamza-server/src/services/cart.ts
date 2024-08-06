import {
    Cart,
    CartService as MedusaCartService,
    MoneyAmount,
} from '@medusajs/medusa';
import CustomerRepository from '@medusajs/medusa/dist/repositories/customer';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';
import { LineItem } from '../models/line-item';
import { Lifetime } from 'awilix';

export default class CartService extends MedusaCartService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    //protected customerRepository_: typeof CustomerRepository;
    //protected productVariantRepository_: typeof ProductVariantRepository;

    constructor(container) {
        super(container);
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
