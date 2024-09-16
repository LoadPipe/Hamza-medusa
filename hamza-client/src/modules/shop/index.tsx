'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Container, Box } from '@chakra-ui/react';
// import ProductCardGroup from '@modules/products/components/product-card-group';
import SideMenu from './components/desktop-side-filter/store-side-menu';
import useStorePage from '@store/store-page/store-page';
import MobileFilter from '@modules/shop/components/mobile-filter/mobile-filter';
import ProductCardGroup from '@modules/products/components/product-group-store';
import StoreFilterDisplay from '@modules/shop/components/store-filter-display';
import RangeSliderComponent from '@modules/shop/components/range-slider';

const ShopTemplate = () => {
    return (
        <Flex justifyContent={'center'}>
            <Flex
                maxW="1340px"
                w={'100%'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                mx={{ base: '0', md: '1rem' }}
                my="2rem"
            >
                <Flex
                    mt={{ base: '-3rem', md: '0' }}
                    mx="1rem"
                    maxW="1307.74px"
                    w="100%"
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems={'flex-start'}
                    gap={'20px'}
                >
                    <MobileFilter />
                    <SideMenu />
                    <Flex maxW={'941px'} w="100%" flexDirection={'column'}>
                        <StoreFilterDisplay />
                        <ProductCardGroup />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ShopTemplate;
