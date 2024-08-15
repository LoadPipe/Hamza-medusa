'use client';
import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { Customer } from '@medusajs/medusa';

const CartShippingAddress = ({
    customer,
}: {
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    return (
        <Flex
            flexDir={'column'}
            py={{ base: '16px', md: '40px' }}
            px={{ base: '16px', md: '45px' }}
            maxWidth={'825px'}
            width={'100%'}
            height={'auto'}
            alignSelf={'flex-start'}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
            color={'white'}
        >
            <Text
                fontWeight={600}
                fontSize={{ base: '16px', md: '18px' }}
                color="primary.green.900"
            >
                Shipping Address
            </Text>
            {customer ? (
                <Box mt="1rem">
                    <Text
                        color={'primary.indigo.900'}
                        fontSize={{ base: '16px', md: '24px' }}
                        lineHeight={'auto'}
                        fontWeight={900}
                    >
                        {customer.shipping_addresses[0]?.first_name ?? ''}
                        {customer.shipping_addresses[0]?.last_name ?? ''}
                    </Text>
                    {customer.shipping_addresses[0]?.email && (
                        <Text fontSize={{ base: '14px', md: '16x' }}>
                            {customer.shipping_addresses[0]?.email ?? ''}
                            <br />
                        </Text>
                    )}
                    {customer.shipping_addresses[0]?.phone && (
                        <Text fontSize={{ base: '14px', md: '16x' }}>
                            {customer.shipping_addresses[0]?.phone ?? ''}
                            <br />
                        </Text>
                    )}
                    <Text fontSize={{ base: '14px', md: '16x' }}>
                        {customer.shipping_addresses[0]?.address_1 ?? ''}
                        <br />
                    </Text>
                    {customer.shipping_addresses[0]?.address_2 && (
                        <Text fontSize={{ base: '14px', md: '16x' }}>
                            {customer.shipping_addresses[0]?.address_2 ?? ''}
                            <br />
                        </Text>
                    )}
                    <Text fontSize={{ base: '14px', md: '16x' }}>
                        {customer.shipping_addresses[0]?.city ?? ''},{' '}
                        {customer.shipping_addresses[0]?.province ?? ''}{' '}
                        {customer.shipping_addresses[0]?.postal_code ?? ''}
                        <br />
                    </Text>
                    <Text fontSize={{ base: '14px', md: '16x' }}>
                        {customer.shipping_addresses[0]?.country ?? ''}
                    </Text>
                </Box>
            ) : (
                <Text mt="0.5rem" color="white">
                    No shipping address available.
                </Text>
            )}
        </Flex>
    );
};

export default CartShippingAddress;
