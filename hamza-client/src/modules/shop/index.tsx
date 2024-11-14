'use client';

import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import SideFilter from './components/desktop-side-filter/side-filter';
import MobileFilter from '@modules/shop/components/mobile-filter-modal/mobile-filter';
import ProductCardGroup from '@modules/products/components/product-group';
import StoreFilterDisplay from '@modules/shop/components/store-filter-display';

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
                    <SideFilter />
                    <Flex maxW={'941px'} w="100%" flexDirection={'column'}>
                        <StoreFilterDisplay />

                        <Box mt={{ base: '0', md: '2rem' }}>
                            <ProductCardGroup
                                columns={{ base: 2, lg: 3 }}
                                skeletonCount={9}
                                visibleProductCountInitial={16}
                                padding={{ base: '1rem', md: '0' }}
                            />
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ShopTemplate;
