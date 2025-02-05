'use client';

import React from 'react';
import ProductCardGroup from '@/modules/products/components/product-group';
import { Flex } from '@chakra-ui/react';
import FilterBar from './components/filter-bar/FilterBar';
import { Hydrate } from '@tanstack/react-query';

const SearchAndFilterPanel = ({
    dehydratedState,
}: {
    dehydratedState: any;
}) => {
    return (
        <Flex
            mx={'auto'}
            maxW={'1280px'}
            width={'100%'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <FilterBar />
            <Hydrate state={dehydratedState}>
                <ProductCardGroup />
            </Hydrate>
        </Flex>
    );
};

export default SearchAndFilterPanel;
