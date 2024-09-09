'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductCardGroup from '@modules/products/components/product-group-home';
import { Flex } from '@chakra-ui/react';
import SearchBar from './components/SearchBar';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import FilterBar from './components/filter-bar/FilterBar';

const SearchAndFilterPanel = () => {
    const { categorySelect } = useHomeProductsPage();
    const [vendorName, setVendorName] = useState('All');

    useEffect(() => {
        if (categorySelect) {
            setVendorName(categorySelect);
        }
    }, [categorySelect]);

    return (
        <Flex
            mx={'auto'}
            maxW={'1280px'}
            width={'100%'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <SearchBar />
            <FilterBar />
            <ProductCardGroup />
        </Flex>
    );
};

export default SearchAndFilterPanel;
