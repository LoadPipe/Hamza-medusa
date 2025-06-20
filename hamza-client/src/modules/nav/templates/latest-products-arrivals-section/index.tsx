'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    SimpleGrid,
    Link as ChakraLink,
    Flex,
    Skeleton,
    SkeletonText,
    GridItem,
} from '@chakra-ui/react';
import ProductCard from '../../../products/components/product-card'
import { Product, ProductReview, ProductPrice, LatestProductsResponse } from '@/types/global';
import { useQuery } from '@tanstack/react-query';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';
import { getLatestProducts } from '@/lib/server';


const LatestArrivalsSection: React.FC = () => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const PRODUCTS_TO_DISPLAY_INITIAL = 4;

    const [latestProducts, setLatestProducts] = useState<Product[]>([]);

    function getFormattedProductPrice(
        variant: any,
        preferred_currency_code: string | null
    ) {
        const productPricing =
            variant?.prices?.find(
                (price: ProductPrice) =>
                    price.currency_code === (preferred_currency_code ?? 'usdc')
            )?.amount ||
            variant?.prices?.[0]?.amount ||
            0;

        return formatCryptoPrice(
            productPricing ?? 0,
            preferred_currency_code as string
        );
    }

    const { data, isLoading, isError, error } = useQuery<LatestProductsResponse>({
        queryKey: ['latestProducts', preferred_currency_code],
        queryFn: () => getLatestProducts(PRODUCTS_TO_DISPLAY_INITIAL, 0),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    // Update latestProducts when new data arrives
    useEffect(() => {
        if (data?.products) {
            setLatestProducts(data.products.slice(0, PRODUCTS_TO_DISPLAY_INITIAL));
        }
    }, [data]);

    // Handler for "View all" click
    const handleViewAllClick = () => {
        console.log('View All clicked! This feature will be available in a future sprint.');
    };

    // Initial Loading State
    if (isLoading) {
        return (
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }} mt={{ base: '8', md: '16' }}>
                <Flex justifyContent="space-between" alignItems="center" mb={{ base: '6', md: '8' }}>
                    <Text
                        fontSize={{ base: '2xl', md: '4xl' }}
                        fontWeight="bold"
                        color="white"
                    >
                        Latest Arrivals
                    </Text>
                    {/* Skeleton for "View All" */}
                    <Skeleton width="100px" height="24px" />
                </Flex>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing={{ base: '4', md: '8' }}
                >
                    {/* Render skeletons */}
                    {Array.from({ length: PRODUCTS_TO_DISPLAY_INITIAL }).map((_, index) => (
                        <GridItem
                            key={index}
                            minHeight="243.73px"
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                            borderRadius="16px"
                            overflow="hidden"
                            backgroundColor="#121212"
                        >
                            <Skeleton height={{ base: '134.73px', md: '238px' }} width="100%" />
                            <Box p={{ base: '2', md: '4' }}>
                                <SkeletonText
                                    mt={{ base: '1', md: '4' }}
                                    noOfLines={2}
                                    spacing={{ base: '3', md: '4' }}
                                />
                            </Box>
                        </GridItem>
                    ))}
                </SimpleGrid>
            </Box>
        );
    }

    // Error State
    if (isError) {
        return (
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }} mt={{ base: '8', md: '16' }}>
                <Text color="red.500" textAlign="center" fontSize="xl">
                    Error loading latest arrivals: {error?.message || 'Unknown error.'}
                </Text>
            </Box>
        );
    }

    // No Products State
    if (latestProducts.length === 0 && !isLoading) {
        return (
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }} mt={{ base: '8', md: '16' }}>
                <Text color="gray.500" textAlign="center" fontSize="xl">
                    No latest products available.
                </Text>
            </Box>
        );
    }

    return (
        <Box px={{ base: '4', md: '4' }} py={{ base: '8', md: '16' }}>
            <Flex justifyContent="space-between" alignItems="center" mb={{ base: '6', md: '8' }}>
                <Text
                    fontSize={{ base: '2xl', md: '4xl' }}
                    fontWeight="bold"
                    color="white"
                >
                    Latest Arrivals
                </Text>
                <ChakraLink
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="primary.green.900"
                    _hover={{ textDecoration: 'underline', color: 'gray.300' }}
                    display="flex"
                    alignItems="center"
                    onClick={handleViewAllClick}
                    cursor="pointer"
                >
                    View all
                    <Box as="span" ml="2" display="inline-block" transform="translateX(0)" transition="transform 0.2s ease-in-out" _groupHover={{ transform: 'translateX(4px)' }}>
                        &rarr;
                    </Box>
                </ChakraLink>
            </Flex>

            <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={{ base: '4', md: '8' }}
            >
                {latestProducts.map((product) => {
                    try {
                        const variant = product.variants[0];
                        if (!variant) {
                            console.warn(`Product ${product.id} has no variants, skipping.`);
                            return null;
                        }

                        const formattedPrice = getFormattedProductPrice(
                            variant,
                            preferred_currency_code
                        );

                        const usdcFormattedPrice = formatPriceBetweenCurrencies(
                            variant?.prices,
                            preferred_currency_code ?? 'usdc',
                            'usdc'
                        );

                        // Calculate review stats
                        const reviewCounter = product.reviews?.length || 0;
                        const totalRatingSum = (product.reviews || []).reduce(
                            (acc: number, review: ProductReview) =>
                                acc + (review?.rating || 0),
                            0
                        );
                        const avgRating = reviewCounter
                            ? totalRatingSum / reviewCounter
                            : 0;
                        const roundedAvgRating = parseFloat(
                            avgRating.toFixed(2)
                        );


                        return (
                            <ProductCard
                                key={product.id}
                                reviewCount={reviewCounter}
                                totalRating={roundedAvgRating}
                                productHandle={product.handle}
                                variantID={variant.id}
                                countryCode={product.origin_country || 'us'}
                                productName={product.title}
                                productPrice={formattedPrice}
                                usdcProductPrice={usdcFormattedPrice}
                                currencyCode={preferred_currency_code || 'usdc'}
                                imageSrc={product.thumbnail || 'https://via.placeholder.com/200'}
                                hasDiscount={product.is_giftcard || false}
                                discountValue={product.discountValue || ''}
                                productId={product.id}
                                inventory={variant.inventory_quantity}
                                allow_backorder={variant.allow_backorder}
                                storeId={product.store_id || ''}
                            />
                        );
                    } catch (err) {
                        console.error('Error rendering product card:', err, product);
                        return null;
                    }
                })}
            </SimpleGrid>
        </Box>
    );
};

export default LatestArrivalsSection;