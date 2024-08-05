import {
    Controller,
    Get,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CoinGeckoService } from './coin-gecko.service';

@Controller('convert')
export class CoinGeckoController {
    constructor(private readonly coinGeckoService: CoinGeckoService) { }

    @Get('/convert')
    async convertCurrencies(
        @Query('base') baseCurrency: string,
        @Query('to') conversionCurrency: string,
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

    @Get('/exch')
    async getExchangeRate(
        @Query('base') baseCurrency: string,
        @Query('to') conversionCurrency: string,
    ): Promise<number> {
        if (!baseCurrency || !conversionCurrency) {
            throw new HttpException(
                'Base currency and conversion currency must be provided',
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            return await this.coinGeckoService.getExchangeRate(
                baseCurrency,
                conversionCurrency,
            );
        } catch (error) {
            throw new HttpException(
                'Failed to get exchange rate',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
