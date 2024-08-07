import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface CacheEntry {
  value: number; // Assuming conversion rates are numbers
  timestamp: number;
}

@Injectable()
//TODO: rename
export class CoinGeckoService {
  private readonly logger = new Logger(CoinGeckoService.name);
  private cache: { [key: string]: CacheEntry } = {};
  private readonly cacheDuration = 300000; // Cache duration in milliseconds (5 minutes)

  // Correct contract addresses
  private readonly USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  private readonly USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  private readonly ETH = '0x0000000000000000000000000000000000000000'; // Placeholder for native ETH

  constructor(private readonly httpService: HttpService) {
    this.initCache();
  }

  private async initCache(): Promise<void> {
    this.logger.log('Initializing cache...');
    await Promise.all([
      this.fetchAndCacheConversionRate(this.USDT, 'eth'),
      this.fetchAndCacheConversionRate(this.USDC, 'eth'),
    ])
      .then(() => {
        this.logger.log('Cache initialized for ETH to USDT and ETH to USDC.');
      })
      .catch((error) => {
        this.logger.error('Failed to populate cache at startup:', error);
      });
  }

  private async fetchAndCacheConversionRate(
    contractAddress: string,
    vsCurrency: string,
  ): Promise<void> {
    try {
      const rate = await this.fetchConversionRate(contractAddress, vsCurrency);
      console.log(
        `Fetched rate for ${contractAddress} to ${vsCurrency}:`,
        rate,
      );
      const cacheKey = `${contractAddress}-${vsCurrency}`;
      this.cache[cacheKey] = { value: rate, timestamp: new Date().getTime() };
      this.logger.log(`Cached ${contractAddress} to ${vsCurrency} rate.`);
    } catch (error) {
      this.logger.error(
        `Failed to fetch and cache rate for ${contractAddress} to ${vsCurrency}:`,
        error,
      );
    }
  }

  async convertCurrency(
    baseCurrency: string,
    conversionCurrency: string,
  ): Promise<string> {
    if (baseCurrency === 'eth' || conversionCurrency === 'eth') {
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
    // Check for direct caching first
    let cacheKey = `${baseCurrency}-${conversionCurrency}`;
    let cachedData = this.cache[cacheKey];
    const currentTime = new Date().getTime();

    if (cachedData && currentTime - cachedData.timestamp < this.cacheDuration) {
      return cachedData.value;
    }

    // If direct rate not cached, calculate via ETH
    if (baseCurrency !== 'eth' && conversionCurrency !== 'eth') {
      const baseToEth = await this.fetchConversionRate(baseCurrency, 'eth');
      const conversionToEth = await this.fetchConversionRate(
        conversionCurrency,
        'eth',
      );
      const rate = baseToEth / conversionToEth;

      // Cache this calculated rate
      this.cache[cacheKey] = { value: rate, timestamp: currentTime };
      return rate;
    }

    // Otherwise fetch normally
    return this.fetchConversionRate(baseCurrency, conversionCurrency);
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

    if (cachedData && currentTime - cachedData.timestamp < this.cacheDuration) {
      console.log(`Using cached data for ${contractAddress} to ${vsCurrency}`);
      return cachedData.value;
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
      this.cache[cacheKey] = { value: newValue, timestamp: currentTime };
      return newValue;
    } catch (error) {
      this.logger.error(`Error fetching data for ${contractAddress}`, error);
      throw new Error(
        `An error occurred while fetching data for ${contractAddress}`,
      );
    }
  }
}
