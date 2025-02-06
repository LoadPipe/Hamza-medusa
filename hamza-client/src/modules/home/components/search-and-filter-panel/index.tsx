'use client';

import React from 'react';
import ProductCardGroup from '@/modules/products/components/product-group';
import { Flex } from '@chakra-ui/react';
import FilterBar from './components/filter-bar/FilterBar';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'

const SearchAndFilterPanel = ({
    dehydratedState,
}: {
    dehydratedState: any;
}) => {
    const queryClient = new QueryClient();

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
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductCardGroup />
            </HydrationBoundary>
        </Flex>
    );
};

export default SearchAndFilterPanel;
