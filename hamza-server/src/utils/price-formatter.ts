import { getCurrencyPrecision } from '../currency.config';

export function formatCryptoPrice(
    amount: number,
    currencyCode: string
): string | number {
    try {
        if (!currencyCode?.length)
            currencyCode = 'usdc';
        if (!amount) amount = 0;
        const displayPrecision = getCurrencyPrecision(currencyCode).db ?? 2;
        amount = amount / 10 ** displayPrecision;

        return displayPrecision <= 2
            ? Number(amount).toFixed(2)
            : parseFloat(Number(amount).toFixed(displayPrecision));
    } catch (e) {
        console.error(e);
        return '0.00';
    }
}
