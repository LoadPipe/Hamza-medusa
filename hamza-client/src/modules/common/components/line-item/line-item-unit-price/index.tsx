import { LineItem } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { LineItemUnitPriceDisplay } from './line-item-display';
import { useEffect, useState } from 'react';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemUnitPriceProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    style?: 'default' | 'tight';
    currencyCode?: string;
    displayReducedPrice?: boolean;
    displayCurrencyLetters?: boolean;
    useChakra?: boolean;
    classNames?: string;
};

const LineItemUnitPrice = ({
    item,
    style = 'default',
    displayCurrencyLetters = true,
    displayReducedPrice = true,
    useChakra = false,
}: LineItemUnitPriceProps) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const currency = preferred_currency_code ?? 'usdc';
    const [price, setPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reducedPrice, setReducedPrice] = useState<number | null>(null);
    const [hasReducedPrice, setHasReducedPrice] = useState<boolean>(false);

    useEffect(() => {
        const fetchConvertedPrice = async () => {
            setIsLoading(true);
            try {
                const itemPrice = getPriceByCurrency(item.variant.prices, currency);
                const subTotal = Number(itemPrice) * item.quantity;
                setPrice(subTotal);

                // Calculate discount based on original_total and discount_total
                const originalTotal = item.original_total ?? null;
                const discountTotal = item.discount_total ?? null;
                if (
                    discountTotal !== null &&
                    originalTotal !== null &&
                    discountTotal < originalTotal
                ) {
                    setHasReducedPrice(true);
                    setReducedPrice(originalTotal);
                } else {
                    setHasReducedPrice(false);
                    setReducedPrice(null);
                }
            } catch (error) {
                console.error('Error converting price:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConvertedPrice();
    }, [item, currency]);

    // Calculate unit prices (for display purposes)
    const unitPrice = price / item.quantity;
    const originalUnitPrice = reducedPrice !== null ? reducedPrice / item.quantity : null;

    const buildDisplayPrice = (): string => {
        if (isLoading) return 'Loading…';
        const baseFormatted = formatCryptoPrice(price, currency);
        return displayCurrencyLetters ? `${baseFormatted} ${currency.toUpperCase()}` : String(baseFormatted);
    };

    return (
        <div className="flex flex-col text-ui-fg-muted justify-center h-full line-item-unit-price">
            {displayReducedPrice && hasReducedPrice && originalUnitPrice !== null && (
                <>
                    <p>
                        {style === 'default' && (
                            <span className="text-ui-fg-muted">Original: </span>
                        )}
                        <span className="line-through">
                            {formatCryptoPrice(originalUnitPrice, currency)} {currency.toUpperCase()}
                        </span>
                    </p>
                    {style === 'default' && (
                        <span className="text-ui-fg-interactive">
                            -{getPercentageDiff(originalUnitPrice, unitPrice)}%
                        </span>
                    )}
                </>
            )}

            <LineItemUnitPriceDisplay
                price={buildDisplayPrice()}
                preferredCurrencyCode={currency}
                useChakra={useChakra}
                classNames={clx('text-base-regular', {
                    'text-ui-fg-interactive': hasReducedPrice,
                })}
            />
        </div>
    );
};

export default LineItemUnitPrice;
