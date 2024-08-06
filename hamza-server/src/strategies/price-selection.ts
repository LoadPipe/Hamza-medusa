import {
    AbstractPriceSelectionStrategy,
    CustomerService,
    PriceSelectionContext,
    PriceSelectionResult,
    ProductVariant,
    Logger,
    Store,
} from '@medusajs/medusa';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';
import { CurrencyConversionClient } from '../currency-conversion/rest-client';
import { In } from 'typeorm';
import { getCurrencyAddress, getCurrencyPrecision } from '../currency.config';
import { BigNumberish } from 'ethers';

type InjectedDependencies = {
    customerService: CustomerService;
    productVariantRepository: typeof ProductVariantRepository;
    logger: Logger;
};

export default class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
    protected readonly customerService_: CustomerService;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly logger: Logger;

    constructor({
        customerService,
        productVariantRepository,
        logger,
    }: InjectedDependencies) {
        super(arguments[0]);

        this.customerService_ = customerService;
        this.productVariantRepository_ = productVariantRepository;
        this.logger = logger;
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
        const priceConverter: PriceConverter = new PriceConverter();

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
            const baseAmount = prices.find((p) => p.currency_code === baseCurrency)?.amount;
            if (baseAmount && baseCurrency) {
                for (let n = 0; n < prices.length; n++) {
                    prices[n].amount = await priceConverter.getPrice({
                        baseAmount,
                        baseCurrency,
                        toCurrency: prices[n].currency_code
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

interface IPrice {
    baseCurrency: string;
    toCurrency: string;
    baseAmount: number;
}

//TODO: maybe find a better place for this class
export class PriceConverter {
    restClient: CurrencyConversionClient = new CurrencyConversionClient();
    cache: { [key: string]: { value: number, timestamp: number } } = {};
    expirationSeconds: 60;

    async getPrice(price: IPrice): Promise<number> {
        let rate: number = this.getFromCache(price);

        if (!rate) {
            rate = await this.getFromApi(price);
            this.writeToCache(price, rate);
        }

        //now we need currency precisions 
        const basePrecision = getCurrencyPrecision(price.baseCurrency);
        const toPrecision = getCurrencyPrecision(price.toCurrency);

        //convert the amount 
        const baseFactor: number = Math.pow(10, basePrecision.db);

        //console.log('price:', price);
        //console.log('baseFactor:', baseFactor);
        //console.log('basePrecision:', basePrecision);
        const displayAmount = price.baseAmount / baseFactor;
        //console.log('displayAmount:', displayAmount);
        return Math.floor(displayAmount * rate * Math.pow(10, toPrecision.db));
    }

    private async getFromApi(price: IPrice): Promise<number> {
        //convert to addresses 
        //TODO: get chain id another way 
        const baseAddr = getCurrencyAddress(price.baseCurrency, 10);
        const toAddr = getCurrencyAddress(price.toCurrency, 10);

        return await this.restClient.getExchangeRate(
            baseAddr,
            toAddr
        );
    }

    private getFromCache(price: IPrice): number {
        const key: string = this.getKey(price.baseCurrency, price.toCurrency);
        if (this.cache[key] && (this.getTimestamp() - this.cache[key].timestamp >= this.expirationSeconds)) {
            this.cache[key] = null;
        }

        return this.cache[key]?.value;
    }

    private writeToCache(price: IPrice, rate: number) {
        const key: string = this.getKey(price.baseCurrency, price.toCurrency);
        this.cache[key] = { value: rate, timestamp: this.getTimestamp() };
    }

    private hasCached(price: IPrice): boolean {
        return (this.getFromCache(price) ? true : false);
    }

    private getKey(base: string, to: string): string {
        return `${base.trim().toLowerCase()}-${to.trim().toLowerCase()}`;
    }

    private getTimestamp(): number {
        return Date.now() / 1000;
    }
}
