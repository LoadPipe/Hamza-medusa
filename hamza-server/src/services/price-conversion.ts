import { Lifetime } from 'awilix';
import { TransactionBaseService } from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';
import { PriceConverter } from '../utils/price-conversion';
import { CachedExchangeRateRepository } from '../repositories/cached-exchange-rate';
import { getCurrencyPrecision } from '../currency.config';

class PriceConversionService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly priceConverter: PriceConverter;
    protected readonly cachedExchangeRateRepository: typeof CachedExchangeRateRepository;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'PriceConversionService');
        this.cachedExchangeRateRepository =
            container.cachedExchangeRateRepository;
        this.priceConverter = new PriceConverter(
            this.logger,
            this.cachedExchangeRateRepository
        );
    }

    async getExchangeRate(from: string, to: string): Promise<any> {
        const precisionFrom = getCurrencyPrecision(from);
        const unadjustedRate = await this.convertPrice(
            Math.pow(10, precisionFrom.db ?? 1),
            from,
            to
        );
        const precisionTo = getCurrencyPrecision(to);
        return unadjustedRate / Math.pow(10, precisionTo.db ?? 1);
    }

    async convertPrice(amount: number, from: string, to: string): Promise<any> {
        return await this.priceConverter.convertPrice(amount, from, to);
    }
}

export default PriceConversionService;
