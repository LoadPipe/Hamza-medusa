'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductCardGroup from '@modules/products/components/product-group-store';
import { Flex } from '@chakra-ui/react';
import SearchBar from '@modules/home/components/search-and-filter-panel/components/SearchBar';
import StoreSearch from './store-search';

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
