'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Container, Box } from '@chakra-ui/react';
// import ProductCardGroup from '@modules/products/components/product-card-group';
import SideMenu from './component/store-side-menu';
import useStorePage from '@store/store-page/store-page';
import useSideFilter from '@store/store-page/side-filter';
import MobileFilter from './component/mobile-fitler/mobile-filter';
import ProductCardGroup from '@modules/products/components/product-group-store';
import StoreFilterDisplay from '@modules/store-v2/component/store-filter-display';
import RangeSliderComponent from './component/range-slider';

const StoreTemplate = () => {
    //ipad pro 1024px
    //ipad air 820px (hide left)

    const { categorySelect } = useStorePage();
    const { reviewFilterSelect } = useSideFilter();

    //TODO: make zustand state for default vendor "all"
    const [vendorName, setVendorName] = useState('All');
    useEffect(() => {
        if (categorySelect) {
            setVendorName(categorySelect);
        }
    }, [categorySelect]);

    useEffect(() => {
        console.log(`${reviewFilterSelect}`);
    }, [reviewFilterSelect]);

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
                        <ProductCardGroup
                            filterByRating={reviewFilterSelect}
                            vendorName={vendorName}
                            category=""
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default StoreTemplate;

// <Flex justifyContent={'center'}>
//     <Flex
//         maxW="1340px"
//         w={'100%'}
//         flexDirection={'column'}
//         justifyContent={'center'}
//         alignItems={'center'}
//         mx={{ base: '0', md: '1rem' }}
//         my="2rem"
//     >
//         <Flex
//             mt={{ base: '-3rem', md: '0' }}
//             mx="1rem"
//             maxW="1307.74px"
//             w="100%"
//             justifyContent={'center'}
//             alignContent={'center'}
//             flexDirection={{ base: 'column', md: 'row' }}
//         >
//             <MobileFilter />
//             <SideMenu />
//             <ProductCardGroup
//                 filterByRating={reviewFilterSelect}
//                 vendorName={vendorName}
//                 category=""
//             />
//         </Flex>
//     </Flex>
// </Flex>
