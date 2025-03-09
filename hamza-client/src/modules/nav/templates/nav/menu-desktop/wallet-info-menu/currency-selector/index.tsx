'use client';

import React, { useState, useEffect } from 'react';
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

interface CurrencySelectorProps {
    preferredCurrencyCode?: string;
    defaultCurrency?: string;
    isOpen: boolean;
    nativeBalanceData?: any;
    usdcBalanceData?: any;
    usdtBalanceData?: any;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    preferredCurrencyCode,
    defaultCurrency = 'eth',
    isOpen,
    nativeBalanceData,
    usdcBalanceData,
    usdtBalanceData,
}) => {
    const { authData, setCustomerPreferredCurrency } = useCustomerAuthStore();
    const [selectedCurrency, setSelectedCurrency] = useState(
        preferredCurrencyCode ?? defaultCurrency
    );

    useEffect(() => {
        if (!isOpen) {
            setSelectedCurrency(preferredCurrencyCode ?? defaultCurrency);
        }
    }, [isOpen, preferredCurrencyCode, defaultCurrency]);

    const formatBalance = (balanceData: any) =>
        balanceData ? parseFloat(balanceData.formatted).toFixed(2) : '0.00';

    const handleCurrencySelection = async (value: string) => {
        try {
            setSelectedCurrency(value);
            setCustomerPreferredCurrency(value);
            await setCurrency(value, authData.customer_id);
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

                    {/* ETH row */}
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        cursor="pointer"
                        onClick={() => handleCurrencySelection('eth')}
                    >
                        <Flex alignItems="center" gap="8px">
                            <Radio
                                value="eth"
                                colorScheme="whiteAlpha"
                                _checked={{ bg: 'white', borderColor: 'white' }}
                                pointerEvents="none"
                            />
                            <Flex alignItems="center" gap="6px">
                                <Image
                                    src={currencyIcons['eth'].src}
                                    alt="ETH Icon"
                                    boxSize="20px"
                                />
                                <Text color="white" mr={2}>
                                    ETH
                                </Text>
                            </Flex>
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
                                <Text color="white" fontSize="xs">DEFAULT</Text>
                            </Flex>
                        </Flex>
                        <Text color="white">
                            {formatBalance(nativeBalanceData)}
                        </Text>
                    </Flex>


                    {/* USDC row */}
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        cursor="pointer"
                        onClick={() => handleCurrencySelection('usdc')}
                    >
                        <Flex alignItems="center" gap="8px">
                            <Radio
                                value="usdc"
                                colorScheme="whiteAlpha"
                                _checked={{ bg: 'white', borderColor: 'white' }}
                                pointerEvents="none"
                            />
                            <Flex alignItems="center" gap="6px">
                                <Image
                                    src={currencyIcons['usdc'].src}
                                    alt="USDC Icon"
                                    boxSize="20px"
                                />
                                <Text color="white">USDC</Text>
                            </Flex>
                        </Flex>
                        <Text color="white">
                            {formatBalance(usdcBalanceData)}
                        </Text>
                    </Flex>

                    {/* USDT row */}
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        cursor="pointer"
                        onClick={() => handleCurrencySelection('usdt')}
                    >
                        <Flex alignItems="center" gap="8px">
                            <Radio
                                value="usdt"
                                colorScheme="whiteAlpha"
                                _checked={{ bg: 'white', borderColor: 'white' }}
                                pointerEvents="none"
                            />
                            <Flex alignItems="center" gap="6px">
                                <Image
                                    src={currencyIcons['usdt'].src}
                                    alt="USDT Icon"
                                    boxSize="20px"
                                />
                                <Text color="white">USDT</Text>
                            </Flex>
                        </Flex>
                        <Text color="white">
                            {formatBalance(usdtBalanceData)}
                        </Text>
                    </Flex>

                </Stack>
            </RadioGroup>
        </Box>
    );
};

export default CurrencySelector;
