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
        this.cartService_ = container.cartService;
        this.customerService_ = container.customerService;
        this.logger = createLogger(container, 'BuckydropService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
    }

    async calculateShippingPriceForCart(cartId: string): Promise<number> {
        let output = 0;

        try {
            //get the appropriate type of cart
            const cart: Cart = await this.getCart(cartId);
            if (!cart) return 0;

            //calculate shipping prices for each store in the cart
            output = await this.calculateStoreSpecificShippingCosts(cart);
        } catch (e) {
            this.logger.error(
                `Error calculating shipping costs in StoreShippingSpecService`,
                e
            );
            output = 0;
        }

        return output;
    }

    private async getCart(cartId: string): Promise<Cart> {
        const cart: Cart = await this.cartService_.retrieve(cartId, {
            relations: [
                'items.variant.product.store.shipping_specs',
                'items.variant.prices', //TODO: we need prices?
                'customer',
                'shipping_address.country',
            ],
        });

        if (!cart) throw new Error(`Cart with id ${cartId} not found`);

        if (!cart?.items?.length) {
            return null;
        }

        //get customer if there is one
        if (!cart.customer) {
            if (cart.customer_id?.length) {
                cart.customer = await this.customerService_.retrieve(
                    cart.customer_id
                );
            }
        }

        return cart;
    }

    private async calculateStoreSpecificShippingCosts(
        cart: Cart
    ): Promise<number> {
        let output: number = 0;

        //get currency from customer, or cart if there is no customer
        const currency: string = cart.customer
            ? cart.customer.preferred_currency_id
            : (cart?.items[0]?.currency_code ?? 'usdc');

        //get unique stores in the order
        const stores: Store[] = await this.getUniqueStoresInCart(cart);

        //get shipping price for each store
        for (let store of stores) {
            output += this.getShippingPriceForStore(store);
        }

        //convert to final currency
        if (currency != 'usdc')
            output = await this.priceConverter.convertPrice(
                output, //estimate.data.total,
                'usdc',
                currency
            );

        return output;
    }

    private async getUniqueStoresInCart(cart: Cart): Promise<Store[]> {
        const stores: Store[] = [];

        for (let n = 0; n < cart.items.length; n++) {
            const store = cart.items[n].variant.product.store;
            if (!stores.find((s) => s.id === store.id)) stores.push(store);
        }

        return stores;
    }

    private getShippingPriceForStore(store: Store): number {
        let output: number = 0;
        for (let shipspec of store.shipping_specs) {
            const spec: any = shipspec.spec;
            if (spec.fixed_price_usd) {
                output += spec.fixed_price_usd;
            }
        }

        return output;
    }
}
