import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { formatAmount } from '@lib/util/prices';
import { RegionInfo } from '@/types/global';
import { CalculatedVariant } from '@/types/medusa';
import { getCurrencyPrecision } from '@/currency.config';
import { convertPrice } from './price-conversion';

export function getProductPrice({
    product,
    variantId,
    region,
}: {
    product: PricedProduct;
    variantId?: string;
    region: RegionInfo;
}) {
    if (!product || !product.id) {
        throw new Error('No product provided');
    }

    const getPercentageDiff = (original: number, calculated: number) => {
        const diff = original - calculated;
        const decrease = (diff / original) * 100;

        return decrease.toFixed();
    };

    const cheapestPrice = () => {
        if (!product || !product.variants?.length || !region) {
            return null;
        }

        const variants = product.variants as unknown as CalculatedVariant[];

        const cheapestVariant = variants.reduce((prev, curr) => {
            return prev.calculated_price < curr.calculated_price ? prev : curr;
        });

        return {
            calculated_price: formatAmount({
                amount: cheapestVariant.calculated_price,
                region,
                includeTaxes: false,
                currency_code: '',
            }),
            original_price: formatAmount({
                amount: cheapestVariant.original_price,
                region,
                includeTaxes: false,
                currency_code: '',
            }),
            price_type: cheapestVariant.calculated_price_type,
            percentage_diff: getPercentageDiff(
                cheapestVariant.original_price,
                cheapestVariant.calculated_price
            ),
        };
    };

    const variantPrice = () => {
        if (!product || !variantId || !region) {
            return null;
        }

        const variant = product.variants.find(
            (v) => v.id === variantId || v.sku === variantId
        ) as unknown as CalculatedVariant;

        if (!variant) {
            return null;
        }

        return {
            calculated_price: formatAmount({
                amount: variant.calculated_price,
                region,
                includeTaxes: false,
                currency_code: '',
            }),
            original_price: formatAmount({
                amount: variant.original_price,
                region,
                includeTaxes: false,
                currency_code: '',
            }),
            price_type: variant.calculated_price_type,
            percentage_diff: getPercentageDiff(
                variant.original_price,
                variant.calculated_price
            ),
        };
    };

    return {
        product,
        cheapestPrice: cheapestPrice(),
        variantPrice: variantPrice(),
    };
}

// formats crypto price (price in db) to human readable price
export function formatCryptoPrice(
    amount: number,
    currencyCode: string = 'usdc',
    roundToPrecision: boolean = true
): string | number {
    try {
        if (currencyCode === 'btc') return amount.toString();
        if (!currencyCode?.length) currencyCode = 'usdc';
        if (!amount) amount = 0;

        const currencyPrecision = getCurrencyPrecision(currencyCode);
        const displayPrecision = currencyPrecision.db ?? 2;
        amount = amount / 10 ** displayPrecision;

        let output =
            displayPrecision <= 2
                ? Number(amount).toFixed(2)
                : roundToPrecision
                  ? parseFloat(Number(amount).toFixed(displayPrecision))
                  : parseFloat(Number(amount).toString());

        if (displayPrecision > 2 && roundToPrecision) {
            output = limitPrecision(
                parseFloat(output.toString()),
                currencyPrecision.display
            );
        }

        const numericOutput =
            typeof output === 'string' ? parseFloat(output) : output;

        if (numericOutput > 999) {
            output = numericOutput.toLocaleString(undefined, {
                minimumFractionDigits: displayPrecision,
                maximumFractionDigits: displayPrecision,
            });
        }

        return output;
    } catch (e) {
        console.error(e);
        return '0.00';
    }
}

export function formatHumanReadablePrice(
    amount: number,
    currencyCode: string = 'usdc'
) {
    const currencyPrecision = getCurrencyPrecision(currencyCode);
    return amount.toFixed(currencyPrecision.display);
}

export function convertCryptoPrice(amount: number, from: string, to: string) {
    return convertPrice(amount, from, to);
}

function limitPrecision(value: number, maxDigits: number): string {
    return removeTrailingZeros(value.toFixed(maxDigits));
}

function removeTrailingZeros(value: string): string {
    if (value.indexOf('.') >= 0) {
        value = value.replace(/\.?0+$/, '');
    }
    return value;
}
