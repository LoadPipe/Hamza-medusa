import { get } from '../server/index';
import { SeamlessCache } from './seamless-cache';

/**
 * Converts actual display prices in one currency to an equivalent amount in another currency.
 * Uses cached exchange rates when possible; otherwise pulls from an API route.
 *
 * Only eth, usdc, and usdt are supported.
 * Example: convertPrice(1.05, 'usdc', 'eth')
 * Example: convertPrice(0.00348, 'eth', 'usdt')
 *
 * @param amount numeric amount, e.g. 0.0014855 - human readable price
 * @param from currency (lowercase), e.g. 'eth'
 * @param to currency (lowercase), e.g. 'usdc'
 */
export async function convertPrice(
    amount: number,
    from: string,
    to: string
): Promise<number> {
    from = from.trim().toLowerCase();
    to = to.trim().toLowerCase();

    // if keys are the same, then just return whats in db for usdt-usdc conversion.
    if (from === to) return amount;

    let key = `${from}-${to}`;

    const output = await exchangeRateCache.retrieve();

    if (!output[key])
        throw new Error(
            `Conversion from ${from} to ${to} is not supported, or some error occurred on the server side`
        );

    const rate = output[key];
    return amount * rate;
}

class ExchangeRateCache extends SeamlessCache {
    protected async getData(): Promise<any> {
        return await get('custom/exchange-rate');
    }
}

const exchangeRateCache = new ExchangeRateCache(60 * 15);
