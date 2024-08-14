'use client';
import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Customer } from '@medusajs/medusa';

const CartShippingAddress = ({
    customer,
}: {
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    return (
        <Flex
            width={'825px'}
            height={'240px'}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
            flexDirection="column"
            py="40px"
            px="45px"
        >
            <Text fontWeight={600} fontSize={'18px'} color="primary.green.900">
                Shipping Address
            </Text>
            {customer ? (
                <Text color="white">
                    <Text
                        color={'primary.indigo.900'}
                        fontSize={'24px'}
                        fontWeight={900}
                    >
                        {customer.first_name} {customer.last_name}
                    </Text>
                    {/* {customer.shipping_addresses[0].address_1}
                    <br />
                    {customer.shipping_addresses[0].address_2 && (
                        <>
                            {customer.shipping_addresses[0].address_2}
                            <br />
                        </>
                    )}
                    {customer.shipping_addresses[0].city},{' '}
                    {customer.shipping_addresses[0].province}{' '}
                    {customer.shipping_addresses[0].postal_code}
                    <br />
                    {customer.shipping_addresses[0].country} */}
                </Text>
            ) : (
                <Text mt="0.5rem" color="white">
                    No shipping address available.
                </Text>
            )}
        </Flex>
    );
};

export default CartShippingAddress;
