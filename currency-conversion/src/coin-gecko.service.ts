import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface CacheEntry {
    value: number; // Assuming conversion rates are numbers
    timestamp: number;
}

@Injectable()
export class CoinGeckoService {
    private readonly logger = new Logger(CoinGeckoService.name);
    private cache: { [key: string]: CacheEntry } = {};
    private readonly cacheDuration = 300000; // Cache duration in milliseconds (5 minutes)

    // Correct contract addresses
    private readonly USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
    private readonly USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    private readonly ETH = '0x0000000000000000000000000000000000000000'; // Placeholder for native ETH

    constructor(private readonly httpService: HttpService) { }

    async convertCurrency(
        baseCurrency: string,
        conversionCurrency: string,
    ): Promise<string> {
        if (baseCurrency === this.ETH || conversionCurrency === this.ETH) {
            // Handle conversion involving native ETH
            return this.handleEthConversion(baseCurrency, conversionCurrency);
        } else {
            // Convert between tokens
            return this.convertTokenToToken(baseCurrency, conversionCurrency);
        }
    }

    async getExchangeRate(
        baseCurrency: string,
        conversionCurrency: string,
    ): Promise<number> {
        return 1;
    }

    private async handleEthConversion(
        baseCurrency: string,
        conversionCurrency: string,
    ): Promise<string> {
        // Determine if ETH is the base or the target and call the appropriate conversion function
        if (baseCurrency === this.ETH) {
            // ETH to Token
            return this.fetchConversionRate(conversionCurrency, 'eth').then((rate) =>
                (1 / rate).toString(),
            );
        } else {
            // Token to ETH
            return this.fetchConversionRate(baseCurrency, 'eth').then((rate) =>
                rate.toString(),
            );
        }
    }

    private async convertTokenToToken(
        baseCurrency: string,
        conversionCurrency: string,
    ): Promise<string> {
        const baseToEth = await this.fetchConversionRate(baseCurrency, 'eth');
        const conversionToEth = await this.fetchConversionRate(
            conversionCurrency,
            'eth',
        );
        const rate = baseToEth / conversionToEth;
        return rate.toString();
    }

    private async fetchConversionRate(
        contractAddress: string,
        vsCurrency: string,
    ): Promise<number> {
        const cacheKey = `${contractAddress}-${vsCurrency}`;
        const cachedData = this.cache[cacheKey];
        const currentTime = new Date().getTime();

        // Check if data is in cache and not expired
        if (cachedData && currentTime - cachedData.timestamp < this.cacheDuration) {
            return cachedData.value;
        }

        // If not in cache or cache is expired, fetch new data
        const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=${vsCurrency}`;
        try {
            const response = await firstValueFrom(this.httpService.get(url));
            const newValue = response.data[contractAddress][vsCurrency];

            // Update cache with new value
            this.cache[cacheKey] = {
                value: newValue,
                timestamp: currentTime,
            };

            return newValue;
        } catch (error) {
            this.logger.error(`Error fetching data for ${contractAddress}`, error);
            throw new Error(
                `An error occurred while fetching data for ${contractAddress}`,
            );
        }
    }
}
