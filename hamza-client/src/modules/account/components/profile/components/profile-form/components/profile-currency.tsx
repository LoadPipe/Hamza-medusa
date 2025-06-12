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
import { useQueryClient } from '@tanstack/react-query';
import { Cart } from '@medusajs/medusa';
import { applyDiscount, removeDiscount } from '@modules/checkout/actions';
type ProfileCurrencyProps = {
    preferredCurrencyCode: string | null;
    defaultCurrency?: string;
    setCustomerPreferredCurrency: (currency: string) => void;
    isProfile?: boolean;
    className?: string;
    iconOnly?: boolean;
};

const ProfileCurrency: React.FC<ProfileCurrencyProps> = ({
    preferredCurrencyCode,
    setCustomerPreferredCurrency,
    isProfile,
    className,
    iconOnly = false,
}) => {
    const currencies = [
        { code: 'usdc', label: 'USDC' },
        { code: 'usdt', label: 'USDT' },
        { code: 'eth', label: 'ETH' },
    ];
    const customerId = useCustomerAuthStore(
        (state) => state.authData.customer_id
    );
    const queryClient = useQueryClient();
    const cart = queryClient.getQueryData<Cart>(['cart']);
    // If cart exists, you can extract the discount code
    const discountCode = cart?.discounts?.[0]?.code;

    const currentCurrency = currencies.find(
        (currency) => currency.code === preferredCurrencyCode
    );

    const handleCurrencySelect = async (currencyCode: string) => {
        if (discountCode) {
            // await removeDiscount(discountCode);
            await applyDiscount(discountCode).catch(async (err) => {
                console.log(err);
            });
        }
        setCustomerPreferredCurrency(currencyCode);
        await setCurrency(currencyCode, customerId);

        await queryClient.invalidateQueries({ queryKey: ['cart'] });
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
                    rightIcon={iconOnly ? undefined : <ChevronDownIcon />}
                    borderRadius="12px"
                    height={{ base: '50px', md: '52px' }}
                    width={iconOnly ? { base: '50px', md: '52px' } : 'auto'}
                    minWidth={iconOnly ? { base: '50px', md: '52px' } : 'auto'}
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
                            {!iconOnly && <Text ml="8px">{currentCurrency.label}</Text>}
                        </Flex>
                    ) : (
                        iconOnly ? (
                            <Image
                                alt="Select currency"
                                src={currencyIcons['usdc']}
                                width={20}
                                height={20}
                            />
                        ) : (
                            'Select Currency'
                        )
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
