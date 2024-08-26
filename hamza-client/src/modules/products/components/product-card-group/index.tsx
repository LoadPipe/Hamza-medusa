'use client';

import React from 'react';
import ProductCard from '../product-card';
import {
    SimpleGrid,
    Container,
    Box,
    Skeleton,
    SkeletonText,
    Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import StoreFilterDisplay from '@modules/store/components/store-filter-display';
import { getProductsByVendor } from '@lib/data';

type Props = {
    vendorName: string;
    filterByRating: string | null;
    category: string;
    gridColumns: {
        base?: number;
        sm?: number;
        md?: number;
        lg?: number;
    };
    layoutMaxWidth: string;
};

const ProductCardGroup = ({
    vendorName,
    filterByRating,
    category,
    gridColumns,
    layoutMaxWidth,
}: Props) => {
    // Get products from vendor
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () =>
            getProductsByVendor(vendorName).catch((err) => {
                console.log(err);
                return null;
            })
    );

    const { preferred_currency_code } = useCustomerAuthStore();
    console.log('user preferred currency code: ', preferred_currency_code);

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
            <Box
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
            </Box>
        ));
    };

    //TODO: Make product card clickable to product preview
    return (
        <Container maxWidth={layoutMaxWidth} backgroundColor={'transparent'}>
            <StoreFilterDisplay />
            <Flex
                gap={'24px'}
                // justifyContent={{ base: 'space-between', md: 'center' }}
                flexBasis={{
                    base: 'calc(50% - 5px)',
                    md: 'calc(33.33% - 6.67px)',
                }}
                wrap="wrap" // Allow items to wrap onto the next line
            >
                {isLoading
                    ? renderSkeletons(8) // Render 8 skeletons while loading
                    : filteredProducts.map((product: any, index: number) => {
                        const variantPrices = product.variants
                            .map((variant: any) => variant.prices)
                            .flat();

                        const productPricing = formatCryptoPrice(
                            variantPrices.find(
                                (p: any) =>
                                    p.currency_code ===
                                    preferred_currency_code
                            ).amount,
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

                        const variantID = product.variants[0]?.id;
                        return (
                            <ProductCard
                                key={index}
                                productHandle={products[index].handle}
                                variantID={variantID}
                                reviewCount={reviewCounter}
                                totalRating={roundedAvgRating}
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
                            />
                        );
                    })}
            </Flex>
        </Container>
    );
};

export default ProductCardGroup;
