'use client';

import React, { useState } from 'react';
import {
    Box,
    Skeleton,
    SkeletonText,
    Grid,
    GridItem,
    Flex,
    Button,
    Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProductCard from '@modules/shop/components/product-card';
import useStorePage from '@/zustand/store-page/store-page';
import useShopFilter from '@/zustand/store-page/shop-filter';

const ProductCardGroup = () => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const { categorySelect } = useStorePage();
    const [visibleProductsCount, setVisibleProductsCount] = useState(15); // State to manage visible products count (4 rows, 16 items)
    const { rangeUpper, rangeLower } = useShopFilter();

    const { data, error, isLoading } = useQuery(
        [
            'categories',
            categorySelect,
            rangeUpper,
            rangeLower,
            preferred_currency_code,
        ], // Use a unique key here to identify the query
        async () => {
            const multiUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/product/filter?category_name=${categorySelect}&price_hi=${rangeUpper}&price_lo=${rangeLower}&currency_code=${preferred_currency_code ?? 'usdc'}`;
            const response = await axios.get(multiUrl);
            return response.data; // Return the data from the response
        }
    );

    const productsAll = data?.products || [];

    const handleViewMore = () => {
        // Increase the visible products count by 16 (4 rows of 4 products)
        setVisibleProductsCount((prevCount) => prevCount + 15);
    };

    const visibleProducts = productsAll.slice(0, visibleProductsCount);

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
                        lg: 'repeat(3, 1fr)',
                    }}
                    gap={{ base: '4', md: '25.5px' }}
                >
                    {Array.from({ length: 9 }).map((_, index) => (
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
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Flex>
        );
    }

    return (
        <Box maxW={'941px'} w="100%">
            {productsAll.length === 0 ? (
                <Text
                    mt={{ base: '2rem', md: '4rem' }}
                    textAlign="center"
                    fontSize={{ base: '14px', md: '16px' }}
                    fontWeight={600}
                    color="white"
                >
                    No products available for the selected filters.
                </Text>
            ) : (
                <>
                    <Grid
                        mt={{ base: '0px', md: '2rem' }}
                        mx={{ base: '1rem', md: '0' }}
                        templateColumns={{
                            base: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        }}
                        gap={{ base: 4, md: 7 }}
                    >
                        {productsAll?.length &&
                            visibleProducts.map(
                                (product: any, index: number) => {
                                    // Extract product details
                                    const variant = product?.variants[0]; // Assuming you want the first variant
                                    const productPricing =
                                        variant?.prices?.find(
                                            (price: any) =>
                                                price.currency_code ===
                                                (preferred_currency_code ??
                                                    'usdc')
                                        )?.amount ||
                                        variant?.prices?.[0]?.amount ||
                                        0; // Get the price for the preferred currency or fallback to the first price

                                    let usdcProductPrice: number;
                                    let usdcFormattedPrice: string | number =
                                        '';
                                    if (preferred_currency_code === 'eth') {
                                        usdcProductPrice =
                                            variant?.prices?.find(
                                                (price: any) =>
                                                    price.currency_code ===
                                                    'usdc'
                                            )?.amount ||
                                            variant?.prices?.[0]?.amount ||
                                            0;
                                        usdcFormattedPrice = formatCryptoPrice(
                                            usdcProductPrice ?? 0,
                                            'usdc'
                                        );
                                    }

                                    const formattedPrice = formatCryptoPrice(
                                        productPricing ?? 0,
                                        (preferred_currency_code ??
                                            'usdc') as string
                                    );

                                    const reviewCounter =
                                        product.reviews.length;
                                    const totalRating = product.reviews.reduce(
                                        (acc: number, review: any) =>
                                            acc + review.rating,
                                        0
                                    );
                                    const avgRating = reviewCounter
                                        ? totalRating / reviewCounter
                                        : 0;
                                    const roundedAvgRating = parseFloat(
                                        avgRating.toFixed(2)
                                    );

                                    return (
                                        <GridItem
                                            key={index}
                                            minHeight={'243.73px'}
                                            height={{
                                                base: '100%',
                                                md: '399px',
                                            }}
                                            width="100%"
                                        >
                                            <ProductCard
                                                key={index}
                                                reviewCount={reviewCounter}
                                                totalRating={roundedAvgRating}
                                                productHandle={
                                                    product?.handle ?? ''
                                                }
                                                variantID={variant?.id ?? ''}
                                                countryCode={
                                                    product?.origin_country ??
                                                    ''
                                                }
                                                productName={
                                                    product?.title ?? ''
                                                }
                                                productPrice={
                                                    formattedPrice ?? ''
                                                }
                                                usdcProductPrice={
                                                    usdcFormattedPrice
                                                }
                                                currencyCode={
                                                    preferred_currency_code ||
                                                    'usdc'
                                                }
                                                imageSrc={
                                                    product?.thumbnail ?? ''
                                                }
                                                hasDiscount={
                                                    product?.is_giftcard ??
                                                    false
                                                }
                                                discountValue={
                                                    product?.discountValue ?? ''
                                                }
                                                productId={product?.id ?? ''}
                                                inventory={
                                                    variant?.inventory_quantity ??
                                                    0
                                                }
                                                allow_backorder={
                                                    variant?.allow_backorder
                                                }
                                                storeId={
                                                    product?.store_id ?? ''
                                                }
                                            />
                                        </GridItem>
                                    );
                                }
                            )}
                    </Grid>

                    {/* Show the "View More" button only if there are more products to display */}
                    <Flex>
                        {visibleProductsCount < productsAll.length && (
                            <Button
                                mt="2rem"
                                mx="auto"
                                alignSelf={'center'}
                                textAlign={'center'}
                                onClick={handleViewMore}
                                variant="solid"
                                borderRadius={'full'}
                                backgroundColor={'white'}
                                color="black"
                            >
                                Show More
                            </Button>
                        )}
                    </Flex>
                </>
            )}
        </Box>
    );
};

export default ProductCardGroup;
