'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductCardGroup from '@modules/products/components/product-group-vendor';
import { Flex } from '@chakra-ui/react';
import SearchBar from '@modules/home/components/search-and-filter-panel/components/SearchBar';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';

const VendorProductDisplay = () => {
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
            {/* <SearchBar /> */}
            <ProductCardGroup vendorName={vendorName} />
        </Flex>
    );
};

export default VendorProductDisplay;
