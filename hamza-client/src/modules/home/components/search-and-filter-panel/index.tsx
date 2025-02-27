'use client';

import React from 'react';
import ProductCardGroup from '@/modules/products/components/product-group';
import {Flex} from '@chakra-ui/react';
import FilterBar from './components/filter-bar/FilterBar';

const SearchAndFilterPanel = ({}) => {

    return (
        <Flex
            mx={'auto'}
            maxW={'1280px'}
            width={'100%'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <FilterBar/>
                <ProductCardGroup/>
        </Flex>
    );
};

export default SearchAndFilterPanel;
