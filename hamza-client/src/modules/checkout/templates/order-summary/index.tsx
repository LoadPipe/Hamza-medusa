'use client';

import { Flex, Text, Divider } from '@chakra-ui/react';
import { Cart } from '@medusajs/medusa';
import ItemsTemplate from '@modules/cart/templates/items';
import CartItems from '@modules/checkout/components/cart-items';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import React from 'react';

const OrderSummary = ({
    cart,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
}) => {
    const { preferred_currency_code } = useCustomerAuthStore();

    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={'auto'}
            flexDir={'column'}
            borderRadius={'16px'}
            px={{ base: '16px', md: '60px' }}
            py={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Order Summary
            </Text>

            <CartItems
                cart={cart}
                region={cart?.region}
                items={cart?.items}
                currencyCode={preferred_currency_code ?? 'usdc'}
            />
        </Flex>
    );
};

export default OrderSummary;
