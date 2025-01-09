'use client';
import React, { useState } from 'react';
import {
    Flex,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Checkbox,
    Box,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import currencyIcons from '@/images/currencies/crypto-currencies';

const CurrencySelector = () => {
    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();
    const [selectedCurrency, setSelectedCurrency] = useState(
        preferred_currency_code
    );

    const handleCurrencySelect = (currency: string) => {
        setSelectedCurrency(currency);
    };

    const handleSaveChanges = () => {
        if (selectedCurrency) {
            setCustomerPreferredCurrency(selectedCurrency);
        }
    };

    return (
        <Flex display={{ base: 'none', md: 'flex' }} height={'100%'}>
            <Menu placement="bottom-end" closeOnSelect={false}>
                <MenuButton
                    width={'130px'}
                    height={'44px'}
                    borderRadius={'8px'}
                    borderColor={'white'}
                    borderWidth={'1px'}
                    backgroundColor={'#2A2A2A'}
                    border={'none'}
                    cursor={'pointer'}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="0.75rem"
                    _hover={{
                        borderColor: 'primary.green.900',
                        transition: 'border-color 0.3s ease-in-out',
                    }}
                >
                    <Flex alignItems="center" flexDir={'row'} gap={2}>
                        <Image
                            src={currencyIcons[selectedCurrency ?? 'usdc']}
                            alt={selectedCurrency ?? 'USDC'}
                            width={20}
                            height={20}
                        />
                        <Text fontWeight={'400'} color="white">
                            {selectedCurrency?.toUpperCase() ?? 'USDC'}
                        </Text>
                        <ChevronDownIcon
                            style={{ marginLeft: 'auto' }}
                            color="white"
                            w={5}
                            h={5}
                        />
                    </Flex>
                </MenuButton>
                <MenuList
                    marginTop={'1rem'}
                    py={2}
                    borderRadius={'16px'}
                    borderColor="white"
                    backgroundColor={'#121212'}
                    width={{ base: '100vw', md: '205px' }}
                >
                    {['usdt', 'usdc', 'eth'].map((currency) => (
                        <MenuItem
                            key={currency}
                            fontWeight={'600'}
                            pl="1rem"
                            color={'white'}
                            gap={3}
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleCurrencySelect(currency)}
                        >
                            <Checkbox
                                style={{ width: '14px', height: '14px' }}
                                isChecked={selectedCurrency === currency}
                                onChange={() => handleCurrencySelect(currency)}
                                colorScheme="green"
                            />
                            <Flex alignItems="center" gap={2}>
                                <Image
                                    src={currencyIcons[currency]}
                                    alt={currency.toUpperCase()}
                                    width={20}
                                    height={20}
                                />
                                <Text fontWeight={'400'} lineHeight={0}>
                                    {currency.toUpperCase()}
                                </Text>
                            </Flex>
                        </MenuItem>
                    ))}
                    <Box px={4} py={2}>
                        <Button
                            colorScheme="green"
                            width="100%"
                            height={'27px'}
                            fontSize={'10px'}
                            borderRadius={'full'}
                            color={'black'}
                            onClick={handleSaveChanges}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default CurrencySelector;
