'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
} from '@chakra-ui/react';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth'; // Import Zustand store

import { getCurrencyAddress } from '@/currency.config';
import AddressDisplay from '../components/address-display';
import ChainDropdown from '../components/chain-selector-dropdown';
import CurrencySelector from '../components/currency-selector';
import Image from 'next/image';
import walletIconUrl from '@/images/icon/wallet_icon.svg';
import { currencyIsUsdStable } from '@/lib/util/currencies';

interface NewWalletInfoProps {
    chainName?: string;
    chain?: any;
    preferred_currency_code?: string;
}

const WalletInfoMobile: React.FC<NewWalletInfoProps> = ({
    chainName,
    chain,
    preferred_currency_code: initialPreferredCurrencyCode,
}) => {
    const { address } = useAccount();
    const { chain: networkChain } = useNetwork();
    const chainId = networkChain?.id ?? 1;

    // Fetch preferredCurrency from Zustand store
    const preferred_currency_code = useCustomerAuthStore(
        (state) => state.preferred_currency_code
    );

    const effectivePreferredCurrencyCode =
        preferred_currency_code || initialPreferredCurrencyCode;

    const [selectedCurrency, setSelectedCurrency] = useState(
        effectivePreferredCurrencyCode ?? 'eth'
    );

    // Query native ETH balance
    const { data: ethBalanceData } = useBalance({ address, chainId });

    // Query USDC and USDT balances
    const usdcAddress = getCurrencyAddress('usdc', chainId);
    const usdtAddress = getCurrencyAddress('usdt', chainId);
    const { data: usdcBalanceData } = useBalance({
        address,
        token: usdcAddress as `0x${string}`,
        chainId,
    });
    const { data: usdtBalanceData } = useBalance({
        address,
        token: usdtAddress ? (usdtAddress as `0x${string}`) : undefined,
        chainId,
    });

    const getTotal = () => {
        let balanceData: any;
        let symbol: string = '';

        if (selectedCurrency === 'eth') {
            balanceData = ethBalanceData;
            symbol = 'ETH';
        } else if (selectedCurrency === 'usdc') {
            balanceData = usdcBalanceData;
            symbol = 'USDC';
        } else if (selectedCurrency === 'usdt') {
            balanceData = usdtBalanceData;
            symbol = 'USDT';
        }

        if (balanceData?.formatted) {
            const value = parseFloat(balanceData.formatted);
            const decimals =
                selectedCurrency === 'eth'
                    ? 4
                    : selectedCurrency === 'btc'
                      ? 8
                      : 2;

            let formatted = value.toFixed(decimals);

            if (value > 1000) {
                formatted = parseFloat(formatted).toLocaleString(undefined, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
            }

            return currencyIsUsdStable(selectedCurrency)
                ? `$${formatted} ${symbol}`
                : `${formatted} ${symbol}`;
        }

        // Fallback if no balance data
        return currencyIsUsdStable(selectedCurrency)
            ? `$0.00 ${symbol}`
            : `0.0000 ${symbol}`;
    };

    return (
        <Menu placement="bottom-end">
            {({ isOpen }) => (
                <>
                    <MenuButton
                        as={Button}
                        bg="transparent"
                        _hover={{ bg: '#121212' }}
                        _active={{ bg: '#121212' }}
                        border="none"
                        flex="none"
                        order={0}
                        flexGrow={0}
                        width="auto"
                        height="auto"
                        p={0}
                    >
                        <Image
                            src={walletIconUrl}
                            alt="Wallet Icon"
                            width={48}
                            height={48}
                        />
                    </MenuButton>

                    <MenuList
                        p={0}
                        border="none"
                        bg="transparent"
                        boxShadow="none"
                        width="100vw"
                    >
                        <Box
                            bg="#121212"
                            p="32px"
                            gap="24px"
                            w="100vw"
                            color="white"
                            border="1px solid #676767"
                            boxShadow="0px 10px 15px 7px rgba(0, 0, 0, 0.5)"
                            borderRadius="16px"
                            position="relative"
                        >
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                mb={5}
                            >
                                <ChainDropdown />
                            </Flex>

                            <AddressDisplay />

                            {/* Wallet balance row */}
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                mb={5}
                            >
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold">
                                        {getTotal()}
                                    </Text>
                                    <Text fontSize="sm" color="gray.400">
                                        Wallet Balance
                                    </Text>
                                </Box>
                                {/* <Button
                                    bg="#242424"
                                    borderRadius="49px"
                                    px="16px"
                                    py="10px"
                                    color="white"
                                    border="none"
                                    _hover={{ bg: '#242424' }}
                                    _active={{ bg: '#242424' }}
                                >
                                    + Add fund
                                </Button> */}
                            </Flex>

                            <Box height="1px" bg="gray.600" mb={5} />

                            <CurrencySelector
                                isOpen={isOpen}
                                preferredCurrencyCode={
                                    effectivePreferredCurrencyCode
                                }
                                defaultCurrency="eth"
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                                nativeBalanceData={ethBalanceData}
                                usdcBalanceData={usdcBalanceData}
                                usdtBalanceData={usdtBalanceData}
                            />
                        </Box>
                    </MenuList>
                </>
            )}
        </Menu>
    );
};

export default WalletInfoMobile;
