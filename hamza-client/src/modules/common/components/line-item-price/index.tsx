import { formatAmount } from '@lib/util/prices';
import { LineItem, Region } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import Image from 'next/image';
import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { CalculatedVariant } from 'types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useCustomerProfileStore } from '@store/customer-profile/customer-profile';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { getCustomer } from '@lib/data';
import axios from 'axios';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type LineItemPriceProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
};

const LineItemPrice = ({ item }: LineItemPriceProps) => {
    const [price, setPrice] = useState<number | null>(null);
    const [reducedPrice, setReducedPrice] = useState<number | null>(null);
    const [hasReducedPrice, setHasReducedPrice] = useState<boolean>(false);
    const [currencyCode, setCurrencyCode] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        const fetchCustomerPreferredCurrency = async () => {
            try {
                const customer = await getCustomer().catch(() => null);
                if (customer) {
                    const response = await axios.get(
                        'http://localhost:9000/custom/customer/get-currency',
                        {
                            params: {
                                customer_id: customer.id,
                            },
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const customerCurrency = response.data;
                    setCurrencyCode(customerCurrency.preferred_currency);
                }
            } catch (error) {
                console.error('Error fetching customer currency:', error);
            }
        };

        fetchCustomerPreferredCurrency();
    }, []);

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
                            <span className="text-ui-fg-subtle">
                                Original:{' '}
                            </span>

                            <span className="line-through text-ui-fg-muted">
                                {formatCryptoPrice(reducedPrice, currencyCode)}{' '}
                                {currencyCode?.toUpperCase()}
                            </span>
                        </p>

                        <span className="text-ui-fg-interactive">
                            -{getPercentageDiff(reducedPrice, item.total || 0)}%
                        </span>
                    </>
                )}

                {price && currencyCode && (
                    <Flex flexDirection={'row'} alignItems="center">
                        <Flex alignItems={'center'}>
                            <Image
                                className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                                src={currencyIcons[currencyCode]}
                                alt={currencyCode}
                            />
                        </Flex>
                        <Text
                            ml={{ base: '0.4rem', md: '0.5rem' }}
                            fontSize={{ base: '15px', md: '24px' }}
                            fontWeight={700}
                            lineHeight="1.1" // Fine-tune line height
                            position="relative" // Allows for slight adjustments with top
                            top="1px" // Adjust to fine-tune alignment
                            color={'white'}
                        >
                            {formatCryptoPrice(price, currencyCode)}
                        </Text>
                    </Flex>
                )}
            </div>
        </div>
    );
};

export default LineItemPrice;
