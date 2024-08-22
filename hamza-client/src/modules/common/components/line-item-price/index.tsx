import { formatAmount } from '@lib/util/prices';
import { LineItem, Region } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';

import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { CalculatedVariant } from 'types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Text } from '@chakra-ui/react';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemPriceProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    style?: 'default' | 'tight';
    currencyCode?: string;
};

const LineItemPrice = ({
    item,
    region,
    style = 'default',
    currencyCode
}: LineItemPriceProps) => {
    const unitPrice = item.variant.prices ?
        (item.variant as CalculatedVariant).prices.find(p => p.currency_code == currencyCode)?.amount ?? 0 :
        (item.variant as CalculatedVariant)?.original_price ?? 0;
    const price = unitPrice * item.quantity;
    const hasReducedPrice = (item.total || 0) < price;

    return (
        <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
            <div className="text-left">
                {hasReducedPrice && (
                    <>
                        <p>
                            {style === 'default' && (
                                <span className="text-ui-fg-subtle">
                                    Original:{' '}
                                </span>
                            )}
                            <span className="line-through text-ui-fg-muted">
                                {formatCryptoPrice(
                                    price,
                                    currencyCode ?? 'usdc'
                                )}{' '}
                                {currencyCode?.toUpperCase() ?? 'usdc'}
                            </span>
                        </p>
                        {style === 'default' && (
                            <span className="text-ui-fg-interactive">
                                -
                                {getPercentageDiff(
                                    price,
                                    item.total || 0
                                )}
                                %
                            </span>
                        )}
                    </>
                )}
                <Text
                    as="span"
                    fontSize={{ base: '14px', md: '24px' }}
                    fontWeight={700}
                    style={{ color: 'white' }}
                    className={clx('text-base-regular', {
                        'text-ui-fg-interactive': hasReducedPrice,
                    })}
                >
                    {!isNaN(price) &&
                        formatCryptoPrice(
                            price,
                            currencyCode
                        ) +
                        ' ' +
                        (currencyCode?.toUpperCase() ?? 'USDC')}
                </Text>
            </div>
        </div>
    );
};

export default LineItemPrice;
