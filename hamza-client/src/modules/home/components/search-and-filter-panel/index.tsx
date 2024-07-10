'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductCardGroup from '@modules/products/components/product-group-home';
import { Flex } from '@chakra-ui/react';
import SearchBar from './components/SearchBar';
import SkeletonProductGrid from '@modules/skeletons/components/skeleton-product-grid';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import FilterBar from './components/filter-bar/FilterBar';

const SearchAndFilterPanel = () => {
    const { categorySelect } = useHomeProductsPage();
    const [vendorName, setVendorName] = useState('All');
    const [isClient, setIsClient] = useState(false);

    // Ensure that the component knows when it's running on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

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
            {isClient ? (
                <Suspense fallback={<SkeletonProductGrid />}>
                    <ProductCardGroup vendorName={vendorName} />
                </Suspense>
            ) : (
                <SkeletonProductGrid />
            )}
        </Flex>
    );
};

export default SearchAndFilterPanel;
