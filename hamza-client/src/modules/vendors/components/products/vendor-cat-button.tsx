import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

const VendorCatButton = (props: any) => {
    return (
        <Flex
            width={'167px'}
            height={'66px'}
            py={'11px'}
            px={'24px'}
            borderRadius={'49px'}
            borderWidth={'1px'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor={'pointer'}
        >
            <Text>{props.catName}</Text>
        </Flex>
    );
};

export default VendorCatButton;
