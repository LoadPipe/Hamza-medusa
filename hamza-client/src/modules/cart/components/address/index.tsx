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
            py="40px"
            px="45px"
            maxWidth={'825px'}
            width={'100%'}
            height={'240px'}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
            color={'white'}
        >
            <Text fontWeight={600} fontSize={'18px'} color="primary.green.900">
                Shipping Address
            </Text>
            {customer ? (
                <Box mt="1rem">
                    <Text
                        color={'primary.indigo.900'}
                        fontSize={'24px'}
                        fontWeight={900}
                    >
                        {customer.shipping_addresses[0].first_name}
                        {customer.shipping_addresses[0].last_name}
                    </Text>
                    {customer.shipping_addresses[0].email && (
                        <Text>
                            {customer.shipping_addresses[0].email}
                            <br />
                        </Text>
                    )}
                    {customer.shipping_addresses[0].phone && (
                        <Text>
                            {customer.shipping_addresses[0].phone}
                            <br />
                        </Text>
                    )}
                    <Text>
                        {customer.shipping_addresses[0].address_1}
                        <br />
                    </Text>
                    {customer.shipping_addresses[0].address_2 && (
                        <Text>
                            {customer.shipping_addresses[0].address_2}
                            <br />
                        </Text>
                    )}
                    <Text>
                        {customer.shipping_addresses[0].city},{' '}
                        {customer.shipping_addresses[0].province}{' '}
                        {customer.shipping_addresses[0].postal_code}
                        <br />
                    </Text>
                    <Text>{customer.shipping_addresses[0].country}</Text>
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
