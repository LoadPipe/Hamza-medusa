import React, { useEffect } from 'react';
import OrderSummary from './order-summary';
import PaymentSummary from './payment-summary';
import CheckoutDetails from './checkout-details';
import { Flex } from '@chakra-ui/react';
import { Cart, Customer } from '@medusajs/medusa';
import { redirect, useRouter } from 'next/navigation';

const CheckoutTemplate = ({
    cart,
    customer,
    cartId,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    customer: Omit<Customer, 'password_hash'> | null;
    cartId: any;
}) => {
    const router = useRouter();

    useEffect(() => {
        if (cart && cart.shipping_address) {
            router.push((`/checkout?step=review&cart=${cartId}`)
        }

        return () => {
            // Cleanup if needed
        };
    }, [cart, cartId]); // Correctly set dependencies

    return (
        <Flex
            maxW={'1258px'}
            width={'100%'}
            mx="1rem"
            my="2rem"
            flexDir={{ base: 'column', md: 'row' }}
            gap={{ base: 3, md: 5 }}
        >
            <Flex
                width={'100%'}
                flexDir={'column'}
                gap={{ base: 3, md: '41px' }}
            >
                <CheckoutDetails cartId={cartId} />
                <OrderSummary cart={cart} />
            </Flex>
            <PaymentSummary />
        </Flex>
    );
};

export default CheckoutTemplate;
