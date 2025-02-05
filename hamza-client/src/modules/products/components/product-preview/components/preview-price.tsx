'use client';
import { Text, clx } from '@medusajs/ui';
import { PriceType } from '../../product-actions';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { formatCryptoPrice } from '@lib/util/get-product-price';

export default function PreviewPrice({
    prices,
}: {
    prices: { currency_code: string; amount: number }[];
}) {
    const { preferred_currency_code, authData } = useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    let preferredPrice =
        (authData.status == 'authenticated' &&
            preferred_currency_code &&
            prices.find((a) => a.currency_code == preferred_currency_code)) ||
        null;

    return (
        <div className="flex flex-col space-y-1">
            {preferredPrice ? (
                <Text
                    key={preferredPrice.currency_code}
                    className={clx(
                        'text-ui-fg-muted font-bold text-white text-ui-fg-interactive font-bold text-white'
                    )}
                >
                    {formatCryptoPrice(
                        preferredPrice.amount,
                        preferredPrice.currency_code
                    )}{' '}
                    {preferredPrice.currency_code.toUpperCase()}
                </Text>
            ) : (
                <>
                    {prices.map((price) => {
                        return (
                            <Text
                                key={price.currency_code}
                                className={clx(
                                    'text-ui-fg-muted font-bold text-white text-ui-fg-interactive font-bold text-white'
                                )}
                            >
                                {formatCryptoPrice(
                                    price.amount,
                                    price.currency_code
                                )}{' '}
                                {price.currency_code.toUpperCase()}
                            </Text>
                        );
                    })}
                </>
            )}
        </div>
    );
}
