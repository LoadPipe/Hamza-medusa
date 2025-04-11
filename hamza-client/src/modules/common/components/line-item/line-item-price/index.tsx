import { LineItem } from '@medusajs/medusa';
import Image from 'next/image';
import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { convertCryptoPrice } from '@lib/util/get-product-price';
import { useCartStore } from '@/zustand/cart-store/cart-store';

// TODO: Can this be removed?
type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemPriceProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    usdcOnDifferentLine?: boolean;
};

const LineItemPrice = ({ item }: LineItemPriceProps) => {
    const [price, setPrice] = useState<number>(0);
    const [convertedUSDPrice, setConvertedUSDPrice] = React.useState<
        string | null
    >(null);
    const [reducedPrice, setReducedPrice] = useState<number | null>(null);
    const [hasReducedPrice, setHasReducedPrice] = useState<boolean>(false);
    const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
    const [loadingUSDPrice, setLoadingUSDPrice] = useState<boolean>(false);
    const { preferred_currency_code } = useCustomerAuthStore();
    const isUpdating = useCartStore((state) => state.isUpdating);

    useEffect(() => {
        setLoadingPrice(true);
        const itemPrice = getPriceByCurrency(
            item.variant.prices,
            preferred_currency_code ?? 'usdc'
        );

        const subTotal = Number(itemPrice) * item.quantity;
        setPrice(subTotal);

        const originalTotal = item.original_total ?? null;
        const totalItemAmount =
            item.subtotal ?? Number(itemPrice) * item.quantity;
        const discountTotal = item.discount_total ?? null;

        setReducedPrice(reducedPrice);

        setLoadingPrice(false);
        if (
            discountTotal !== null &&
            originalTotal !== null &&
            discountTotal < originalTotal
        ) {
            setHasReducedPrice(true);
        }
    }, [item, preferred_currency_code, reducedPrice]);

    useEffect(() => {
        const fetchConvertedPrice = async () => {
            setLoadingUSDPrice(true);
            try {
                const result = await convertCryptoPrice(
                    Number(
                        formatCryptoPrice(
                            price,
                            preferred_currency_code ?? 'usdc'
                        )
                    ),
                    preferred_currency_code ?? 'usdc',
                    'usdc'
                );
                setConvertedUSDPrice(Number(result).toFixed(2));
                setLoadingUSDPrice(false);
            } catch (error) {
                console.error('Error converting price:', error);
                setLoadingUSDPrice(false);
            }
        };

        if (preferred_currency_code === 'eth') {
            fetchConvertedPrice();
        }
    }, [price, preferred_currency_code]);

    return (
        <div className="flex flex-col text-ui-fg-subtle items-end line-item-price">
            <div className="text-left">
                {hasReducedPrice && reducedPrice !== null && (
                    <>
                        <p>
                            <span className="text-ui-fg-subtle">
                                Original:{' '}
                            </span>

                            <span className="line-through text-ui-fg-muted">
                                {formatCryptoPrice(
                                    reducedPrice,
                                    preferred_currency_code ?? 'usdt'
                                )}{' '}
                                {preferred_currency_code?.toUpperCase()}
                            </span>
                        </p>

                        <span className="text-ui-fg-interactive">
                            -{getPercentageDiff(reducedPrice, item.total || 0)}%
                        </span>
                    </>
                )}

                {price > 0 && (
                    <Flex flexDirection={'row'} alignItems="center">
                        {/* Currency Icon */}
                        <Flex alignItems={'center'}>
                            <Text
                                mr={{ base: '0.4rem', md: '0.5rem' }}
                                fontSize={{ base: '12px', md: '14px' }}
                                fontWeight={700}
                                position="relative"
                                color={'white'}
                            >
                                Total:
                            </Text>
                            <Image
                                className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]"
                                src={
                                    currencyIcons[
                                        preferred_currency_code ?? 'usdc'
                                    ]
                                }
                                alt={preferred_currency_code ?? 'usdc'}
                            />
                        </Flex>

                        {/* Spinner or Base Price */}
                        {loadingPrice || isUpdating ? (
                            <Spinner
                                size="sm"
                                color="white"
                                ml={{ base: '0.4rem', md: '0.5rem' }}
                            />
                        ) : (
                            <Text
                                ml={{ base: '0.4rem', md: '0.5rem' }}
                                fontSize={{ base: '12px', md: '16px' }}
                                fontWeight={700}
                                position="relative"
                                color={'white'}
                            >
                                {formatCryptoPrice(
                                    price,
                                    preferred_currency_code ?? 'usdc'
                                )}
                            </Text>
                        )}

                        {/* Spinner or Converted Price */}
                        {preferred_currency_code === 'eth' && (
                            <>
                                {loadingUSDPrice && isUpdating ? (
                                    <Spinner size="sm" color="white" ml={1} />
                                ) : (
                                    <Text
                                        ml={1}
                                        as="h3"
                                        variant="semibold"
                                        color="white"
                                        fontSize={{ base: '12px', md: '16px' }}
                                        fontWeight={700}
                                        textAlign="right"
                                    >
                                        {`≅  $${convertedUSDPrice} USD`}
                                    </Text>
                                )}
                            </>
                        )}
                    </Flex>
                )}
            </div>
        </div>
    );
};

export default LineItemPrice;
