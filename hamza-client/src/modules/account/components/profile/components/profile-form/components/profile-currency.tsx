'use client';

import React from 'react';
import {
    Flex,
    FormLabel,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import currencyIcons from '@/images/currencies/crypto-currencies';
import Image from 'next/image';
import { setCurrency } from '@lib/server';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

type ProfileCurrencyProps = {
    preferredCurrencyCode: string | null;
    defaultCurrency?: string;
    setCustomerPreferredCurrency: (currency: string) => void;
    isProfile?: boolean;
    className?: string;
};

const ProfileCurrency: React.FC<ProfileCurrencyProps> = ({
    preferredCurrencyCode,
    setCustomerPreferredCurrency,
    isProfile,
    className,
}) => {
    const currencies = [
        { code: 'usdc', label: 'USDC' },
        { code: 'usdt', label: 'USDT' },
        { code: 'eth', label: 'ETH' },
    ];
    const authData = useCustomerAuthStore((state) => state.authData);

    const currentCurrency = currencies.find(
        (currency) => currency.code === preferredCurrencyCode
    );

    const handleCurrencySelect = async (currencyCode: string) => {
        setCustomerPreferredCurrency(currencyCode);
        await setCurrency(currencyCode, authData.customer_id);
    };

    return (
        <Flex flexDirection="column" width="100%" className={className}>
            {isProfile && (
                <FormLabel
                    textTransform="uppercase"
                    fontSize="12px"
                    ml={{ base: 0, md: '1rem' }}
                    mb="8px"
                >
                    Preferred payment currency
                </FormLabel>
            )}
            <Menu>
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    borderRadius="12px"
                    height={{ base: '50px', md: '52px' }}
                    backgroundColor="#020202"
                    border="none"
                    color="white"
                    fontSize="14px"
                    _hover={{ backgroundColor: '#020202' }}
                    _expanded={{ backgroundColor: '#020202' }}
                >
                    {currentCurrency ? (
                        <Flex align="center">
                            <Image
                                alt={`${currentCurrency.label} icon`}
                                src={currencyIcons[currentCurrency.code]}
                                width={20}
                                height={20}
                            />
                            <Text ml="8px">{currentCurrency.label}</Text>
                        </Flex>
                    ) : (
                        'Select Currency'
                    )}
                </MenuButton>
                <MenuList backgroundColor="#020202" border="none">
                    {currencies.map((currency) => (
                        <MenuItem
                            key={currency.code}
                            onClick={() => handleCurrencySelect(currency.code)}
                            backgroundColor="black"
                            color="white"
                        >
                            <Flex align="center">
                                <Image
                                    alt={`${currency.label} icon`}
                                    src={currencyIcons[currency.code]}
                                    width={20}
                                    height={20}
                                />
                                <Text ml="8px">{currency.label}</Text>
                            </Flex>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default ProfileCurrency;
