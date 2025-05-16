'use client';

import React, { useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import SideFilter from './components/desktop-side-filter/side-filter';
import MobileFilter from '@modules/shop/components/mobile-filter-modal/mobile-filter';
import ProductCardGroup from '@modules/products/components/product-group';
import StoreFilterDisplay from '@modules/shop/components/store-filter-display';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ShopTemplateProps {
    category?: string;
}

interface Category {
    id: string;
    name: string;
    handle: string;
    metadata: {
        icon_url: string;
    };
}

const ShopTemplate = ({ category }: ShopTemplateProps) => {
    const setSelectedCategories = useUnifiedFilterStore(
        (state) => state.setSelectedCategories
    );

    const { data: categoryData } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
            const response = await axios.get(url);
            return response.data;
        },
    });

    useEffect(() => {
        if (category && categoryData) {
            const normalizedUrlCategory = category.toLowerCase();

            const categoryExists = categoryData.some(
                (cat) =>
                    cat.handle.replace(/_/g, '-').toLowerCase() === normalizedUrlCategory
            );

            if (categoryExists) {
                setSelectedCategories([normalizedUrlCategory]);
            } else {
                console.log(
                    `Category "${category}" not found in the fetched list. Setting to all.`
                );
                setSelectedCategories(['all']);
            }
        }
    }, [category, categoryData, setSelectedCategories]);


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

                        <Box mt={{ base: '0', md: '1rem' }}>
                            <ProductCardGroup
                                columns={{ base: 2, lg: 3 }}
                                gap={{ base: 4, md: '7' }}
                                skeletonCount={9}
                                productsPerPage={24}
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
