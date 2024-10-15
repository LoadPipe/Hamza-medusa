import { Flex, Text, Divider } from '@chakra-ui/react';
import React from 'react';

const OrderSummary = () => {
    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={'406px'}
            flexDir={'column'}
            borderRadius={'16px'}
            px="60px"
            py="40px"
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Order Summary
            </Text>
        </Flex>
    );
};

export default OrderSummary;
