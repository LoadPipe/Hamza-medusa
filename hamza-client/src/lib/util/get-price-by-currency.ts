/**
 * Get the price amount of a variant in the specified currency as a string.
 *
 * @param prices - List of prices associated with a variant.
 * @param currencyCode - The preferred currency code.
 * @param fallbackCurrency - Fallback currency if preferred currency is not available.
 * @returns The price amount as a string or '0' if no matching price is found.
 */
export const getPriceByCurrency = (
    prices: Array<{ currency_code: string; amount: number }>,
    currencyCode: string,
    fallbackCurrency: string = 'usdc'
): string => {
    if (!prices || !Array.isArray(prices)) {
        console.error('Invalid prices array');
        return '0';
    }

    const price =
        prices.find((p) => p.currency_code === currencyCode) ||
        prices.find((p) => p.currency_code === fallbackCurrency);

    return price?.amount?.toString() ?? '0';
};
