export const getCurrencyIcon = (currencyCode: string): string => {
    // Normalize the currency code to lower case for consistency
    const normalizedCode = currencyCode.toLowerCase();

    const imagesFolder = '/images/currency-icons';

    const iconPath = `/images/currency-icons/eth.svg`;

    return iconPath;
};
