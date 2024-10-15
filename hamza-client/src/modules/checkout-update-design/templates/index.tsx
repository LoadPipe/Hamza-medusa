import React from 'react';
import OrderSummary from './order-summary';
import PaymentSummary from './payment-summary';
import CheckoutDetails from './checkout-details';
import { Flex } from '@chakra-ui/react';

const CheckoutTemplate = () => {
    return (
        <Flex maxW={'1258px'} width={'100%'} my="2rem">
            <Flex width={'100%'} flexDir={'column'} gap={'41px'}>
                <CheckoutDetails />
                <OrderSummary />
            </Flex>
            <PaymentSummary />
        </Flex>
    );
};

export default CheckoutTemplate;
