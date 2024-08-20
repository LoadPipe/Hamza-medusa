import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

const VendorCatButton = (props: any) => {
    return (
        <Flex
            width={{ base: '94px', md: '167px' }}
            height={{ base: '42px', md: '66px' }}
            borderRadius={'49px'}
            borderWidth={'1px'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor={'pointer'}
        >
            <Text fontSize={{ base: '10px', md: '16px' }}>{props.catName}</Text>
        </Flex>
    );
};

export default VendorCatButton;
