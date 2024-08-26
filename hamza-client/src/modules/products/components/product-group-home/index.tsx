'use client';

import React, { useState } from 'react';
import {
    Box,
    Skeleton,
    SkeletonText,
    Grid,
    GridItem,
    Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import ProductCardHome from './component/home-product-card';
import SkeletonProductGrid from '@modules/skeletons/components/skeleton-product-grid';

type Props = {
    vendorName: string;
    filterByRating?: string | null;
    category?: string | null;
};

const ProductCardGroup = ({ vendorName, filterByRating, category }: Props) => {

    //TODO: MOVE TO INDEX.TS
    // Get products from vendor
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () => {
            const url =
                vendorName === 'All'
                    ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products`
                    : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products?store_name=${vendorName}`;

            //TODO: MOVE TO INDEX.TS
            return axios.get(url);
        }
    );

    const { preferred_currency_code } = useCustomerAuthStore();
    console.log('user preferred currency code: ', preferred_currency_code);

    const products = data?.data;

    const err: any = error ? error : null;
    if (err) return <div>Error: {err?.message}</div>;

    // Function to filter products by rating
    const filterProductsByRating = (
        products: any[],
        filterByRating: string | null | undefined
    ) => {
        if (!filterByRating || filterByRating === 'All') {
            return products;
        }

        const ratingThreshold = parseFloat(filterByRating);
        return products.filter((product) => {
            const reviewCounter = product.reviews.length;
            const totalRating = product.reviews.reduce(
                (acc: number, review: any) => acc + review.rating,
                0
            );
            const avgRating = totalRating / reviewCounter;
            const roundedAvgRating = parseFloat(avgRating.toFixed(2));

            console.log(`avgRating is ${roundedAvgRating}`);

            switch (ratingThreshold) {
                case 4:
                    console.log('5');
                    return roundedAvgRating >= 4.0 && roundedAvgRating <= 5.0;
                case 3:
                    return roundedAvgRating > 2.0 && roundedAvgRating <= 3.0;
                case 2:
                    return roundedAvgRating > 1.0 && roundedAvgRating <= 2.0;
                case 1:
                    return roundedAvgRating >= 0.0 && roundedAvgRating <= 1.0;
                default:
                    return true;
            }
        });
    };

    const filteredProducts = filterProductsByRating(products, filterByRating);

    if (isLoading) {
        return (
            <Flex
                mt={{ base: '0', md: '1rem' }}
                mb={'4rem'}
                maxW={'1280px'}
                width="100%"
                mx="auto"
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Grid
                    maxWidth={'1256.52px'}
                    mx="1rem"
                    width="100%"
                    templateColumns={{
                        base: 'repeat(2, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    }}
                    gap={{ base: '4', md: '25.5px' }}
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <GridItem
                            key={index}
                            minHeight="243.73px"
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                            borderRadius="16px"
                            overflow="hidden"
                            backgroundColor="#121212"
                        >
                            <Skeleton
                                height={{ base: '134.73', md: '238px' }}
                                width="100%"
                            />
                            <Box p={{ base: '2', md: '4' }}>
                                <SkeletonText
                                    mt={{ base: '1', md: '4' }}
                                    noOfLines={2}
                                    spacing={{ base: '3', md: '4' }}
                                />
                                {/* <SkeletonText
                                    mt="10"
                                    noOfLines={2}
                                    spacing="4"
                                /> */}
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
            mx="auto"
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Grid
                maxWidth={'1256.52px'}
                mx="1rem"
                width="100%"
                templateColumns={{
                    base: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)',
                }}
                gap={{ base: '4', md: '25.5px' }}
            >
                {filteredProducts.map((product: any, index: number) => {
                    const variantPrices = product.variants
                        .map((variant: any) => variant.prices)
                        .flat();

                    const selectedPrice =
                        variantPrices.find(
                            (p: any) =>
                                p.currency_code === preferred_currency_code
                        ) ??
                        variantPrices.find(
                            (p: any) => p.currency_code === 'usdc'
                        );
                    const productPricing = formatCryptoPrice(
                        selectedPrice?.amount ?? 0,
                        preferred_currency_code as string
                    );
                    const reviewCounter = product.reviews.length;
                    const totalRating = product.reviews.reduce(
                        (acc: number, review: any) => acc + review.rating,
                        0
                    );
                    const avgRating = totalRating / reviewCounter;
                    const roundedAvgRating = parseFloat(avgRating.toFixed(2));

                    const variantID = product.variants[0]?.id;
                    return (
                        <GridItem
                            key={index}
                            //   maxW={'295px'}
                            minHeight={'243.73px'}
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                        >
                            <ProductCardHome
                                key={index}
                                productHandle={products[index].handle}
                                reviewCount={reviewCounter}
                                totalRating={avgRating}
                                variantID={variantID}
                                countryCode={product.countryCode}
                                productName={product.title}
                                productPrice={productPricing}
                                currencyCode={preferred_currency_code ?? 'usdc'}
                                imageSrc={product.thumbnail}
                                hasDiscount={product.is_giftcard}
                                discountValue={product.discountValue}
                                productId={product.id}
                                inventory={
                                    product.variants[0]?.inventory_quantity
                                }
                                allow_backorder={
                                    product.variants[0]?.allow_backorder
                                }
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
