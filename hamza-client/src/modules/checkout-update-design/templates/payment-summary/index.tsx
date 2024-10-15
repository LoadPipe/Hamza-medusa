import React from 'react';
import { Flex, Text, Divider } from '@chakra-ui/react';

const PaymentSummary = () => {
    return (
        <Flex
            bgColor={'#121212'}
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            height={'425px'}
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
                Payment Summary
            </Text>
        </Flex>
    );
};

export default PaymentSummary;
