'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Skeleton,
    SkeletonText,
    Grid,
    GridItem,
    Flex,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProductCard from '../product-card/product-card';
import useHomeProductsPage from '@/zustand/home-page/product-layout/product-layout';
import useHomeModalFilter from '@/zustand/home-page/home-filter/home-filter';
import { getAllProducts } from '@lib/data';
import useProductGroup from '@/zustand/products/product-group/product-group';
import useProductFilterModal from '@/zustand/products/filter/product-filter';
import { useSearchParams } from 'next/navigation';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';

const ProductCardGroup = ({
    columns = { base: 2, lg: 4 },
    gap = { base: 4, md: '25.5px' },
    skeletonCount = 8,
    skeletonHeight = { base: '134.73', md: '238px' },
    visibleProductCountInitial = 16,
    padding = { base: '1rem', md: '1rem' },
}) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const { categorySelect, setCategorySelect } = useProductGroup();
    const [visibleProductsCount, setVisibleProductsCount] = useState(
        visibleProductCountInitial
    );

    const { rangeUpper, rangeLower } = useProductFilterModal();

    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get('category');

    useEffect(() => {
        if (categoryFromUrl) {
            setCategorySelect([categoryFromUrl]);
        }
    }, [categoryFromUrl, setCategorySelect]);

    const { data, error, isLoading } = useQuery(
        ['categories', categorySelect, rangeUpper, rangeLower],
        () =>
            getAllProducts(
                categorySelect,
                rangeUpper,
                rangeLower,
                preferred_currency_code ?? 'usdc'
            ),
        {
            staleTime: 60 * 1000,
            cacheTime: 2 * 60 * 1000,
        }
    );

    const productsAll = data?.products ?? [];

    if (isLoading) {
        return (
            <Flex
                mt={{ base: '0', md: '1rem' }}
                mb={'4rem'}
                maxW={'1280px'}
                width="100%"
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Grid
                    maxWidth={'1256.52px'}
                    mx="1rem"
                    width="100%"
                    templateColumns={{
                        base: `repeat(${columns.base}, 1fr)`,
                        lg: `repeat(${columns.lg}, 1fr)`,
                    }}
                    gap={gap}
                >
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <GridItem
                            key={index}
                            minHeight="243.73px"
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                            borderRadius="16px"
                            overflow="hidden"
                            backgroundColor="#121212"
                        >
                            <Skeleton height={skeletonHeight} width="100%" />
                            <Box p={{ base: '2', md: '4' }}>
                                <SkeletonText
                                    mt={{ base: '1', md: '4' }}
                                    noOfLines={2}
                                    spacing={{ base: '3', md: '4' }}
                                />
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Flex>
        );
    }

    return (
        <Flex
            mt={{ base: '0', md: '1rem' }}
            mb={'4rem'}
            maxW={'1280px'}
            width="100%"
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            px={{ base: padding.base, md: padding.md }}
        >
            <Grid
                maxWidth={'1256.52px'}
                width="100%"
                templateColumns={{
                    base: `repeat(${columns.base}, 1fr)`,
                    lg: `repeat(${columns.lg}, 1fr)`,
                }}
                gap={gap}
            >
                {productsAll.map((product: any, index: number) => {
                    const variant = product.variants[0];
                    const productPricing =
                        variant?.prices?.find(
                            (price: any) =>
                                price.currency_code ===
                                (preferred_currency_code ?? 'usdc')
                        )?.amount ||
                        variant?.prices?.[0]?.amount ||
                        0;

                    const formattedPrice = formatCryptoPrice(
                        productPricing ?? 0,
                        preferred_currency_code as string
                    );

                    const usdcFormattedPrice = formatPriceBetweenCurrencies(
                        variant?.prices,
                        preferred_currency_code ?? 'usdc',
                        'usdc'
                    );

                    const reviewCounter = product.reviews.length;
                    const totalRating = product.reviews.reduce(
                        (acc: number, review: any) => acc + review.rating,
                        0
                    );
                    const avgRating = reviewCounter
                        ? totalRating / reviewCounter
                        : 0;
                    const roundedAvgRating = parseFloat(avgRating.toFixed(2));

                    return (
                        <GridItem
                            key={index}
                            minHeight={'243.73px'}
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                            my={{ base: '2', md: '0' }}
                        >
                            <ProductCard
                                key={index}
                                reviewCount={reviewCounter}
                                totalRating={roundedAvgRating}
                                productHandle={product.handle}
                                variantID={variant?.id}
                                countryCode={product.origin_country}
                                productName={product.title}
                                productPrice={formattedPrice}
                                usdcProductPrice={usdcFormattedPrice}
                                currencyCode={preferred_currency_code || 'usdc'}
                                imageSrc={product.thumbnail}
                                hasDiscount={product.is_giftcard}
                                discountValue={product.discountValue}
                                productId={product.id}
                                inventory={variant?.inventory_quantity}
                                allow_backorder={variant?.allow_backorder}
                                storeId={product.store_id}
                            />
                        </GridItem>
                    );
                })}
            </Grid>
        </Flex>
    );
};

export default ProductCardGroup;
