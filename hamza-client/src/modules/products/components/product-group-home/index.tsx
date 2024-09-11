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
} from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import ProductCardHome from './component/home-product-card';
import SkeletonProductGrid from '@modules/skeletons/components/skeleton-product-grid';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';

const ProductCardGroup = () => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const { categorySelect } = useHomeProductsPage();
    const [visibleProductsCount, setVisibleProductsCount] = useState(16); // State to manage visible products count (4 rows, 16 items)

    //TODO: MOVE TO INDEX.TS
    // Get products from vendor
    const { data, error, isLoading } = useQuery(
        ['categories'], // Use a unique key here to identify the query
        async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;

            const response = await axios.get(url);
            return response.data; // Return the data from the response
        }
    );

    // productsAll will contain all products from all categories
    const productsAll = data
        ? data.flatMap((category: any) => category.products) // Extract all products from all categories
        : [];

    // products will contain filtered products based on category selection
    const products =
        categorySelect === 'All'
            ? productsAll
            : data
                  ?.filter((category: any) => category.name === categorySelect) // Match the category name
                  .flatMap((category: any) => category.products) || []; // Extract products for the selected category

    const handleViewMore = () => {
        // Increase the visible products count by 16 (4 rows of 4 products)
        setVisibleProductsCount((prevCount) => prevCount + 16);
    };

    const visibleProducts = products.slice(0, visibleProductsCount);

    console.log('Filtered products:', products);
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
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            px="1rem"
        >
            <Grid
                maxWidth={'1256.52px'}
                width="100%"
                templateColumns={{
                    base: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)',
                }}
                gap={{ base: '4', md: '25.5px' }}
            >
                {visibleProducts.map((product: any, index: number) => {
                    // Extract product details
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
                            minHeight={'243.73px'}
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                        >
                            <ProductCardHome
                                key={index}
                                productHandle={product.handle}
                                reviewCount={product.review}
                                totalRating={10}
                                variantID={variant?.id}
                                countryCode={product.origin_country}
                                productName={product.title}
                                productPrice={formattedPrice}
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

            {/* Show the "View More" button only if there are more products to display */}
            {visibleProductsCount < products.length && (
                <Button
                    mt="2rem"
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
    );
};

export default ProductCardGroup;
