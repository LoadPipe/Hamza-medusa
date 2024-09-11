import {
    AbstractPriceSelectionStrategy,
    CustomerService,
    PriceSelectionContext,
    PriceSelectionResult,
    ProductVariant,
    Logger,
    Store,
    generateEntityId,
} from '@medusajs/medusa';
import { CachedExchangeRateRepository } from '../repositories/cached-exchange-rate';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';
import { CurrencyConversionClient } from '../currency-conversion/rest-client';
import { In } from 'typeorm';
import { getCurrencyAddress, getCurrencyPrecision } from '../currency.config';
import { createLogger, ILogger } from '../utils/logging/logger';

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
        const preferredCurrency: string =
            await this.getCustomerPreferredCurrency(context.customer_id);

        //get all relevant variants, including preferred currency (if any)
        return await this.getPricesForVariants(
            data.map((d) => d.variantId), //variant ids
            preferredCurrency
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

        return null;
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
        const variants: ProductVariant[] =
            await this.productVariantRepository_.find({
                where: { id: In(variantIds) },
                relations: ['product', 'prices', 'product.store'],
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
            if (preferredCurrencyId) {
                prices = prices.filter(
                    (p) => p.currency_code == preferredCurrencyId
                );

                //if no matchers, then just return all
                if (!prices.length) prices = v.prices;
            }

            //gather and return the output
            output.set(v.id, {
                originalPrice: prices.length ? prices[0].amount : 0,
                calculatedPrice: prices.length ? prices[0].amount : 0,
                originalPriceIncludesTax: false,
                prices: prices,
            });
        }

        return output;
    }
}

//TODO: change the name of this type
interface IPrice {
    baseCurrency: string;
    toCurrency: string;
    baseAmount: number;
}

const EXTENDED_LOGGING = false;

//TODO: maybe find a better place for this class
export class PriceConverter {
    private readonly restClient: CurrencyConversionClient =
        new CurrencyConversionClient();
    private readonly cache: {
        [key: string]: { value: number; timestamp: number };
    } = {};
    private readonly expirationSeconds: number = 60;
    private readonly logger: ILogger;
    private readonly cachedExchangeRateRepository: typeof CachedExchangeRateRepository;

    constructor(
        logger?: ILogger,
        cachedExchangeRateRepository?: typeof CachedExchangeRateRepository
    ) {
        this.logger = logger;
        this.cachedExchangeRateRepository = cachedExchangeRateRepository;
    }

    async convertPrice(
        baseAmount: number,
        baseCurrency: string,
        toCurrency: string
    ): Promise<number> {
        return await this.getPrice({ baseAmount, baseCurrency, toCurrency });
    }

    async getPrice(price: IPrice): Promise<number> {
        let rate: number = this.getFromCache(price);
        //this.logger?.debug(`cached rate for ${price.baseCurrency}-${price.toCurrency}: ${rate}`);

        if (!rate) {
            // First, try to fetch the rate from the API
            rate = await this.getFromApi(price);

            // If the API succeeds, save the rate to the database
            if (rate) {
                await this.saveToDatabase(price, rate);
            } else {
                // If the API fails, check the database for a cached rate
                rate = await this.getFromDatabase(price);
            }

            this.writeToCache(price, rate);
        }

        //now we need currency precisions
        const basePrecision = getCurrencyPrecision(price.baseCurrency) ?? {
            db: 2,
        };
        const toPrecision = getCurrencyPrecision(price.toCurrency) ?? { db: 2 };

        //convert the amount
        const baseFactor: number = Math.pow(10, basePrecision.db);

        if (EXTENDED_LOGGING) {
            console.log('price:', price);
            console.log('baseFactor:', baseFactor);
            console.log('basePrecision:', basePrecision);
            console.log('toPrecision:', toPrecision);
            console.log('rate:', rate);
        }

        const displayAmount = price.baseAmount / baseFactor;

        if (EXTENDED_LOGGING) console.log('displayAmount:', displayAmount);

        return Math.floor(displayAmount * rate * Math.pow(10, toPrecision.db));
    }

    private async getFromApi(price: IPrice): Promise<number> {
        //convert to addresses
        let baseAddr = getCurrencyAddress(price.baseCurrency, 1);
        let toAddr = getCurrencyAddress(price.toCurrency, 1);

        if (baseAddr.length === 0) baseAddr = price.baseCurrency;
        if (toAddr.length === 0) toAddr = price.toCurrency;

        return await this.restClient.getExchangeRate(baseAddr, toAddr);
    }

    private async getFromDatabase(price: IPrice): Promise<number> {
        try {
            const key =
                `${price.baseCurrency}-${price.toCurrency}`.toLowerCase();
            const cachedRate = await this.cachedExchangeRateRepository.findOne({
                where: { currency_code: key },
            });

            if (cachedRate) {
                this.logger?.info(
                    `Using DB-cached rate for ${price.baseCurrency} to ${price.toCurrency}: ${cachedRate.rate}`
                );
                return cachedRate.rate;
            }
        } catch (error) {
            this.logger?.error(
                `Failed to fetch exchange rate from DB for ${price.baseCurrency} to ${price.toCurrency}`,
                error
            );
        }

        return null;
    }

    private async saveToDatabase(price: IPrice, rate: number): Promise<void> {
        try {
            const key =
                `${price.baseCurrency}-${price.toCurrency}`.toLowerCase();

            // Check if the record already exists
            let existingRate = await this.cachedExchangeRateRepository.findOne({
                where: { currency_code: price.toCurrency },
            });

            if (existingRate) {
                // Update existing entry
                existingRate.rate = rate;
                existingRate.date_cached = new Date();
                await this.cachedExchangeRateRepository.save(existingRate);
            } else {
                // Insert a new entry
                await this.cachedExchangeRateRepository.save({
                    currency_code: price.toCurrency,
                    rate: rate,
                    date_cached: new Date(),
                    id: generateEntityId(),
                });
            }

            this.logger?.info(
                `Saved rate ${rate} for ${price.baseCurrency} to ${price.toCurrency} in DB`
            );
        } catch (error) {
            this.logger?.error(
                `Failed to save exchange rate to DB for ${price.baseCurrency} to ${price.toCurrency}`,
                error
            );
        }
    }

    private getFromCache(price: IPrice): number {
        const key: string = this.getKey(price.baseCurrency, price.toCurrency);
        if (
            this.cache[key] &&
            this.getTimestamp() - this.cache[key].timestamp >=
                this.expirationSeconds
        ) {
            this.cache[key] = null;
        }

        return this.cache[key]?.value;
    }

    private writeToCache(price: IPrice, rate: number) {
        const key: string = this.getKey(price.baseCurrency, price.toCurrency);
        this.cache[key] = { value: rate, timestamp: this.getTimestamp() };
    }

    private hasCached(price: IPrice): boolean {
        return this.getFromCache(price) ? true : false;
    }

    private getKey(base: string, to: string): string {
        return `${base.trim().toLowerCase()}-${to.trim().toLowerCase()}`;
    }

    private getTimestamp(): number {
        return Date.now() / 1000;
    }
}
