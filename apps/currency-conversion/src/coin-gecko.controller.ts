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

    @Get('/convert') // or @Get('/exch') depending on your setup
    async convertCurrencies(
        @Query('base') baseCurrency: string,
        @Query('to') toCurrency: string,
    ): Promise<string> {
        if (!baseCurrency || !toCurrency) {
            throw new HttpException(
                'Base currency and conversion currency must be provided',
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const rate = await this.coinGeckoService.getExchangeRate(
                baseCurrency,
                toCurrency,
            );
            const convertedAmount = rate * 1; // Assuming 1 unit to convert
            return `${convertedAmount} ${toCurrency}`; // Or format as needed
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

    @Get('/health')
    async getHealthCheck(
    ): Promise<{ status: string }> {
        return { status: 'ok' };
    }
}
