import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import logger from './logger';

interface CacheEntry {
  value: number; // exchange rate
  timestamp: number; // time cached
  refreshing: boolean; // true if currently refreshing
}

@Injectable()
//TODO: rename
export class CoinGeckoService {
  private cache: { [key: string]: CacheEntry } = {};
  private readonly cacheDuration = 900; // Cache duration in seconds (15 minutes)

  // Correct contract addresses
  private readonly USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  private readonly USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  private readonly ETH = '0x0000000000000000000000000000000000000000'; // Placeholder for native ETH

  constructor(private readonly httpService: HttpService) {
    this.initCache();
  }

  private async initCache(): Promise<void> {
    logger.info('Initializing cache...');
    await Promise.all([
      this.fetchConversionRate(this.USDT, 'eth'),
      this.fetchConversionRate(this.USDC, 'eth'),
      this.fetchConversionRate(this.USDT, 'cny'),
      this.fetchConversionRate(this.USDC, 'cny'),
    ])
      .then(() => {
        logger.info('Cache initialized.');
      })
      .catch((error) => {
        logger.error('Failed to populate cache at startup:', error);
      });
  }

  async convertCurrency(
    baseCurrency: string,
    conversionCurrency: string,
  ): Promise<number> {
    logger.info(`Converting ${baseCurrency} to ${conversionCurrency}...`);

    if (baseCurrency === conversionCurrency) {
      logger.debug(
        `Base and conversion currency are the same (${baseCurrency}), returning 1`,
      );
      return 1;
    }

    if (baseCurrency === 'eth' || conversionCurrency === 'eth') {
      // Handle conversion involving native ETH
      logger.debug('Handling ETH conversion');

      return this.handleEthConversion(baseCurrency, conversionCurrency);
    } else {
      // Convert between tokens
      logger.debug('Handling token-to-token conversion');

      return this.convertTokenToToken(baseCurrency, conversionCurrency);
    }
  }

  async getExchangeRate(
    baseCurrency: string,
    conversionCurrency: string,
  ): Promise<number> {
    baseCurrency = baseCurrency.trim().toLowerCase();
    conversionCurrency = conversionCurrency.trim().toLowerCase();

    //handle eth address rather than 'eth'
    if (this.isZeroAddress(baseCurrency)) baseCurrency = 'eth';
    if (this.isZeroAddress(conversionCurrency)) conversionCurrency = 'eth';

    //if A->A rate, return 1
    if (conversionCurrency === baseCurrency) return 1;

    // Check for direct caching first
    let cacheKey = this.createCacheKey(baseCurrency, conversionCurrency);
    let cachedData = this.cache[cacheKey];
    const currentTime = this.getTimestamp();

    if (cachedData && currentTime - cachedData.timestamp < this.cacheDuration) {
      logger.debug(
        `Using cached rate for ${baseCurrency} to ${conversionCurrency}`,
      );
      return cachedData.value;
    } else {
      if (cachedData) {
        if (cachedData.refreshing) return cachedData.value;

        console.log('refreshing cache for ', cacheKey);
        cachedData.refreshing = true;
      }
    }

    // Check for cross-caching
    cacheKey = this.createCacheKey(conversionCurrency, baseCurrency);
    cachedData = this.cache[cacheKey];

    if (cachedData && currentTime - cachedData.timestamp < this.cacheDuration) {
      logger.debug(
        `Using reverse cached rate for ${conversionCurrency} to ${baseCurrency}`,
      );
      return 1 / cachedData.value;
    }

    // If direct rate not cached, calculate via ETH
    if (this.isAddress(baseCurrency) && this.isAddress(conversionCurrency)) {
      const baseToEth = await this.getExchangeRate(baseCurrency, 'eth');
      const conversionToEth = await this.getExchangeRate(
        conversionCurrency,
        'eth',
      );

      const rate = baseToEth / conversionToEth;

      // Cache this calculated rate
      console.log('refreshed cache for ', cacheKey);
      this.cache[cacheKey] = {
        value: rate,
        timestamp: currentTime,
        refreshing: false,
      };
      return rate;
    }

    //handle reverse rates
    if (!this.isAddress(baseCurrency) && this.isAddress(conversionCurrency)) {
      const rate = await this.getExchangeRate(conversionCurrency, baseCurrency);
      return rate ? 1 / rate : 0;
    }

    //handle two non-contract currencies (such as cny and eth)
    if (!this.isAddress(baseCurrency) && !this.isAddress(conversionCurrency)) {
      const baseToUsdc = await this.getExchangeRate(baseCurrency, this.USDC);
      const conversionToUsdc = await this.getExchangeRate(
        conversionCurrency,
        this.USDC,
      );

      const rate = baseToUsdc / conversionToUsdc;

      // Cache this calculated rate
      console.log('refreshed cache for ', cacheKey);
      this.cache[cacheKey] = {
        value: rate,
        timestamp: currentTime,
        refreshing: false,
      };
      return rate;
    }

    // Otherwise fetch normally
    return this.fetchConversionRate(baseCurrency, conversionCurrency, true);
  }

