'use client';

import React, { useState, useEffect } from 'react';
import {
    Text,
    Stack,
    Radio,
    RadioGroup,
    Button,
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

    const handleChangeCurrency = async () => {
        try {
            setCustomerPreferredCurrency(selectedCurrency);
            await setCurrency(selectedCurrency, authData.customer_id);
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    const isChanged =
        selectedCurrency.toLowerCase() !==
        (preferredCurrencyCode?.toLowerCase() || defaultCurrency);

    return (
        <Box>
            <Text fontSize="sm" color="gray.400" mb={4}>
                Available Balance
            </Text>
            <RadioGroup onChange={setSelectedCurrency} value={selectedCurrency}>
                <Stack direction="column" spacing={4}>

                    {/* ETH row */}
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        onClick={() => setSelectedCurrency('eth')}
                        cursor="pointer"
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
                        onClick={() => setSelectedCurrency('usdc')}
                        cursor="pointer"
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
                        onClick={() => setSelectedCurrency('usdt')}
                        cursor="pointer"
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

            <Button
                mt={5}
                p="10px 16px"
                gap="10px"
                width="100%"
                h="44px"
                bg={isChanged ? '#94D42A' : '#242424'}
                borderRadius="49px"
                color="white"
                border="none"
                _hover={{ bg: isChanged ? '#94D42A' : '#242424' }}
                _active={{ bg: isChanged ? '#94D42A' : '#242424' }}
                flex="none"
                order={1}
                alignSelf="stretch"
                flexGrow={0}
                onClick={handleChangeCurrency}
            >
                Change Currency
            </Button>
        </Box>
    );
};

export default CurrencySelector;
