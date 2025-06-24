'use client';

import React, { useEffect, useRef } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import MobileFilter from '@modules/shop/components/mobile-filter-modal/mobile-filter';
import ProductCardGroup from '@modules/products/components/product-group';
import StoreFilterDisplay from '@modules/shop/components/store-filter-display';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useStorePage from '@/zustand/store-page/store-page';
import { useSearchParams } from 'next/navigation';
import SideFilter from '../shop/components/desktop-side-filter/side-filter';

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

const CategoryTemplate = ({ category }: ShopTemplateProps) => {
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

        // Start with a clean slate
        clearFilters();

        // If we're on a category page, use the category prop instead of query params
        if (category) {
            // Set the category from the URL path, ignore query parameters
            setSelectedCategories([category]);

            // Update store page state
            if (storePageState?.setCategorySelect) {
                storePageState.setCategorySelect(() => [category]);
            }
        } else {
            // Only apply category query params if we're NOT on a category page
            const categoryParam = searchParams.get('category');
            if (categoryParam) {
                applyUrlCategoryFilter(categoryParam);
            }
        }

        // Still apply price filters
        const priceHi = searchParams.get('price_hi');
        const priceLo = searchParams.get('price_lo');

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
        category,
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
                    justifyContent={category ? 'center' : 'flex-start'}
                >
                    {/* Only show filters on general shop page, */}
                    {!category && <MobileFilter />}
                    {!category && <SideFilter />}

                    <Flex
                        // Adjust max width based on whether filters are shown
                        maxW={category ? '100%' : '941px'}
                        w="100%"
                        flexDirection={'column'}
                    >
                        {/* Only show filter display on general shop page */}
                        {!category && <StoreFilterDisplay />}

                        <Box mt={{ base: '0', md: '1rem' }}>
                            <ProductCardGroup
                                columns={{ base: 2, lg: 4 }}
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

export default CategoryTemplate;
