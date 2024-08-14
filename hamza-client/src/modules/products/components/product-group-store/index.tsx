'use client';

import React from 'react';
import { Box, Skeleton, SkeletonText, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import ProductCardStore from '@modules/store/components/product-card';

type Props = {
    vendorName: string;
    filterByRating: string | null;
    category: string;
};

const ProductCardGroup = ({ vendorName, filterByRating, category }: Props) => {
    // Get products from vendor
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () => {
            const url =
                vendorName === 'All'
                    ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products`
                    : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products?store_name=${vendorName}`;

            return axios.get(url);
        }
    );

    const { preferred_currency_code } = useCustomerAuthStore();

    if (isLoading) {
        return null; // Suspense will handle the loading fallback.
    }

    const err: any = error ? error : null;
    if (err) return <div>Error: {err?.message}</div>;

    const products = data?.data;

    // Function to filter products by rating
    const filterProductsByRating = (
        products: any[],
        filterByRating: string | null
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

    const renderSkeletons = (num: number) => {
        return Array.from({ length: num }).map((_, index) => (
            <GridItem
                key={index}
                maxW="295px"
                h="399px"
                borderRadius="16px"
                overflow="hidden"
                backgroundColor="#121212"
                p="4"
            >
                <Skeleton height="240px" />
                <Box p="4">
                    <SkeletonText mt="4" noOfLines={3} spacing="4" />
                    <Skeleton mt="4" height="20px" />
                    <Skeleton mt="2" height="20px" width="60px" />
                </Box>
            </GridItem>
        ));
    };

    return (
        <Box maxW={'941px'} w="100%">
            <Grid
                mt={{ base: '0px', md: '3rem' }}
                mx={{ base: '1rem', md: '0' }}
                templateColumns={{
                    base: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                }}
                gap={{ base: 4, md: 7 }}
            >
                {isLoading
                    ? renderSkeletons(8) // Render 8 skeletons while loading
                    : filteredProducts.map((product: any, index: number) => {
                        const variantPrices = product.variants
                            .map((variant: any) => variant.prices)
                            .flat();

                        const selectedPrice = variantPrices.find(
                            (p: any) =>
                                p.currency_code ===
                                preferred_currency_code
                        ) ?? variantPrices.find((p: any) => p.currency_code === 'usdc');
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
                        const roundedAvgRating = parseFloat(
                            avgRating.toFixed(2)
                        );

                        const variantID = product.variants[0].id;
                        return (
                            <GridItem
                                key={index}
                                minH={'243.73px'}
                                //   maxW={{ base: '100%', md: '295px' }}
                                h={{ base: '100%', md: '399px' }}
                                w="100%"
                            >
                                <ProductCardStore
                                    key={index}
                                    productHandle={products[index].handle}
                                    reviewCount={reviewCounter}
                                    totalRating={avgRating}
                                    variantID={variantID}
                                    countryCode={product.countryCode}
                                    productName={product.title}
                                    productPrice={productPricing}
                                    currencyCode={
                                        preferred_currency_code ?? 'usdc'
                                    }
                                    imageSrc={product.thumbnail}
                                    hasDiscount={product.is_giftcard}
                                    discountValue={product.discountValue}
                                    productId={product.id}
                                    inventory={
                                        product.variants[0].inventory_quantity
                                    }
                                    allow_backorder={
                                        product.variants[0].allow_backorder
                                    }
                                    storeId={product.store_id}
                                />
                            </GridItem>
                        );
                    })}
            </Grid>
        </Box>
    );
};

export default ProductCardGroup;
