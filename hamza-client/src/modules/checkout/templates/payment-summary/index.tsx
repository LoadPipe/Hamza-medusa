import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';
import CartTotals from '@modules/common/components/cart-totals';
import DiscountCode from '@modules/checkout/components/discount-code';
import PaymentButton from '@modules/checkout/components/payment/components/payment-button';
import CheckoutTermsOfService from '@/modules/terms-of-service/templates/checkout-tos';
import { CartWithCheckoutStep } from '@/types/global';

const PaymentSummary = async ({ cart }: { cart: CartWithCheckoutStep }) => {
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
            maxHeight={{ base: 'auto', md: '680px' }}
            flexDir={'column'}
            borderRadius={'16px'}
            p={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Payment Summary
            </Text>

            <CartTotals cart={cart} useCartStyle={true} />

            <Flex mt="auto" flexDir={'column'} gap={2}>
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
