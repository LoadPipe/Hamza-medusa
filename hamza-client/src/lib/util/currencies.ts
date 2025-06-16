export const acceptedCurrencyCodesAndLabels = [
    { code: 'usdc', label: 'USDC' },
    { code: 'usdt', label: 'USDT' },
    { code: 'eth', label: 'ETH' },
    { code: 'btc', label: 'BTC' },
];

export const acceptedCurrencyCodes = acceptedCurrencyCodesAndLabels.map(
    (c) => c.code
);

export function currencyIsUsdStable(
    currencyCode: string | undefined | null
): boolean {
    return currencyCode && currencyCode.trim().toLowerCase().startsWith('us')
        ? true
        : false;
}
