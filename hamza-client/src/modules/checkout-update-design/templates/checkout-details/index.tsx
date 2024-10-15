import { Flex, Text, Divider } from '@chakra-ui/react';
import React from 'react';

const CheckoutDetails = () => {
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
                Checkout Details
            </Text>
            <Text
                mt="2rem"
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Shipping To:
            </Text>
            <Divider borderWidth={'1px'} borderColor={'#3E3E3E'} my="2rem" />
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Payment Method:
            </Text>
        </Flex>
    );
};

export default CheckoutDetails;
