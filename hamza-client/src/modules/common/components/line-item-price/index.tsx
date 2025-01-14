import { LineItem } from '@medusajs/medusa';
import Image from 'next/image';
import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { convertCryptoPrice } from '@lib/util/get-product-price';

// TODO: Can this be removed?
type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemPriceProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
};

const LineItemPrice = ({ item }: LineItemPriceProps) => {
    const [price, setPrice] = useState<number>(0);
    const [convertedUSDPrice, setConvertedUSDPrice] = React.useState<
        string | null
    >(null);
    const [reducedPrice, setReducedPrice] = useState<number | null>(null);
    const [hasReducedPrice, setHasReducedPrice] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { preferred_currency_code } = useCustomerAuthStore();

    useEffect(() => {
        setLoading(true);
        const itemPrice = getPriceByCurrency(
            item.variant.prices,
            preferred_currency_code ?? 'usdc'
        );

        const subTotal = Number(itemPrice) * item.quantity;
        setPrice(subTotal);
        setLoading(false);

        const originalTotal = item.original_total ?? null;
        const totalItemAmount =
            item.subtotal ?? Number(itemPrice) * item.quantity;
        const discountTotal = item.discount_total ?? null;

        setReducedPrice(reducedPrice);
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
            setLoading(true);
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
            } catch (error) {
                console.error('Error converting price:', error);
            } finally {
                setLoading(false);
            }
        };

        if (price > 0) {
            fetchConvertedPrice();
        }
    }, [price, preferred_currency_code]);

    return (
        <div className="flex flex-col gap-x-1 text-ui-fg-subtle items-end">
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

                {price && (
                    <Flex flexDirection={'row'} alignItems="center">
                        {/* Currency Icon */}
                        <Flex alignItems={'center'}>
                            <Image
                                className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                                src={
                                    currencyIcons[
                                        preferred_currency_code ?? 'usdc'
                                    ]
                                }
                                alt={preferred_currency_code ?? 'usdc'}
                            />
                        </Flex>

                        {/* Spinner or Base Price */}
                        {loading ? (
                            <Spinner
                                size="sm"
                                color="white"
                                ml={{ base: '0.4rem', md: '0.5rem' }}
                            />
                        ) : (
                            <Text
                                ml={{ base: '0.4rem', md: '0.5rem' }}
                                fontSize={{ base: '15px', md: '24px' }}
                                fontWeight={700}
                                lineHeight="1.1"
                                position="relative"
                                top="1px"
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
                                {loading ? (
                                    <Spinner size="sm" color="white" ml={2} />
                                ) : (
                                    <Text
                                        mt={2}
                                        ml={{ base: '8px', md: '16px' }}
                                        as="h3"
                                        variant="semibold"
                                        color="white"
                                        lineHeight="1.1"
                                        fontSize={{ base: '12px', md: '16px' }}
                                        fontWeight={700}
                                        textAlign="right"
                                    >
                                        {`≅  ${convertedUSDPrice} USDC`}
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
