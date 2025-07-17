'use client';

import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import CartTotals from '@modules/common/components/cart-totals';
import DiscountCode from '@modules/checkout/components/discount-code';
import PaymentButton from '@modules/checkout/components/payment/components/payment-button';
import { CartWithCheckoutStep } from '@/types/global';
import ProfileCurrency from '@/modules/account/components/profile/components/profile-form/components/profile-currency';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

const PaymentSummary = ({ cart }: { cart: CartWithCheckoutStep }) => {
    const preferred_currency_code = useCustomerAuthStore(
        (state) => state.preferred_currency_code
    );
    const setCustomerPreferredCurrency = useCustomerAuthStore(
        (state) => state.setCustomerPreferredCurrency
    );

    if (!cart) {
        console.log('cart not found');
        return (
            <Flex
                bgColor="#121212"
                color="white"
                maxW={{ base: '100%', md: '401px' }}
                width="100%"
                minHeight="400px"
                flexDir="column"
                borderRadius="16px"
                p={{ base: '16px', md: '40px' }}
                align="center"
                justify="center"
            >
                <Text
                    color="primary.green.900"
                    fontSize="18px"
                    fontWeight={600}
                >
                    Payment Summary
                </Text>
                <Text mt="2" fontSize="14px">
                    No cart found.
                </Text>
            </Flex>
        );
    }

    return (
        <Flex
            bgColor={'#121212'}
            color={'white'}
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            minHeight={{ base: 'auto', md: '400px' }}
            maxHeight={{ base: 'auto', md: '750px' }}
            flexDir={'column'}
            borderRadius={'16px'}
            p={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
                mb="1rem"
            >
                Payment Summary
            </Text>

            <ProfileCurrency
                preferredCurrencyCode={preferred_currency_code}
                setCustomerPreferredCurrency={setCustomerPreferredCurrency}
            />

            {cart && <CartTotals cart={cart} useCartStyle={true} />}

            <Flex mt="auto" flexDir={'column'} gap={2} width="100%">
                <DiscountCode cart={cart} />
                <PaymentButton cart={cart} />
                {/* <Text
                    textAlign="center"
                    fontSize={{ base: '10px', md: '12px' }}
                    maxW={'236px'}
                    mx="auto"
                >
                    By clicking on confirm order, you agree to these{' '}
                    <CheckoutTermsOfService />
                </Text> */}
            </Flex>
        </Flex>
    );
};

export default PaymentSummary;