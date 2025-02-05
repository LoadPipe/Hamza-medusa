import { LineItem } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { CalculatedVariant } from '@/types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { LineItemUnitPriceDisplay } from './line-item-display';

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
    currencyCode,
    displayCurrencyLetters = true,
    displayReducedPrice = true,
    useChakra = false,
}: LineItemUnitPriceProps) => {
    const { preferred_currency_code } = useCustomerAuthStore();

    const unitPrice = item.variant.prices
        ? ((item.variant as CalculatedVariant).prices.find(
              (p) => p.currency_code == currencyCode
          )?.amount ?? 0)
        : ((item.variant as CalculatedVariant)?.original_price ?? 0);
    const price = unitPrice * item.quantity;
    const hasReducedPrice = (price * item.quantity || 0) > item.total!;
    const reducedPrice = (item.total || 0) / item.quantity!;

    const displayPrice = () => {
        const price =
            formatCryptoPrice(
                reducedPrice || item.unit_price || 0,
                item.currency_code ?? ''
            ) +
            (displayCurrencyLetters
                ? ' ' + item.currency_code?.toUpperCase()
                : '');
        return price;
    };

    // console.log('preferred_currency_code: ', preferred_currency_code);

    return (
        <div className="flex flex-col text-ui-fg-muted justify-center h-full">
            {displayReducedPrice && hasReducedPrice && (
                <>
                    <p>
                        {style === 'default' && (
                            <span className="text-ui-fg-muted">Original: </span>
                        )}
                        <span className="line-through">
                            {formatCryptoPrice(price, item.currency_code ?? '')}{' '}
                            {item.currency_code?.toUpperCase() ?? ''}
                        </span>
                    </p>
                    {style === 'default' && (
                        <span className="text-ui-fg-interactive">
                            -{getPercentageDiff(price, reducedPrice || 0)}%
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
