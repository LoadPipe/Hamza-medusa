'use client';

import React, { useEffect, useRef } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import SideFilter from './components/desktop-side-filter/side-filter';
import MobileFilter from '@modules/shop/components/mobile-filter-modal/mobile-filter';
import ProductCardGroup from '@modules/products/components/product-group';
import StoreFilterDisplay from '@modules/shop/components/store-filter-display';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useStorePage from '@/zustand/store-page/store-page';
import { useSearchParams } from 'next/navigation';

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
    const {
        setSelectedCategories,
        setRangeUpper,
        setRangeLower,
        hasHydrated,
        setHasHydrated,
        setRange,
        clearFilters
    } = useUnifiedFilterStore();

    const storePageState = useStorePage();
    const searchParams = useSearchParams();
    const urlParamsApplied = useRef(false);

    // Fetch available categories
    const { data: categoryData } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
            try {
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                // Silent failure, we'll handle UI gracefully
                return [];
            }
        },
    });

    // Ensure store is hydrated
    useEffect(() => {
        if (!hasHydrated) {
            setHasHydrated(true);
        }
    }, [hasHydrated, setHasHydrated]);

    // Apply URL parameters to filters
    useEffect(() => {
        // Skip if not ready or already applied
        if (!hasHydrated || urlParamsApplied.current) {
            return;
        }

        // Read URL parameters
        const categoryParam = searchParams.get('category');
        const priceHi = searchParams.get('price_hi');
        const priceLo = searchParams.get('price_lo');

        // Only proceed if we have URL parameters to apply
        if (!categoryParam && !priceHi && !priceLo) {
            return;
        }

        // Start with a clean slate
        clearFilters();

        // Process and apply category filter
        if (categoryParam) {
            applyUrlCategoryFilter(categoryParam);
        }

        // Process and apply price range filter
        const lowerValue = priceLo ? parseInt(priceLo, 10) : 0;
        const upperValue = priceHi ? parseInt(priceHi, 10) : 5000000;

        setRangeLower(lowerValue);
        setRangeUpper(upperValue);
        setRange([lowerValue, upperValue]);

        // Mark as applied
        urlParamsApplied.current = true;
    }, [
        searchParams,
        hasHydrated,
        clearFilters,
        setSelectedCategories,
        setRangeLower,
        setRangeUpper,
        setRange
    ]);

    // Helper function to process and apply category filter from URL
    const applyUrlCategoryFilter = (categoryParam: string) => {
        // Normalize and process categories
        const normalizedCategories = categoryParam
            .split(',')
            .map(cat => {
                const decoded = decodeURIComponent(cat.replace(/\+/g, ' '));
                return decoded.trim().toLowerCase();
            })
            .filter(cat => cat.length > 0);

        // Handle 'all' category specially
        if (normalizedCategories.includes('all')) {
            setSelectedCategories(['all']);

            // Update the store page state if available
            if (storePageState?.setCategorySelect) {
                storePageState.setCategorySelect(() => ['all']);
            }
            return;
        }

        // Apply regular categories if present
        if (normalizedCategories.length > 0) {
            setSelectedCategories(normalizedCategories);

            // Update the store page state if available
            if (storePageState?.setCategorySelect) {
                storePageState.setCategorySelect(() => normalizedCategories);
            }
        }
    };

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
