import { CachedExchangeRateRepository } from '../../repositories/cached-exchange-rate';
import { CurrencyConversionClient } from '../../currency-conversion/rest-client';
import { getCurrencyAddress, getCurrencyPrecision } from '../../currency.config';
import { ILogger } from '../logging/logger';
import { CachedExchangeRate } from '../../models/cached-exchange-rate';
import { SeamlessCache } from '../cache/seamless-cache';

//TODO: change the name of this type
interface IPrice {
    baseCurrency: string;
    toCurrency: string;
    baseAmount: number;
}

const EXTENDED_LOGGING = false;

//TODO: move to SeamlessCache
const cache: {
    [key: string]: { value: number; timestamp: number };
} = {};

export class PriceConverter {
    private readonly restClient: CurrencyConversionClient =
        new CurrencyConversionClient();
    private readonly MEMORY_CACHE_EXPIRATION_SECONDS: number = 120;
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

        if (price.baseAmount === 0)
            return 0;

        //if identity, return as such
        if (price.baseCurrency == price.toCurrency)
            return price.baseAmount;

        // Step 1: Try to get the rate from the cache
        let rate: number = this.getFromCache(price);
        let usingRateFromDb: boolean = false;

        if (!rate) {
            // Step 2: Try to get the rate from the API
            rate = await this.getFromApi(price);
            if (EXTENDED_LOGGING) console.log("GOT RATE FROM API")

            if (rate) {
                if (EXTENDED_LOGGING) console.log("CACHING RATE")
                // Step 3: Write to cache & save to DB
                this.writeToCache(price, rate);
            } else {
                // Step 5: If API fails, fallback to database
                const dbResult = await this.getFromDatabase(price);
                if (dbResult) {
                    usingRateFromDb = true;
                    if (EXTENDED_LOGGING) console.log("USING RATE FROM DB")
                    this.logger?.info(
                        `Using DB-cached rate for ${price.baseCurrency} to ${price.toCurrency}: ${dbResult.rate}`
                    );
                    rate = dbResult.rate;
                } else {
                    // If the rate is not found in the database, throw an error
                    this.logger?.error(
                        `Unable to retrieve exchange rate for ${price.baseCurrency} to ${price.toCurrency}`
                    );
                    throw new Error(
                        `Unable to retrieve exchange rate for ${price.baseCurrency} to ${price.toCurrency}`
                    );
                }
            }
        }

        this.refreshDbCache();

        // Now handle currency precisions
        const basePrecision = getCurrencyPrecision(price.baseCurrency) ?? {
            db: 2,
        };
        const toPrecision = getCurrencyPrecision(price.toCurrency) ?? { db: 2 };

        // Convert the amount
        const baseFactor: number = Math.pow(10, basePrecision.db);

        if (EXTENDED_LOGGING) {
            console.log('price:', price);
            console.log('baseFactor:', baseFactor);
            console.log('basePrecision:', basePrecision);
            console.log('toPrecision:', toPrecision);
            console.log('rate:', rate);
        }

        const displayAmount = price.baseAmount / baseFactor;

        if (EXTENDED_LOGGING) {
            console.log('displayAmount:', displayAmount);
        }

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

    private async getFromDatabase(
        price: IPrice
    ): Promise<CachedExchangeRate | null> {
        try {
            const id =
                `${price.baseCurrency}-${price.toCurrency}`.toLowerCase();

            const cachedRate = await this.cachedExchangeRateRepository.findOne({
                where: { id },
            });

            if (cachedRate) {
                return cachedRate;
            }
        } catch (error) {
            this.logger?.error(
                `Failed to fetch exchange rate from DB for ${price.baseCurrency} to ${price.toCurrency}`,
                error
            );
        }

        return null;
    }

    private async refreshDbCache() {
        const args = [];

        for (let key in cache) {
            const parts = key.split('-');
            const baseCurrency = parts[0];
            const toCurrency = parts[1];
            args.push({
                key,
                toCurrency,
                baseCurrency,
                rate: cache[key]?.value ?? 0
            });
        }

        dbCache.retrieve({
            cachedExchangeRateRepository: this.cachedExchangeRateRepository,
            logger: this.logger,
            args
        });
        if (EXTENDED_LOGGING) console.log("SAVED TO DB")
    }

    private getFromCache(price: IPrice): number {
        const key: string = this.getKey(price.baseCurrency, price.toCurrency);
        if (
            cache[key] &&
            this.getTimestamp() - cache[key].timestamp >=
            this.MEMORY_CACHE_EXPIRATION_SECONDS
        ) {
            cache[key] = null;
        }

        return cache[key]?.value;
    }

    private writeToCache(price: IPrice, rate: number) {
        const key: string = this.getKey(price.baseCurrency, price.toCurrency);
        cache[key] = { value: rate, timestamp: this.getTimestamp() };
    }

    private getKey(base: string, to: string): string {
        return `${base.trim().toLowerCase()}-${to.trim().toLowerCase()}`;
    }

    private getTimestamp(): number {
        return Date.now() / 1000;
    }
}


class ExchangeRateDbCache extends SeamlessCache {
    private sharedMem: SharedArrayBuffer = new SharedArrayBuffer(64);
    private saving: BigInt64Array = new BigInt64Array(this.sharedMem);

    constructor() {
        super(60);
    }

    async retrieve(params: {
        cachedExchangeRateRepository: typeof CachedExchangeRateRepository,
        logger?: ILogger,
        args: {
            rate: number,
            key: string,
            toCurrency: string,
            baseCurrency: string
        }[]
    }): Promise<any> {
        return await super.retrieve(params);
    }

    protected async getData(params: any): Promise<any> {
        const output = [];
        const random = Math.random();
        try {
            const result = (Atomics.compareExchange(this.saving, 0, BigInt(0), BigInt(1)));
            if (result === BigInt(0)) {
                //console.log('INSIDE OF THE MUTEX', random);

                try {
                    for (let args of params.args) {

                        if (args.rate) {
                            // check if we need to save to the database (every 5 minutes max)
                            let existingRate = await params.cachedExchangeRateRepository.findOne({
                                where: { id: args.key },
                            });

                            if ((existingRate?.updated_at ?? 0) < new Date(Date.now() - 60 * 1000)) {
                                // Insert a new entry

                                //check once before before insert
                                existingRate = await params.cachedExchangeRateRepository.findOne({
                                    where: { id: args.key },
                                });

                                //console.log('SAVING ', args.key, random);
                                output.push(await params.cachedExchangeRateRepository.save({
                                    id: args.key,
                                    to_currency_code: args.toCurrency,
                                    from_currency_code: args.baseCurrency,
                                    rate: args.rate,
                                }));

                                params.logger?.debug(
                                    `Saved rate ${args.rate} for ${args.key} in DB`
                                );
                            }
                        }
                    }
                }
                catch (e) {
                    params.logger?.error(
                        `Failed to save exchange rate to DB`,
                        e
                    );
                }

                //console.log('RESETTNG FLAG', random);
                this.saving[0] = BigInt(0);
            }
        } catch (error) {
            params.logger?.error(
                `Failed to save exchange rates to DB`,
                error
            );
        }

        return output;
    }
}

const dbCache: ExchangeRateDbCache = new ExchangeRateDbCache();