import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CoinGeckoService } from './coin-gecko.service';

@Controller('gecko')
export class CoinGeckoController {
  constructor(private readonly coinGeckoService: CoinGeckoService) {}

  @Get('/convert')
  async convertCurrencies(
    @Query('baseCurrency') baseCurrency: string,
    @Query('conversionCurrency') conversionCurrency: string,
  ): Promise<string> {
    if (!baseCurrency || !conversionCurrency) {
      throw new HttpException(
        'Base currency and conversion currency must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.coinGeckoService.convertCurrency(
        baseCurrency,
        conversionCurrency,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to convert currencies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
