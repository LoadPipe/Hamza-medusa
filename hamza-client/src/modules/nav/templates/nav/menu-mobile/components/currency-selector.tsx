'use client';

import React, { useEffect } from 'react';
import {
    Text,
    Stack,
    Radio,
    RadioGroup,
    Box,
    Flex,
    Image,
} from '@chakra-ui/react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { setCurrency } from '@/lib/server';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { useQueryClient } from '@tanstack/react-query';
import { Cart } from '@medusajs/medusa';
import { applyDiscount, removeDiscount } from '@modules/checkout/actions';

interface CurrencySelectorProps {
    preferredCurrencyCode?: string;
    defaultCurrency?: string;
    isOpen: boolean;
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    nativeBalanceData?: any;
    usdcBalanceData?: any;
    usdtBalanceData?: any;
}

const currencies = [
    { code: 'eth', label: 'ETH' },
    { code: 'usdc', label: 'USDC' },
    { code: 'usdt', label: 'USDT' },
];

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    preferredCurrencyCode,
    defaultCurrency = 'eth',
    isOpen,
    selectedCurrency,
    setSelectedCurrency,
    nativeBalanceData,
    usdcBalanceData,
    usdtBalanceData,
}) => {
    const queryClient = useQueryClient();
    const cart = queryClient.getQueryData<Cart>(['cart']);
    // If cart exists, you can extract the discount code
    const discountCode = cart?.discounts?.[0]?.code;
    console.log(`DISCOUNT CODE IS ${discountCode}`);

    const customerId = useCustomerAuthStore(
        (state) => state.authData.customer_id
    );
    const setCustomerPreferredCurrency = useCustomerAuthStore(
        (state) => state.setCustomerPreferredCurrency
    );

    useEffect(() => {
        if (!isOpen) {
            setSelectedCurrency(preferredCurrencyCode ?? defaultCurrency);
        }
    }, [isOpen, preferredCurrencyCode, defaultCurrency, setSelectedCurrency]);

    const getBalanceData = (currencyCode: string) => {
        if (currencyCode === 'eth') return nativeBalanceData;
        if (currencyCode === 'usdc') return usdcBalanceData;
        if (currencyCode === 'usdt') return usdtBalanceData;
        return undefined;
    };

    const formatBalance = (balanceData: any, currency: string) => {
        if (!balanceData?.formatted) {
            return currency === 'eth' ? '0.0000' : '0.00';
        }

        const value = parseFloat(balanceData.formatted);
        const decimals = currency === 'eth' ? 4 : 2;
        let formatted = value.toFixed(decimals);

        if (value > 1000) {
            formatted = parseFloat(formatted).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
        }

        return formatted;
    };

    const handleCurrencySelection = async (code: string) => {
        try {
            if (discountCode) {
                // await removeDiscount(discountCode);
                await applyDiscount(discountCode).catch(async (err) => {
                    console.log(err);
                });
            }
            setSelectedCurrency(code);
            setCustomerPreferredCurrency(code);
            await setCurrency(code, customerId);

            await queryClient.invalidateQueries<Cart>({ queryKey: ['cart'] });
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    return (
        <Box>
            <Text fontSize="sm" color="gray.400" mb={4}>
                Available Balance
            </Text>

            <RadioGroup value={selectedCurrency}>
                <Stack direction="column" spacing={4}>
                    {currencies.map(({ code, label }) => (
                        <Flex
                            key={code}
                            justifyContent="space-between"
                            alignItems="center"
                            cursor="pointer"
                            onClick={() => handleCurrencySelection(code)}
                        >
                            <Flex alignItems="center" gap="8px">
                                <Radio
                                    value={code}
                                    colorScheme="whiteAlpha"
                                    _checked={{
                                        bg: 'white',
                                        borderColor: 'white',
                                    }}
                                    pointerEvents="none"
                                />
                                <Flex alignItems="center" gap="6px">
                                    <Image
                                        src={currencyIcons[code].src}
                                        alt={`${label} Icon`}
                                        boxSize="20px"
                                    />
                                    <Text color="white" mr={2}>
                                        {label}
                                    </Text>
                                </Flex>

                                {preferredCurrencyCode === code && (
                                    <Flex
                                        flex="none"
                                        order={2}
                                        flexGrow={0}
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        p="7px 10px"
                                        gap="10px"
                                        bg="#272727"
                                        borderRadius="4px"
                                    >
                                        <Text color="white" fontSize="xs">
                                            DEFAULT
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>

                            <Text color="white">
                                {formatBalance(getBalanceData(code), code)}
                            </Text>
                        </Flex>
                    ))}
                </Stack>
            </RadioGroup>
        </Box>
    );
};

export default CurrencySelector;
