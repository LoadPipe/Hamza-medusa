'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    SimpleGrid,
    Flex,
    Skeleton,
    SkeletonText,
    GridItem,
} from '@chakra-ui/react';
import ProductCard from '@modules/products/components/product-card';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';
import { getLatestProducts } from '@/lib/server';
import { LatestProductsResponse, Product, ProductPrice, ProductVariants } from '@/types/global';

const PRODUCTS_PER_PAGE = 24;

const LatestArrivalsTemplate = () => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const [latestProducts, setLatestProducts] = useState<Product[]>([]);

    const { data, isLoading, isError, error } = useQuery<LatestProductsResponse>({
        queryKey: ['latestProducts', preferred_currency_code, PRODUCTS_PER_PAGE],
        queryFn: () => getLatestProducts(PRODUCTS_PER_PAGE, 0),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    useEffect(() => {
        if (data?.products) {
            setLatestProducts(data.products);
        }
    }, [data]);

    // Utility for price formatting
    function getFormattedProductPrice(
        variant: ProductVariants,
        preferred_currency_code: string
    ) {
        const productPricing =
            variant?.prices?.find(
                (price: ProductPrice) =>
                    price.currency_code === (preferred_currency_code ?? 'usdc')
            )?.amount ||
            variant?.prices?.[0]?.amount ||
            0;

        return formatCryptoPrice(productPricing ?? 0, preferred_currency_code);
    }

    // Loading state
    if (isLoading) {
        return (
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }}>
                <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="white" mb="8">
                    Latest Arrivals
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: '4', md: '8' }}>
                    {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, idx) => (
                        <GridItem
                            key={idx}
                            minHeight="243.73px"
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                            borderRadius="16px"
                            overflow="hidden"
                            backgroundColor="#121212"
                        >
                            <Skeleton height={{ base: '134.73px', md: '238px' }} width="100%" />
                            <Box p={{ base: '2', md: '4' }}>
                                <SkeletonText mt={{ base: '1', md: '4' }} noOfLines={2} spacing={{ base: '3', md: '4' }} />
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
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }}>
                <Text color="red.500" textAlign="center" fontSize="xl">
                    Error loading latest arrivals: {error?.message || 'Unknown error.'}
                </Text>
            </Box>
        );
    }

    // No Products State
    if (latestProducts.length === 0 && !isLoading) {
        return (
            <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }}>
                <Text color="gray.500" textAlign="center" fontSize="xl">
                    No latest products available.
                </Text>
            </Box>
        );
    }

    return (
        <Box px={{ base: '4', md: '16' }} py={{ base: '8', md: '16' }}>
            <Flex justifyContent="flex-start" alignItems="center" mb={{ base: '6', md: '8' }}>
                <Text
                    fontSize={{ base: '2xl', md: '4xl' }}
                    fontWeight="bold"
                    color="white"
                >
                    Latest Arrivals
                </Text>
            </Flex>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: '4', md: '8' }}>
                {latestProducts.map((product) => {
                    try {
                        const variant = product.variants?.[0];
                        if (!variant) {
                            console.warn(`Product ${product.id} has no variants, skipping.`);
                            return null;
                        }

                        const formattedPrice = getFormattedProductPrice(
                            variant,
                            preferred_currency_code ?? 'usdc'
                        );

                        const usdcFormattedPrice = formatPriceBetweenCurrencies(
                            variant?.prices,
                            preferred_currency_code ?? 'usdc',
                            'usdc'
                        );

                        // Calculate review stats
                        const reviewCounter = product.reviews?.length || 0;
                        const totalRatingSum = (product.reviews || []).reduce(
                            (acc, review) => acc + (review?.rating || 0),
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

export default LatestArrivalsTemplate;