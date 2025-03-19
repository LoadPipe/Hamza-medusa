import { LineItem } from '@medusajs/medusa';
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
    const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const unitPrice = item.variant.prices
        ? ((item.variant as CalculatedVariant).prices.find(
            (p) => p.currency_code === item.currency_code
        )?.amount ?? 0)
        : ((item.variant as CalculatedVariant)?.original_price ?? 0);

    const price = unitPrice * item.quantity;
    const hasReducedPrice = (price || 0) > (item.total || 0);
    const originalReducedPrice = hasReducedPrice ? (item.total || 0) / item.quantity! : null;

    // Convert price to preferred currency
    useEffect(() => {
        const fetchConvertedPrice = async () => {
            setIsLoading(true);
            try {
                const currentUnitPrice = Number(getPriceByCurrency(
                    item.variant.prices,
                    preferred_currency_code ?? 'usdc'
                ));

                const priceToDisplay = hasReducedPrice && originalReducedPrice !== null
                    ? (currentUnitPrice * (originalReducedPrice / unitPrice))
                    : currentUnitPrice;

                setConvertedPrice(Number(priceToDisplay));
            } catch (error) {
                console.error('Error converting price:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConvertedPrice();
    }, [item, preferred_currency_code, unitPrice, originalReducedPrice, hasReducedPrice]);

    const displayPrice = () => {
        if (isLoading) return "Loading...";

        const price =
            formatCryptoPrice(
                convertedPrice || 0,
                preferred_currency_code ?? 'usdc'
            ) +
            (displayCurrencyLetters
                ? ' ' + (preferred_currency_code ?? 'usdc').toUpperCase()
                : '');
        return price;
    };

    // console.log('preferred_currency_code: ', preferred_currency_code);

    return (
        <div className="flex flex-col text-ui-fg-muted justify-center h-full line-item-unit-price">
            {displayReducedPrice && hasReducedPrice && originalReducedPrice !== null && (
                <>
                    <p>
                        {style === 'default' && (
                            <span className="text-ui-fg-muted">Original: </span>
                        )}
                        <span className="line-through">
                            {formatCryptoPrice(unitPrice, item.currency_code ?? '')} {item.currency_code?.toUpperCase() ?? ''}
                        </span>
                    </p>
                    {style === 'default' && (
                        <span className="text-ui-fg-interactive">
                            -{getPercentageDiff(unitPrice, originalReducedPrice)}%
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
