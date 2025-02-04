'use client';

import React from 'react';
import { Flex } from '@chakra-ui/react';
import StoreSearch from '../components/store-search';

type Props = {
    storeName: string;
};

const StoreProductDisplay = ({ storeName }: Props) => {
    return (
        <Flex
            mx={'auto'}
            maxW={'1280px'}
            width={'100%'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            {/* <SearchBar /> */}
            <StoreSearch storeName={storeName} />
        </Flex>
    );
};

export default StoreProductDisplay;