  private async handleEthConversion(
    baseCurrency: string,
    conversionCurrency: string,
  ): Promise<number> {
    // Determine if ETH is the base or the target and call the appropriate conversion function
    if (baseCurrency === this.ETH) {
      // ETH to Token
      return this.fetchConversionRate(conversionCurrency, 'eth').then(
        (rate) => 1 / rate,
      );
    } else {
      // Token to ETH
      return this.fetchConversionRate(baseCurrency, 'eth').then((rate) => rate);
    }
  }

  private async convertTokenToToken(
    baseCurrency: string,
    conversionCurrency: string,
  ): Promise<number> {
    const baseToEth = await this.fetchConversionRate(baseCurrency, 'eth');
    const conversionToEth = await this.fetchConversionRate(
      conversionCurrency,
      'eth',
    );
    const rate = baseToEth / conversionToEth;
    return rate;
  }

  private async fetchConversionRate(
    contractAddress: string,
    vsCurrency: string,
    force: boolean = false,
  ): Promise<number> {
    const cacheKey = this.createCacheKey(contractAddress, vsCurrency);
    const cachedData = this.cache[cacheKey];
    const currentTime = this.getTimestamp();

    if (!force) {
      if (
        cachedData &&
        currentTime - cachedData.timestamp < this.cacheDuration
      ) {
        logger.debug(
          `Using cached data for ${contractAddress} to ${vsCurrency}`,
        );

        return cachedData.value;
      } else {
        if (cachedData) {
          if (cachedData.refreshing) return cachedData.value;

          logger.debug(
            `Cache for ${cacheKey} is being refreshed. Returning old value.`,
          );
          cachedData.refreshing = true;
        }
      }
    }

    let url;
    // Adjusting the endpoint based on whether the contract address is for Ethereum
    if (contractAddress === this.ETH) {
      url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${vsCurrency}`;
    } else {
      url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=${vsCurrency}`;
    }

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      if (
        !response.data ||
        (contractAddress !== this.ETH && !response.data[contractAddress]) ||
        (contractAddress === this.ETH && !response.data.ethereum)
      ) {
        throw new Error(
          `No data found for ${contractAddress} with currency ${vsCurrency}`,
        );
      }
      console.log(`Response is ${JSON.stringify(response.data)}`);
      const newValue =
        contractAddress === this.ETH
          ? response.data.ethereum[vsCurrency]
          : response.data[contractAddress][vsCurrency];
      console.log('refreshed cache for ', cacheKey);
      this.cache[cacheKey] = {
        value: newValue,
        timestamp: currentTime,
        refreshing: false,
      };
      return newValue;
    } catch (error) {
      logger.error(`Error fetching data for ${contractAddress}`, error);
      throw new Error(
        `An error occurred while fetching data for ${contractAddress}`,
      );
    }
  }

  private getTimestamp(): number {
    return new Date().getTime() / 1000;
  }

  private createCacheKey(
    baseCurrency: string,
    conversionCurrency: string,
  ): string {
    const key = `${baseCurrency.toLowerCase()}-${conversionCurrency.toLowerCase()}`;
    return key;
  }

  private isZeroAddress(value: string): boolean {
    return value.replace('0x', '').match(/^0+$/) ? true : false;
  }

  private isAddress(value: string): boolean {
    return value.trim().toLowerCase().startsWith('0x');
  }
}
