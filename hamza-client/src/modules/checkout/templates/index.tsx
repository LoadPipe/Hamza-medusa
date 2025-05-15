import React from 'react';
import OrderSummary from './order-summary';
import PaymentSummary from './payment-summary';
import CheckoutDetails from './checkout-details';
import { Flex } from '@chakra-ui/react';
import { CartWithCheckoutStep } from '@/types/global';
import { Customer } from '@medusajs/medusa';
const CheckoutTemplate = ({
    cart,
    customer,
}: {
    cart: CartWithCheckoutStep;
    customer: Customer;
}) => {
    return (
        <Flex
            maxW="1258px"
            width="100%"
            mx="1rem"
            my="2rem"
            flexDir={{ base: 'column', md: 'row' }}
            gap={{ base: 3, md: 5 }}
        >
            <Flex width="100%" flexDir="column" gap={{ base: 3, md: '41px' }}>
                <CheckoutDetails cart={cart} customer={customer} />
                <OrderSummary cart={cart} />
            </Flex>
            <PaymentSummary cart={cart} />
        </Flex>
    );
};

export default CheckoutTemplate;
