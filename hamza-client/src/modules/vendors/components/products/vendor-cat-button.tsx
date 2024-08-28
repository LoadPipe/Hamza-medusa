import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

type VendorCatButtonProps = {
    catName: string;
    selected: string;
    setHandle: (handle: string) => void;
    setSelected: (selected: string) => void;
};

const VendorCatButton: React.FC<VendorCatButtonProps> = ({
    catName,
    selected,
    setHandle,
    setSelected,
}) => {
    const formattedCatName =
        catName === 'All Products'
            ? catName
            : catName
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase());
    return (
        <Flex
            width={{ base: '94px', md: '167px' }}
            height={{ base: '42px', md: '66px' }}
            borderRadius={'49px'}
            borderWidth={'1px'}
            backgroundColor={selected === catName ? 'white' : 'transparent'}
            color={selected === catName ? 'black' : 'white'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor={'pointer'}
            onClick={() => {
                setHandle(catName === 'All Products' ? 'all' : catName);
                setSelected(catName);
            }}
        >
            <Text fontSize={{ base: '10px', md: '16px' }}>
                {formattedCatName}
            </Text>
        </Flex>
    );
};

export default VendorCatButton;
