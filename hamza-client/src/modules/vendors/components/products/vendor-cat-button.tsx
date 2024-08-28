import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

type VendorCatButtonProps = {
    catName: string;
    setHandle: (handle: string) => void;
    setAllProducts: (allProducts: boolean) => void;
};

const VendorCatButton: React.FC<VendorCatButtonProps> = ({
    catName,
    setHandle,
    setAllProducts,
}) => {
    return (
        <Flex
            width={{ base: '94px', md: '167px' }}
            height={{ base: '42px', md: '66px' }}
            borderRadius={'49px'}
            borderWidth={'1px'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor={'pointer'}
            onClick={() => {
                setHandle(catName.toLowerCase());
                setAllProducts(false);
            }}
        >
            <Text fontSize={{ base: '10px', md: '16px' }}>{catName}</Text>
        </Flex>
    );
};

export default VendorCatButton;
