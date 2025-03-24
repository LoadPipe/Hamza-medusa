import { Discount, LineItem } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { CalculatedVariant } from '@/types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { LineItemUnitPriceDisplay } from './line-item-display';
import { useEffect, useState } from 'react';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemUnitPriceProps = {
    discounts: Discount[];
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    style?: 'default' | 'tight';
    currencyCode?: string;
    displayReducedPrice?: boolean;
    displayCurrencyLetters?: boolean;
    useChakra?: boolean;
    classNames?: string;
};

// Helper: calculate per-unit discount based on discount rules
function calculateUnitDiscount(
    itemVariantPrice: number,
    itemStoreId: string,
    discounts: any[] = []
): number {
    return discounts.reduce((totalDiscount, discount) => {
        if (discount.store_id === itemStoreId) {
            if (discount.rule.type === 'percentage') {
                totalDiscount += (itemVariantPrice * discount.rule.value) / 100;
            } else if (discount.rule.type === 'fixed') {
                totalDiscount += discount.rule.value;
            }
        }
        return totalDiscount;
    }, 0);
}

const LineItemUnitPrice = ({
    discounts,
    item,
    style = 'default',
    displayCurrencyLetters = true,
    displayReducedPrice = true,
    useChakra = false,
}: LineItemUnitPriceProps) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const unitPrice = item.variant.prices
        ? ((item.variant as CalculatedVariant).prices.find(
              (p) => p.currency_code === item.currency_code
          )?.amount ?? 0)
        : ((item.variant as CalculatedVariant)?.original_price ?? 0);

    console.log(`UNITPRICE ${unitPrice}`);

    const price = unitPrice * item.quantity;
    console.log(`PRICE ${price}`);

    // Calculate discount per unit using our helper.
    // Assuming item.discounts is available on the line item.
    const discountPerUnit = discounts
        ? calculateUnitDiscount(unitPrice, item.variant.store_id, discounts)
        : 0;
    const hasReducedPrice = discountPerUnit > 0;
    console.log(`hasReducedPrice ${hasReducedPrice}`);

    // Reduced unit price = original unit price minus per-unit discount.
    const reducedUnitPrice = hasReducedPrice
        ? unitPrice - discountPerUnit
        : unitPrice;
    console.log(`Reduced Unit Price ${reducedUnitPrice}`);

    // Convert price to preferred currency
    useEffect(() => {
        const fetchConvertedPrice = async () => {
            setIsLoading(true);
            try {
                const currentUnitPrice = Number(
                    getPriceByCurrency(
                        item.variant.prices,
                        preferred_currency_code ?? 'usdc'
                    )
                );

                const priceToDisplay = hasReducedPrice
                    ? currentUnitPrice -
                      calculateUnitDiscount(
                          currentUnitPrice,
                          item.variant.store_id,
                          discounts || []
                      )
                    : currentUnitPrice;

                setConvertedPrice(Number(priceToDisplay));
            } catch (error) {
                console.error('Error converting price:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConvertedPrice();
    }, [item, preferred_currency_code, unitPrice, hasReducedPrice]);

    const displayPrice = () => {
        if (isLoading) return 'Loading...';

        const priceStr =
            formatCryptoPrice(
                convertedPrice || 0,
                preferred_currency_code ?? 'usdc'
            ) +
            (displayCurrencyLetters
                ? ' ' + (preferred_currency_code ?? 'usdc').toUpperCase()
                : '');
        return priceStr;
    };

    // console.log('preferred_currency_code: ', preferred_currency_code);

    return (
        <div className="flex flex-col text-ui-fg-muted justify-center h-full line-item-unit-price">
            {displayReducedPrice && hasReducedPrice && (
                <>
                    <p>
                        {style === 'default' && (
                            <span className="text-ui-fg-muted">Original: </span>
                        )}
                        <span className="line-through">
                            {formatCryptoPrice(
                                unitPrice,
                                item.currency_code ?? ''
                            )}{' '}
                            {item.currency_code?.toUpperCase() ?? ''}
                        </span>
                    </p>
                    {style === 'default' && (
                        <span className="text-ui-fg-interactive">
                            -{getPercentageDiff(unitPrice, reducedUnitPrice)}%
                        </span>
                    )}
                </>
            )}

            <LineItemUnitPriceDisplay
                price={displayPrice().toString()}
                preferredCurrencyCode={preferred_currency_code ?? 'usdc'}
                useChakra={useChakra}
                classNames={clx('text-base-regular', {
                    'text-ui-fg-interactive': hasReducedPrice,
                })}
            />
        </div>
    );
};

export default LineItemUnitPrice;
