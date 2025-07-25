'use client';

import React, { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import StoreCatButton from './store-cat-button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCardGroup from '@modules/products/components/product-group-store';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

type Props = {
    storeName: string;
};

const StoreSearch = ({ storeName }: Props) => {
    // Get categories and update buttons
    const { data, error, isLoading } = useQuery({
        queryKey: ['categoriesStore', storeName
        ],
        queryFn: () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/categories?store_name=${storeName}`;
            return axios.get(url);
        }
    });

    let categoryNames = [];

    if (data && data.data) {
        categoryNames = data?.data;
        console.log(data.data);
    } else {
        console.log('No data available');
    }

    const { selectedCategories, setSelectedCategories } = useUnifiedFilterStore();

    useEffect(() => {
        if (data && data.data) {
            const storeCats: string[] = data.data.map((cat: string) => cat.toLowerCase());
            
            // Compute the intersection with the current persistent filter.
            const intersection = selectedCategories.filter((cat) =>
                storeCats.includes(cat)
            );

            // Sort both arrays for stable comparison.
            const sortedIntersection = [...intersection].sort();
            const sortedSelected = [...selectedCategories].sort();

            if (JSON.stringify(sortedIntersection) !== JSON.stringify(sortedSelected)) {
                // If no valid category remains, reset to ['all']
                setSelectedCategories(sortedIntersection.length === 0 ? ['all'] : sortedIntersection);
            }
        }
    }, [data, setSelectedCategories]);

    return (
        <Flex flexDir={'column'} width={'100%'}>
            <Flex
                position="relative"
                mx={{ base: '1rem', md: '2rem' }}
                flexDir="row"
                maxWidth="1256.52px"
                width="100%"
                my={{ base: '1.5rem', md: '3rem' }}
                gap="0.75rem"
                className="store-filters"
                overflowX="auto"
                flexWrap="nowrap"
                pb="0.5rem" 
                sx={{
                    '&::-webkit-scrollbar': {
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.5)',
                        },
                    },
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
                }}
            >
                <StoreCatButton categoryName={'All'} />

                {categoryNames.map((name: any, index: number) => (
                    <StoreCatButton key={index} categoryName={name} />
                ))}
            </Flex>

            <ProductCardGroup storeName={storeName} />
        </Flex>
    );
};

export default StoreSearch;
