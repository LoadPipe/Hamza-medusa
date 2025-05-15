'use client';

import React, {useEffect, useState} from 'react';
import {
    Box,
    Skeleton,
    SkeletonText,
    Grid,
    GridItem,
    Flex,
    Text,
    Spinner,
} from '@chakra-ui/react';
import {useQuery} from '@tanstack/react-query';
import {formatCryptoPrice} from '@lib/util/get-product-price';
import {useCustomerAuthStore} from '@/zustand/customer-auth/customer-auth';
import ProductCard from '../product-card';
import {getAllProducts} from '@/lib/server';
import {useSearchParams} from 'next/navigation';
import {formatPriceBetweenCurrencies} from '@/lib/util/prices';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { Product, ProductPrice, ProductReview } from '@/types/global';

interface ProductResponse {
    products: Product[];
    count: number;
}

const ProductCardGroup = ({
  columns = {base: 2, lg: 4},
  gap = {base: 4, md: '25.5px'},
  skeletonCount = 8,
  skeletonHeight = {base: '134.73', md: '238px'},
    productsPerPage = 24,
  padding = {base: '1rem', md: '1rem'},
}) => {
    const {preferred_currency_code} = useCustomerAuthStore();
    const {
        selectedCategories,
        setSelectedCategories,
        range,
        rangeUpper,
        rangeLower,
        setRange,
        setRangeUpper,
        setRangeLower,
      } = useUnifiedFilterStore();

    // State for pagination with proper typing
    const [offset, setOffset] = useState(0);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get('category');

    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategories([categoryFromUrl.toLowerCase()]);
        }
    }, [categoryFromUrl, setSelectedCategories]);

    // Reset pagination when filters change
    useEffect(() => {
        setOffset(0);
        setAllProducts([]);
        setHasMore(true);
    }, [selectedCategories, rangeUpper, rangeLower]);

    const { data, error, isLoading, isFetching } = useQuery<ProductResponse>({
        queryKey: ['categories', selectedCategories, rangeUpper, rangeLower, offset],
        queryFn: () =>
            getAllProducts(
                selectedCategories,
                rangeUpper,
                rangeLower,
                preferred_currency_code ?? 'usdc',
                productsPerPage,
                offset
            ),
        staleTime: 60 * 1000,
    });

    // Update allProducts when new data is loaded
    useEffect(() => {
        if (data?.products) {
            if (offset === 0) {
                setAllProducts(data.products);
            } else {
                setAllProducts(prev => [...prev, ...data.products]);
            }

            // Check if we have more products to load
            setHasMore(data.products.length === productsPerPage);
        }
    }, [data, offset, productsPerPage]);

    // Load more products handler
    const handleLoadMore = () => {
        setOffset(prev => prev + productsPerPage);
    };

    if (isLoading && offset === 0) {
        return (
            <Flex
                mt={{base: '0', md: '1rem'}}
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
                    {Array.from({length: skeletonCount}).map((_, index) => (
                        <GridItem
                            key={index}
                            minHeight="243.73px"
                            height={{base: '100%', md: '399px'}}
                            width="100%"
                            borderRadius="16px"
                            overflow="hidden"
                            backgroundColor="#121212"
                        >
                            <Skeleton height={skeletonHeight} width="100%"/>
                            <Box p={{base: '2', md: '4'}}>
                                <SkeletonText
                                    mt={{base: '1', md: '4'}}
                                    noOfLines={2}
                                    spacing={{base: '3', md: '4'}}
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
            mt={{base: '0', md: '1rem'}}
            mb={'4rem'}
            maxW={'1280px'}
            width="100%"
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            className="product-cards"
            px={{base: padding.base, md: padding.md}}
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
                {allProducts.map((product, index) => {
                    const variant = product.variants[0];
                    const productPricing =
                        variant?.prices?.find(
                            (price: ProductPrice) =>
                                price.currency_code ===
                                (preferred_currency_code ?? 'usdc'),
                        )?.amount ||
                        variant?.prices?.[0]?.amount ||
                        0;

                    const formattedPrice = formatCryptoPrice(
                        productPricing ?? 0,
                        preferred_currency_code as string,
                    );

                    const usdcFormattedPrice = formatPriceBetweenCurrencies(
                        variant?.prices,
                        preferred_currency_code ?? 'usdc',
                        'usdc',
                    );

                    const reviewCounter = product.reviews.length;
                    const totalRating = product.reviews.reduce(
                        (acc: number, review: ProductReview) => acc + review.rating,
                        0,
                    );
                    const avgRating = reviewCounter
                        ? totalRating / reviewCounter
                        : 0;
                    const roundedAvgRating = parseFloat(avgRating.toFixed(2));

                    return (
                        <GridItem
                            key={index}
                            minHeight={'243.73px'}
                            height={{base: '100%', md: '399px'}}
                            width="100%"
                            my={{base: '2', md: '0'}}
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
                                discountValue={product.discountValue || ''}
                                productId={product.id}
                                inventory={variant?.inventory_quantity}
                                allow_backorder={variant?.allow_backorder}
                                storeId={product.store_id}
                            />
                        </GridItem>
                    );
                })}
            </Grid>

            {/* No products message */}
            {allProducts.length === 0 && !isLoading && (
                <Text textAlign="center" fontSize="lg" my={8}>
                    No products found. Try adjusting your filters.
                </Text>
            )}

            {/* Load More Button */}
            {hasMore && allProducts.length > 0 && (
                <Flex justifyContent="center" width="100%" mt={8}>
                    <Flex
                        display={{ base: 'flex' }}
                        height={{ base: '33px', md: '47px' }}
                        width={{ base: '120px', md: '190px' }}
                        borderColor={'primary.green.900'}
                        borderWidth={'1px'}
                        borderRadius={'37px'}
                        justifyContent={'center'}
                        cursor={isFetching ? 'default' : 'pointer'}
                        fontSize={{ base: '12px', md: '16px' }}
                        onClick={isFetching ? undefined : handleLoadMore}
                        opacity={isFetching ? 0.7 : 1}
                        position="relative"
                        transition="all 0.2s"
                        _hover={{
                            bg: isFetching ? 'transparent' : 'rgba(0, 128, 0, 0.05)',
                            transform: isFetching ? 'none' : 'translateY(-2px)',
                            boxShadow: isFetching ? 'none' : '0 4px 6px rgba(0, 128, 0, 0.1)'
                        }}
                    >
                        {isFetching && (
                            <Flex
                                position="absolute"
                                width="100%"
                                height="100%"
                                justifyContent="center"
                                alignItems="center"
                                borderRadius={'37px'}
                                bg="rgba(255, 255, 255, 0.7)"
                                backdropFilter="blur(4px)"
                            >
                                <Spinner size="sm" color="primary.green.900" thickness="2px" />
                            </Flex>
                        )}
                        <Text
                            alignSelf={'center'}
                            color="primary.green.900"
                            fontWeight={700}
                            opacity={isFetching ? 0.3 : 1}
                            transition="opacity 0.2s"
                        >
                            Load More
                        </Text>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default ProductCardGroup;
