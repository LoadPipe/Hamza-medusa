import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import PriceConversionService from '../../../services/price-conversion';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/exchange-rate',
        []
    );
    const priceConversionService: PriceConversionService = req.scope.resolve(
        'priceConversionService'
    );

    await handler.handle(async () => {
        const rates = {
            'usdc-eth': await priceConversionService.getExchangeRate(
                'usdc',
                'eth'
            ),
            'eth-usdc': await priceConversionService.getExchangeRate(
                'eth',
                'usdc'
            ),
            'usdt-eth': await priceConversionService.getExchangeRate(
                'usdt',
                'eth'
            ),
            'eth-usdt': await priceConversionService.getExchangeRate(
                'eth',
                'usdt'
            ),
            'usdc-usdt': await priceConversionService.getExchangeRate(
                'usdc',
                'usdt'
            ),
            'usdt-usdc': await priceConversionService.getExchangeRate(
                'usdt',
                'usdc'
            ),
        };

        return handler.returnStatus(200, rates);
    });
};
