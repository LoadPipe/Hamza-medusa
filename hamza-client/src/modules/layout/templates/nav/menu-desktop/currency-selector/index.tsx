'use client';
import React from 'react';
import {
    Flex,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { MdOutlineShield } from 'react-icons/md';
import Image from 'next/image';

import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import currencyIcons from '@/images/currencies/crypto-currencies';

const CurrencySelector = () => {
    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();

    const handleCurrencyChange = (currency: string) => {
        setCustomerPreferredCurrency(currency);
    };

    return (
        <Flex display={{ base: 'none', md: 'flex' }} height={'100%'}>
            <Menu placement="bottom-end">
                <MenuButton
                    width={'44px'}
                    height={'44px'}
                    borderRadius={'full'}
                    borderColor={'white'}
                    borderWidth={'1px'}
                    backgroundColor={'transparent'}
                    cursor={'pointer'}
                    position="relative"
                    alignItems={'center'}
                    justifyContent={'center'}
                    _hover={{
                        '.profile-icon': {
                            color: 'primary.green.900',
                            transition: 'color 0.3s ease-in-out',
                        },
                        borderColor: 'primary.green.900',
                        transition: 'border-color 0.3s ease-in-out',
                    }}
                >
                    <Image
                        style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        src={currencyIcons[preferred_currency_code ?? 'usdc']}
                        alt={preferred_currency_code ?? 'USDC'}
                    />
                </MenuButton>
                <MenuList
                    marginTop={'1rem'}
                    pb={'0px'}
                    borderRadius={'16px'}
                    borderColor={{
                        base: 'transparent',
                        md: 'white',
                    }}
                    backgroundColor={'black'}
                    width={{ base: '100vw', md: '60px' }}
                >
                    {['usdt', 'usdc', 'eth'].map((currency) => (
                        <MenuItem
                            key={currency}
                            fontWeight={'600'}
                            pl="1rem"
                            mt="1rem"
                            mb="1rem"
                            color={'white'}
                            gap={2}
                            backgroundColor={'black'}
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleCurrencyChange(currency)}
                        >
                            <Image
                                src={currencyIcons[currency ?? 'usdc']}
                                alt={currency ?? 'USDC'}
                            />
                            <Text fontWeight={'600'} ml="0.5rem">
                                {currency.toUpperCase()}
                            </Text>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default CurrencySelector;
