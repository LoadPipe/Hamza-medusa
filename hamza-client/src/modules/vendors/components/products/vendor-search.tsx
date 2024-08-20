import React from 'react';
import { Flex, Box, Text, Input } from '@chakra-ui/react';
import VendorCatButton from './vendor-cat-button';

const VendorSearch = () => {
    return (
        <Flex my="3rem" maxWidth={'1256.52px'} width={'100%'}>
            <Flex mx={{ base: '1rem', md: '0' }} flexDir={'row'} width={'100%'}>
                <VendorCatButton catName="All Products" />
                {/* <Flex ml="auto" alignSelf={'center'}>
                    <Input
                        height={'66px'}
                        width={'385px'}
                        borderRadius={'48px'}
                        borderColor={'#555555'}
                        backgroundColor={'#121212'}
                    />
                </Flex> */}
            </Flex>
        </Flex>
    );
};

export default VendorSearch;
