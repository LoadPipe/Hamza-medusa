import { formatAmount } from '@lib/util/prices';
import { LineItem, Region } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';

import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { CalculatedVariant } from 'types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useCustomerProfileStore } from '@store/customer-profile/customer-profile';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemPriceProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    style?: 'default' | 'tight';
};

const LineItemPrice = ({
    item,
    region,
    style = 'default',
}: LineItemPriceProps) => {
    const { perferredCurrency } = useCustomerProfileStore();
    const [price, setPrice] = useState<number | null>(null);
    const [reducedPrice, setReducedPrice] = useState<number | null>(null);
    const [hasReducedPrice, setHasReducedPrice] = useState<boolean>(false);

    useEffect(() => {
        const originalTotal = item.original_total ?? null;
        const totalItemAmount = item.subtotal ?? null;
        const discountTotal = item.discount_total ?? null;
        setPrice(totalItemAmount);
        setReducedPrice(reducedPrice);
        if (
            discountTotal !== null &&
            originalTotal !== null &&
            discountTotal < originalTotal
        ) {
            setHasReducedPrice(true);
        }
    }, [item]);

    return (
        <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
            <div className="text-left">
                {hasReducedPrice && reducedPrice !== null && (
                    <>
                        <p>
                            {style === 'default' && (
                                <span className="text-ui-fg-subtle">
                                    Original:{' '}
                                </span>
                            )}
                            <span className="line-through text-ui-fg-muted">
                                {formatCryptoPrice(
                                    reducedPrice,
                                    perferredCurrency ?? 'usdc'
                                )}{' '}
                                {perferredCurrency?.toUpperCase()}
                            </span>
                        </p>
                        {style === 'default' && (
                            <span className="text-ui-fg-interactive">
                                -
                                {getPercentageDiff(
                                    reducedPrice,
                                    item.total || 0
                                )}
                                %
                            </span>
                        )}
                    </>
                )}{' '}
                <Text
                    as="span"
                    fontSize={{ base: '14px', md: '24px' }}
                    fontWeight={700}
                    style={{ color: 'white' }}
                    className={clx('text-base-regular', {
                        'text-ui-fg-interactive': hasReducedPrice,
                    })}
                >
                    {price && perferredCurrency && (
                        <>
                            {formatCryptoPrice(price, perferredCurrency) +
                                ' ' +
                                perferredCurrency?.toUpperCase()}
                        </>
                    )}
                </Text>
            </div>
        </div>
    );
};

export default LineItemPrice;
