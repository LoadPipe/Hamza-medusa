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
import ProductCardStore from '@modules/shop/components/product-card';
import SkeletonProductGrid from '@modules/skeletons/components/skeleton-product-grid';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import useStorePage from '@store/store-page/store-page';

const ProductCardGroup = () => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const { categorySelect } = useStorePage();
    const [visibleProductsCount, setVisibleProductsCount] = useState(15); // State to manage visible products count (4 rows, 16 items)

    //TODO: MOVE TO INDEX.TS
    // Get products from vendor
    const { data, error, isLoading } = useQuery(
        ['categories', categorySelect], // Use a unique key here to identify the query
        async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/product/category/products?category_name=${categorySelect}`;
            const response = await axios.get(url);
            return response.data; // Return the data from the response
        }
    );

    const productsAll = data
        ? categorySelect === 'All'
            ? data // If category is 'all', data is a flat list of products
            : data.flatMap((category: any) => category.products) // Otherwise, extract products from categories
        : [];

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
        <Box maxW={'941px'} w="100%">
            <Grid
                mt={{ base: '0px', md: '2rem' }}
                mx={{ base: '1rem', md: '0' }}
                templateColumns={{
                    base: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                }}
                gap={{ base: 4, md: 7 }}
            >
                {visibleProducts.map((product: any, index: number) => {
                    // Extract product details
                    const variant = product.variants[0]; // Assuming you want the first variant
                    const productPricing =
                        variant?.prices?.find(
                            (price: any) =>
                                price.currency_code === (preferred_currency_code ?? 'usdc')
                        )?.amount ||
                        variant?.prices?.[0]?.amount ||
                        0; // Get the price for the preferred currency or fallback to the first price

                    const formattedPrice = formatCryptoPrice(
                        productPricing ?? 0,
                        (preferred_currency_code ?? 'usdc') as string
                    );

                    return (
                        <GridItem
                            key={index}
                            minHeight={'243.73px'}
                            height={{ base: '100%', md: '399px' }}
                            width="100%"
                        >
                            <ProductCardStore
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
        </Box>
    );
};

export default ProductCardGroup;

// 'use client';

// import React from 'react';
// import { Box, Skeleton, SkeletonText, Grid, GridItem } from '@chakra-ui/react';
// import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';
// import { formatCryptoPrice } from '@lib/util/get-product-price';
// import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
// import ProductCardStore from '@modules/shop/components/product-card';

// type Props = {
//     vendorName: string;
//     filterByRating: string | null;
//     category: string;
// };

// const ProductCardGroup = ({ vendorName, filterByRating, category }: Props) => {
//     // Get products from store
//     //TODO: MOVE TO INDEX.TS
//     const { data, error, isLoading } = useQuery(
//         ['products', { vendor: vendorName }],
//         () => {
//             const url =
//                 vendorName === 'All'
//                     ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products`
//                     : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products?store_name=${vendorName}`;

//             //TODO: MOVE TO INDEX.TS
//             return axios.get(url);
//         }
//     );

//     const { preferred_currency_code } = useCustomerAuthStore();
//     console.log('user preferred currency code: ', preferred_currency_code);

//     if (isLoading) {
//         return null; // Suspense will handle the loading fallback.
//     }

//     const err: any = error ? error : null;
//     if (err) return <div>Error: {err?.message}</div>;

//     const products = data?.data;

//     // Function to filter products by rating
//     const filterProductsByRating = (
//         products: any[],
//         filterByRating: string | null
//     ) => {
//         if (!filterByRating || filterByRating === 'All') {
//             return products;
//         }

//         const ratingThreshold = parseFloat(filterByRating);
//         return products.filter((product) => {
//             const reviewCounter = product.reviews.length;
//             const totalRating = product.reviews.reduce(
//                 (acc: number, review: any) => acc + review.rating,
//                 0
//             );
//             const avgRating = totalRating / reviewCounter;
//             const roundedAvgRating = parseFloat(avgRating.toFixed(2));

//             console.log(`avgRating is ${roundedAvgRating}`);

//             switch (ratingThreshold) {
//                 case 4:
//                     console.log('5');
//                     return roundedAvgRating >= 4.0 && roundedAvgRating <= 5.0;
//                 case 3:
//                     return roundedAvgRating > 2.0 && roundedAvgRating <= 3.0;
//                 case 2:
//                     return roundedAvgRating > 1.0 && roundedAvgRating <= 2.0;
//                 case 1:
//                     return roundedAvgRating >= 0.0 && roundedAvgRating <= 1.0;
//                 default:
//                     return true;
//             }
//         });
//     };

//     const filteredProducts = filterProductsByRating(products, filterByRating);

//     const renderSkeletons = (num: number) => {
//         return Array.from({ length: num }).map((_, index) => (
//             <GridItem
//                 key={index}
//                 maxW="295px"
//                 h="399px"
//                 borderRadius="16px"
//                 overflow="hidden"
//                 backgroundColor="#121212"
//                 p="4"
//             >
//                 <Skeleton height="240px" />
//                 <Box p="4">
//                     <SkeletonText mt="4" noOfLines={3} spacing="4" />
//                     <Skeleton mt="4" height="20px" />
//                     <Skeleton mt="2" height="20px" width="60px" />
//                 </Box>
//             </GridItem>
//         ));
//     };

//     return (
//         <Box maxW={'941px'} w="100%">
//             <Grid
//                 mt={{ base: '0px', md: '3rem' }}
//                 mx={{ base: '1rem', md: '0' }}
//                 templateColumns={{
//                     base: 'repeat(2, 1fr)',
//                     lg: 'repeat(3, 1fr)',
//                 }}
//                 gap={{ base: 4, md: 7 }}
//             >
//                 {isLoading
//                     ? renderSkeletons(8) // Render 8 skeletons while loading
//                     : filteredProducts.map((product: any, index: number) => {
//                           const variantPrices = product.variants
//                               .map((variant: any) => variant.prices)
//                               .flat();

//                           const selectedPrice =
//                               variantPrices.find(
//                                   (p: any) =>
//                                       p.currency_code ===
//                                       preferred_currency_code
//                               ) ??
//                               variantPrices.find(
//                                   (p: any) => p.currency_code === 'usdc'
//                               );
//                           const productPricing = formatCryptoPrice(
//                               selectedPrice?.amount ?? 0,
//                               preferred_currency_code as string
//                           );
//                           const reviewCounter = product.reviews.length;
//                           const totalRating = product.reviews.reduce(
//                               (acc: number, review: any) => acc + review.rating,
//                               0
//                           );
//                           const avgRating = totalRating / reviewCounter;
//                           const roundedAvgRating = parseFloat(
//                               avgRating.toFixed(2)
//                           );

//                           const variantID = product.variants[0]?.id;
//                           return (
//                               <GridItem
//                                   key={index}
//                                   minH={'243.73px'}
//                                   //   maxW={{ base: '100%', md: '295px' }}
//                                   h={{ base: '100%', md: '399px' }}
//                                   w="100%"
//                               >
//                                   <ProductCardStore
//                                       key={index}
//                                       productHandle={products[index].handle}
//                                       reviewCount={reviewCounter}
//                                       totalRating={avgRating}
//                                       variantID={variantID}
//                                       countryCode={product.countryCode}
//                                       productName={product.title}
//                                       productPrice={productPricing}
//                                       currencyCode={
//                                           preferred_currency_code ?? 'usdc'
//                                       }
//                                       imageSrc={product.thumbnail}
//                                       hasDiscount={product.is_giftcard}
//                                       discountValue={product.discountValue}
//                                       productId={product.id}
//                                       inventory={
//                                           product.variants[0]
//                                               ?.inventory_quantity
//                                       }
//                                       allow_backorder={
//                                           product.variants[0]?.allow_backorder
//                                       }
//                                       storeId={product.store_id}
//                                   />
//                               </GridItem>
//                           );
//                       })}
//             </Grid>
//         </Box>
//     );
// };

// export default ProductCardGroup;
