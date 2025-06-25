'use client';

import React from 'react';
import {
    Box,
    Text,
    SimpleGrid,
    Flex,
    Skeleton,
    SkeletonText,
    GridItem,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FeaturedStoresResponse } from '@/types/global';
import { getFeaturedStores } from '@/lib/server';
import StoreCard from '@/modules/store/components/store-card';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';


const FeaturedStoresSection: React.FC = () => {
    const STORES_TO_DISPLAY = 4;
    const { selectedCategories } = useUnifiedFilterStore();

    console.log('Selected Categories:', selectedCategories);

    const activeCategories = selectedCategories.filter(c => c !== 'all');
    const { data, isLoading, isError, error } =
        useQuery<FeaturedStoresResponse>({
            queryKey: ['featuredStores', activeCategories],
            queryFn: () => getFeaturedStores(activeCategories),
            staleTime: 5 * 60 * 1000,
            retry: 1,
        });

    const stores = data?.stores || [];

    console.log('Featured Stores Data:', data);


    // --- STATE: INITIAL LOADING ---
    if (isLoading) {
        return (
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }} mt={{ base: '8', md: '16' }}>
                <Flex justifyContent="space-between" alignItems="center" mb={{ base: '6', md: '8' }}>
                    <Text
                        fontSize={{ base: '2xl', md: '4xl' }}
                        fontWeight="bold"
                        color="white"
                    >
                        Featured Stores
                    </Text>
                    <Skeleton width="100px" height="24px" />
                </Flex>
                <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: '4', md: '8' }}>
                    {Array.from({ length: STORES_TO_DISPLAY }).map((_, index) => (
                        <GridItem
                            key={index}
                            borderRadius="16px"
                            overflow="hidden"
                            backgroundColor="#121212"
                        >
                            <Skeleton height={{ base: '150px', md: '200px' }} width="100%" />
                            <Box p={{ base: '3', md: '4' }}>
                                <SkeletonText mt="4" noOfLines={3} spacing="4" />
                            </Box>
                        </GridItem>
                    ))}
                </SimpleGrid>
            </Box>
        );
    }

    // --- STATE: ERROR  ---
    if (isError) {
        return (
            <Box px={{ base: '4', md: '4' }} py={{ base: '8', md: '16' }}>
                <Text color="red.500" textAlign="center" fontSize="xl">
                    Error loading featured stores: {error?.message || 'Unknown error.'}
                </Text>
            </Box>
        );
    }

    // --- Don't render the section if there are no stores ---
    if (stores.length === 0 && !isLoading) {
        return null;
    }

    // --- STATE: SUCCESS  ---
    return (
        <Box px={{ base: '4', md: '4' }} py={{ base: '8', md: '16' }} width="100%">
            <Flex justifyContent="space-between" alignItems="center" mb={{ base: '6', md: '8' }}>
                <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="white">
                    Featured Stores
                </Text>
            </Flex>

            <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={{ base: '4', md: '8' }}
            >
                {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default FeaturedStoresSection;