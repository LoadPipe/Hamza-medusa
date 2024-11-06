import {
    AbstractPriceSelectionStrategy,
    CustomerService,
    PriceSelectionContext,
    PriceSelectionResult,
    ProductVariant,
    Store,
} from '@medusajs/medusa';
import { CachedExchangeRateRepository } from '../repositories/cached-exchange-rate';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';
import { In } from 'typeorm';
import { ILogger } from '../utils/logging/logger';
import { PriceConverter } from '../utils/price-conversion';
import { SeamlessCache } from '../utils/cache/seamless-cache';

type InjectedDependencies = {
    customerService: CustomerService;
    productVariantRepository: typeof ProductVariantRepository;
    logger: ILogger;
};

export default class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
    protected readonly customerService_: CustomerService;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly logger: ILogger;
    protected readonly cachedExchangeRateRepository: typeof CachedExchangeRateRepository;

    constructor({
        customerService,
        productVariantRepository,
        logger,
        cachedExchangeRateRepository,
    }: InjectedDependencies & {
        cachedExchangeRateRepository: typeof CachedExchangeRateRepository;
    }) {
        super(arguments[0]);
        this.customerService_ = customerService;
        this.productVariantRepository_ = productVariantRepository;
        this.logger = logger;
        this.cachedExchangeRateRepository = cachedExchangeRateRepository;
    }

    async calculateVariantPrice(
        data: {
            variantId: string;
            quantity?: number;
        }[],
        context: PriceSelectionContext
    ): Promise<Map<string, PriceSelectionResult>> {
        //if we have a customer, then we will check for preferred currency
        //const preferredCurrency: string =
        //    await this.getCustomerPreferredCurrency(context.customer_id);

        //get all relevant variants, including preferred currency (if any)
        return await this.getPricesForVariants(
            data.map((d) => d.variantId) //variant ids
            //preferredCurrency ?? 'usdc'
        );
    }

    /**
     * Gets the given customer's preferred currency code, if the customer id is non-null
     * and valid, and if that customer exists and has a preferred currency. Otherwise null
     * or empty.
     *
     * @param customerId Unique customer id
     * @returns A currency code (string)
     */
    private async getCustomerPreferredCurrency(
        customerId: string = null
    ): Promise<string> {
        if (customerId) {
            const customer = await this.customerService_.retrieve(customerId);
            return customer?.preferred_currency_id;
        }

        return 'usdc';
    }

    /**
     * If no preferredCurrencyId is not passed in, all found prices for all given variants
     * will be returned. If preferredCurrencyId is passed, only prices with that currency
     * will be returned. Unless that results in 0 prices, in which case again, all prices
     * will be returned instead by default.
     *
     * @param variantIds Array of product variant unique ids
     * @param preferredCurrencyId Optional; a currency code by which to filter.
     * @returns Map of string -> PriceSelectionResult, where the key is the variant id.
     */
    private async getPricesForVariants(
        variantIds: string[],
        preferredCurrencyId: string = null
    ): Promise<Map<string, PriceSelectionResult>> {
        const output: Map<string, PriceSelectionResult> = new Map<
            string,
            PriceSelectionResult
        >();

        const priceConverter = new PriceConverter(
            this.logger,
            this.cachedExchangeRateRepository
        );

        //get the variant objects
        const variants: ProductVariant[] = await variantPriceCache.retrieve({
            ids: variantIds,
            productVariantRepository: this.productVariantRepository_,
        });

        //get the store
        const store: Store = variants[0].product.store;

        //if no preferred currency, just return all prices
        for (const v of variants) {
            let prices = v.prices;

            //convert all currency prices according to base price
            const baseCurrency = store?.default_currency_code;
            const baseAmount = prices.find(
                (p) => p.currency_code === baseCurrency
            )?.amount;
            if (baseAmount && baseCurrency) {
                for (let n = 0; n < prices.length; n++) {
                    prices[n].amount = await priceConverter.getPrice({
                        baseAmount,
                        baseCurrency,
                        toCurrency: prices[n].currency_code,
                    });
                }
            }

            //if preferred currency, filter out the non-matchers
            /*if (preferredCurrencyId) {
                prices = prices.filter(
                    (p) => p.currency_code == preferredCurrencyId
                );

                //if no matchers, then just return all
                if (!prices.length) prices = v.prices;
            }*/

            if (!prices.length) throw new Error('Prices.length is zero');

            //gather and return the output
            const price = prices.find(
                (p) => p.currency_code === store.default_currency_code
            );
            output.set(v.id, {
                originalPrice: price?.amount ?? 0,
                calculatedPrice: price?.amount ?? 0,
                originalPriceIncludesTax: false,
                prices: prices,
            });
        }

        return output;
    }
}

class VariantPriceCache extends SeamlessCache {
    constructor() {
        super(
            parseInt(
                process.env.VARIANT_PRICE_CACHE_EXPIRATION_SECONDS ?? '300'
            )
        );
    }

    async retrieve(params?: any): Promise<ProductVariant[]> {
        let variants: ProductVariant[] = await super.retrieve(params);

        //choose a way of filtering that best fits the array lengths
        if (variants && params.ids) {
            if (variants.length > params.ids.length) {
                //if short id list, this might be faster
                const outputVariants: ProductVariant[] = [];
                for (let id of params.ids) {
                    const variant = variants.find((v) => v.id === id);
                    if (variant) outputVariants.push(variant);
                }
                variants = outputVariants;
            } else {
                //if short variants list, this might be better
                variants = variants.filter((v) => params.ids.includes(v.id));
            }
        }

        return variants;
    }

    protected async getData(params: any): Promise<any> {
        return await params.productVariantRepository.find({
            relations: ['product', 'prices', 'product.store'],
        });
    }
}

// GLOBAL CACHES
const variantPriceCache: VariantPriceCache = new VariantPriceCache();
