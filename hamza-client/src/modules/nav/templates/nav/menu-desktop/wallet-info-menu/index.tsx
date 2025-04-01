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
    Image,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import ChainDropdown from '../chain-selector-dropdown';
import AddressDisplay from '../address-display';
import CurrencySelector from './currency-selector';
import { convertCryptoPrice } from '@/lib/util/get-product-price';
import { getCurrencyAddress } from '@/currency.config';

interface NewWalletInfoProps {
    chainName?: string;
    chain?: any;
    preferred_currency_code?: string;
}

const WalletInfo: React.FC<NewWalletInfoProps> = ({
    chainName,
    chain,
    preferred_currency_code,
}) => {
    const { address } = useAccount();
    const { chain: networkChain } = useNetwork();
    const chainId = networkChain?.id ?? 1;
    const [selectedCurrency, setSelectedCurrency] = useState(
        preferred_currency_code ?? 'eth'
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
            const decimals = selectedCurrency === 'eth' ? 4 : 2;

            let formatted = value.toFixed(decimals);

            if (value > 1000) {
                formatted = parseFloat(formatted).toLocaleString(undefined, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
            }

            return selectedCurrency === 'eth'
                ? `${formatted} ${symbol}`
                : `$${formatted} ${symbol}`;
        }

        // Fallback if no balance data
        return selectedCurrency === 'eth'
            ? `0.0000 ${symbol}`
            : `$0.00 ${symbol}`;
    };

    return (
        <Menu placement="bottom-end">
            {({ isOpen }) => (
                <>
                    <MenuButton
                        as={Button}
                        bg="#121212"
                        borderRadius="81px"
                        _hover={{ bg: '#121212' }}
                        _active={{ bg: '#121212' }}
                        border="none"
                        flex="none"
                        order={0}
                        flexGrow={0}
                        width="auto"
                        height="48px"
                        className="currency-selector"
                        p={0}
                    >
                        <Flex
                            alignItems="center"
                            gap="12px"
                            w="100%"
                            justifyContent="space-between"
                            px="16px"
                        >
                            {/* Chain icon */}
                            {chain?.hasIcon && chain?.iconUrl && (
                                <Image
                                    src={chain.iconUrl}
                                    alt={chain.name ?? 'Chain icon'}
                                    boxSize="20px"
                                    borderRadius="full"
                                />
                            )}
                            {/* Chain name */}
                            <Text color="white" textTransform="uppercase">
                                {chain?.name ?? chainName ?? 'Unknown'}
                            </Text>
                            {/* Vertical divider */}
                            <Box
                                as="span"
                                display="inline-block"
                                width="1px"
                                height="20px"
                                bg="#676767"
                                alignSelf="center"
                            />
                            {/* Currency code */}
                            <Text color="white" textTransform="uppercase">
                                {preferred_currency_code ?? 'ETH'}
                            </Text>
                            {/* Dropdown icon */}
                            <TriangleDownIcon color="white" boxSize="12px" />
                        </Flex>
                    </MenuButton>

                    <MenuList
                        p={0}
                        mt="12px"
                        border="none"
                        bg="transparent"
                        boxShadow="none"
                        minW="432px"
                    >
                        <Box
                            bg="#121212"
                            p="32px"
                            gap="24px"
                            w="432px"
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
                                <AddressDisplay />
                                <ChainDropdown />
                            </Flex>

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
                                preferredCurrencyCode={preferred_currency_code}
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

export default WalletInfo;
