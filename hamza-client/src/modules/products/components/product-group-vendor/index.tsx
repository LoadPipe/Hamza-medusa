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
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import ProductCardHome from '../product-group-home/component/home-product-card';
import useVendor from '@store/store-page/vendor';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { isArray } from 'lodash';

type Props = {
    storeName: string;
    handle: string | null;
    filterByRating?: string | null;
    allProducts: boolean;
};

const ProductCardGroup = ({ storeName, handle }: Props) => {
    // get preferred currency
    const { preferred_currency_code } = useCustomerAuthStore();
    const { storeId } = useVendor();

    const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products/handle?store_name=${storeName}&category=${handle}`;

    // Fetch data using the useQuery hook
    const { data, error, isLoading } = useQuery(
        ['products', handle],
        async () => {
            console.log('Fetching data from URL:', url);
            const response = await axios.get(url);
            console.log('Data fetched:', response.data);
            return response.data;
        }
    );

    // Check if the fetched data is in the correct format

    const productsAll = data
        ? data.flatMap((category: any) => category.products) // Extract all products from all categories
        : [];

    console.log('product data', productsAll);

    if (isLoading) {
        return (
            <Flex
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
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Flex>
        );
    }

    return (
        <Flex
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
                {productsAll.map((product: any, index: number) => {
                    const variant = product.variants[0];
                    const productPricing =
                        variant?.prices?.find(
                            (price: any) =>
                                price.currency_code === preferred_currency_code
                        )?.amount ||
                        variant?.prices?.[0]?.amount ||
                        0;
                    const formattedPrice = formatCryptoPrice(
                        productPricing ?? 0,
                        preferred_currency_code as string
                    );
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
                                productHandle={product.handle}
                                reviewCount={0}
                                totalRating={0}
                                variantID={'0'}
                                countryCode={product.countryCode}
                                productName={product.title}
                                productPrice={formattedPrice}
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
