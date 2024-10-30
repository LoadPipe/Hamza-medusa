import { Flex, Text, Link, Image } from '@chakra-ui/react';
import React from 'react';

type Address = {
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    postal_code: string;
};

type OrderCardProps = {
    address: Address; // Address type directly, not nested inside another address object
};

const OrderRightAddress = ({ address }: OrderCardProps) => {
    return (
        <Flex
            width={'100%'}
            justifyContent={'center'}
            direction={{ base: 'column' }}
            // border="1px solid red"
            ml="auto"
            minWidth={{ sm: '130px', md: '130px' }}
        >
            <Flex direction={'row'}>
                <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                    Address
                </Text>
            </Flex>

            <Flex direction={'row'}>
                <Text
                    // minWidth="200px"
                    noOfLines={3}
                    color={'white'}
                    fontSize="16px"
                >
                    {address?.address_1 || 'N/A'}{' '}{address?.address_2 || ''}{' '}
                    {address?.city || 'N/A'} {address?.province || 'N/A'}{' '}
                    {address?.postal_code || 'N/A'}
                </Text>
            </Flex>
        </Flex>
    );
};

export default OrderRightAddress;
