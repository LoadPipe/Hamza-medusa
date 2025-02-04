import { MoneyAmount } from '@medusajs/medusa';

import { Region, Variant } from '@/types/medusa';

import { isEmpty } from './isEmpty';
import { ProductVariantInfo, RegionInfo } from '../../types/global';
import { noDivisionCurrencies } from '@/lib/config/constants';
import { formatCryptoPrice } from './get-product-price';

export const findCheapestRegionPrice = (
    variants: Variant[],
    regionId: string
) => {
    const regionPrices = variants.reduce((acc: any, v: any) => {
        if (!v.prices) {
            return acc;
        }

        const price = v.prices.find((p: any) => p.region_id === regionId);
        if (price) {
            acc.push(price);
        }

        return acc;
    }, [] as MoneyAmount[]);

    if (!regionPrices.length) {
        return undefined;
    }

    //find the price with the lowest amount in regionPrices
    const cheapestPrice = regionPrices.reduce((acc: any, p: any) => {
        if (acc.amount > p.amount) {
            return p;
        }

        return acc;
    });

    return cheapestPrice;
};

export const findCheapestCurrencyPrice = (
    variants: Variant[],
    currencyCode: string
) => {
    const currencyPrices = variants.reduce((acc: any, v: any) => {
        if (!v.prices) {
            return acc;
        }

        const price = v.prices.find(
            (p: any) => p.currency_code === currencyCode
        );
        if (price) {
            acc.push(price);
        }

        return acc;
    }, [] as MoneyAmount[]);

    if (!currencyPrices.length) {
        return undefined;
    }

    //find the price with the lowest amount in currencyPrices
    const cheapestPrice = currencyPrices.reduce((acc: any, p: any) => {
        if (acc.amount > p.amount) {
            return p;
        }

        return acc;
    });

    return cheapestPrice;
};

export const findCheapestPrice = (variants: Variant[], region: Region) => {
    const { id, currency_code } = region;

    let cheapestPrice = findCheapestRegionPrice(variants, id);

    if (!cheapestPrice) {
        cheapestPrice = findCheapestCurrencyPrice(variants, currency_code);
    }

    if (cheapestPrice) {
        return formatAmount({
            amount: cheapestPrice.amount,
            currency_code: currency_code,
            region: region,
        });
    }

    // if we can't find any price that matches the current region,
    // either by id or currency, then the product is not available in
    // the current region
    return 'Not available in your region';
};

type FormatVariantPriceParams = {
    variant: ProductVariantInfo;
    region: RegionInfo;
    currency_code: string;
    includeTaxes?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
};

/**
 * Takes a product variant and a region, and converts the variant's price to a localized decimal format
 */
export const formatVariantPrice = ({
    variant,
    currency_code,
    region,
    includeTaxes = true,
    ...rest
}: FormatVariantPriceParams) => {
    const amount = computeVariantPrice({
        variant,
        region,
        includeTaxes,
        currency_code,
    });

    return convertToLocale({
        amount,
        currency_code,
        ...rest,
    });
};

type ComputeVariantPriceParams = {
    variant: ProductVariantInfo;
    region: RegionInfo;
    includeTaxes?: boolean;
    currency_code: string;
};

/**
 * Takes a product variant and region, and returns the variant price as a decimal number
 * @param params.variant - product variant
 * @param params.region - region
 * @param params.includeTaxes - whether to include taxes or not
 */
export const computeVariantPrice = ({
    variant,
    region,
    currency_code,
    includeTaxes = true,
}: ComputeVariantPriceParams) => {
    const amount = getVariantPrice(variant, region, currency_code);

    return computeAmount({
        amount,
        currency_code,
        region,
        includeTaxes,
    });
};

/**
 * Finds the price amount correspoding to the region selected
 * @param variant - the product variant
 * @param region - the region
 * @returns - the price's amount
 */
export const getVariantPrice = (
    variant: ProductVariantInfo,
    region: RegionInfo,
    currency_code: string
) => {
    const price = variant?.prices?.find(
        (p) => p.currency_code.toLowerCase() === currency_code?.toLowerCase()
    );

    return price?.amount || 0;
};

type ComputeAmountParams = {
    amount: number;
    currency_code: string;
    region: RegionInfo;
    includeTaxes?: boolean;
};

/**
 * Takes an amount, a region, and returns the amount as a decimal including or excluding taxes
 */
export const computeAmount = ({
    amount,
    currency_code,
    region,
    includeTaxes = true,
}: ComputeAmountParams) => {
    const toDecimal = convertToDecimal(amount, region);

    const taxRate = includeTaxes ? getTaxRate(region) : 0;

    const amountWithTaxes = toDecimal * (1 + taxRate);

    return amountWithTaxes;
};

type FormatAmountParams = {
    amount: number;
    region: RegionInfo;
    currency_code: string;
    includeTaxes?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
};

/**
 * Takes an amount and a region, and converts the amount to a localized decimal format
 */
export const formatAmount = ({
    amount,
    currency_code,
    region,
    includeTaxes = true,
    ...rest
}: FormatAmountParams) => {
    const taxAwareAmount = computeAmount({
        amount,
        currency_code,
        region,
        includeTaxes,
    });

    return `${parseInt(amount.toString()).toFixed(2)} ${currency_code.toUpperCase()}`;
    return convertToLocale({
        amount: taxAwareAmount,
        currency_code,
        ...rest,
    });
};
const convertToDecimal = (amount: number, region: RegionInfo) => {
    const divisor = noDivisionCurrencies.includes(
        region?.currency_code?.toLowerCase()
    )
        ? 1
        : 100;

    return Math.floor(amount) / divisor;
};

const getTaxRate = (region?: RegionInfo) => {
    return region && !isEmpty(region) ? region?.tax_rate / 100 : 0;
};

const traditionalCurrencies = ['usdc', 'eth', 'usdt']; // Add more as needed

const convertToLocale = ({
    amount = 0,
    currency_code = '',
    minimumFractionDigits = 2, // Default value if not provided
    maximumFractionDigits = 2,
    locale = 'en-US',
}): ConvertToLocaleParams => {
    if (typeof currency_code !== 'string' || !currency_code) {
        currency_code = 'usdc';
        /*
        console.error('Invalid or missing currency code', currency_code);
        return {
            amount,
            currency_code,
            minimumFractionDigits,
            maximumFractionDigits
        }
        */
    }

    let formattedAmount;

    if (traditionalCurrencies.includes(currency_code.toUpperCase())) {
        formattedAmount = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency_code,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(amount);
    } else {
        // Custom handling for non-standard currency codes
        formattedAmount = `${amount.toFixed(minimumFractionDigits)} ${currency_code.toUpperCase()}`;
    }

    return {
        amount: amount,
        currency_code: currency_code.toUpperCase(),
        minimumFractionDigits,
        maximumFractionDigits,
    };
};

export const formatPriceBetweenCurrencies = (
    variant_prices: Array<any>,
    from_currency_code: string,
    to_currency_code: string
) => {
    let formattedPrice: string | number = '';
    if (from_currency_code === 'eth') {
        const fromPrice =
            variant_prices.find(
                (price: any) => price.currency_code === to_currency_code
            )?.amount || variant_prices?.[0]?.amount;
        formattedPrice = formatCryptoPrice(fromPrice ?? 0, to_currency_code);
    }
    return formattedPrice;
};

type ConvertToLocaleParams = {
    amount: number;
    currency_code: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
};
