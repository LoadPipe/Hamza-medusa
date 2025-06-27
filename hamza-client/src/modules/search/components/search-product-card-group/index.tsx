'use client';

import React, { useEffect, useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProductCard from '@modules/products/components/product-card';
import { getProductsListWithSort } from '@/lib/server';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';
import {
    Product,
    ProductPrice,
    ProductReview,
    ProductPreviewType,
} from '@/types/global';
import { SortOptions } from '@modules/shop/components/refinement-list/sort-products';
import Script from 'next/script';

interface SearchProductCardGroupProps {
    productsIds: string[];
    sortBy?: SortOptions;
    page: number;
    countryCode: string;
    columns?: { base: number; lg: number };
    gap?: { base: number; md: string };
    skeletonCount?: number;
    skeletonHeight?: { base: string; md: string };
    productsPerPage?: number;
    padding?: { base: string; md: string };
}

interface ProductResponse {
    products: ProductPreviewType[];
    count: number;
}

const SearchProductCardGroup: React.FC<SearchProductCardGroupProps> = ({
    productsIds,
    sortBy = 'created_at',
    page = 1,
    countryCode,
    columns = { base: 2, lg: 3 },
    gap = { base: 4, md: '7' },
    skeletonCount = 9,
    skeletonHeight = { base: '134.73px', md: '238px' },
    productsPerPage = 12,
    padding = { base: '1rem', md: '0' },
}) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const [allProducts, setAllProducts] = useState<ProductPreviewType[]>([]);
    const [currentPage, setCurrentPage] = useState(page);
    const [hasMore, setHasMore] = useState(true);

    function getFormattedProductPrice(
        variant: any,
        preferred_currency_code: string | null
    ) {
        const productPricing =
            variant?.prices?.find(
                (price: ProductPrice) =>
                    price.currency_code === (preferred_currency_code ?? 'usdc')
            )?.amount ||
            variant?.prices?.[0]?.amount ||
            0;

        return formatCryptoPrice(
            productPricing ?? 0,
            preferred_currency_code as string
        );
    }

    // Main product loading query
    const { data, error, isLoading, isFetching } = useQuery<{
        response: { products: ProductPreviewType[]; count: number };
        nextPage: number | null;
    }>({
        queryKey: ['search-products', productsIds, sortBy, currentPage],
        queryFn: () =>
            getProductsListWithSort({
                page: currentPage,
                queryParams: {
                    id: productsIds,
                    limit: productsPerPage,
                },
                sortBy,
                countryCode,
            }),
        enabled: productsIds.length > 0,
        staleTime: 60 * 1000,
        retry: 1,
    });

    // Update products when new data is loaded
    useEffect(() => {
        if (data?.response?.products) {
            if (currentPage === 1) {
                // First page, replace all products
                setAllProducts(data.response.products);
            } else {
                // Subsequent pages, append new products
                const currentProductIds = new Set(allProducts.map((p) => p.id));
                const newProducts = data.response.products.filter(
                    (p) => !currentProductIds.has(p.id)
                );

                if (newProducts.length > 0) {
                    setAllProducts((prev) => [...prev, ...newProducts]);
                }
            }

            // Update hasMore flag
            setHasMore(data.response.products.length === productsPerPage);
        }
    }, [data, currentPage, allProducts, productsPerPage]);

    // Reset when productsIds change (new search)
    useEffect(() => {
        setAllProducts([]);
        setCurrentPage(1);
        setHasMore(true);
    }, [productsIds]);

    // Load more products handler
    const handleLoadMore = () => {
        if (!isFetching && hasMore) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Generate schema for SEO
    const generateItemListSchema = (products: ProductPreviewType[]) => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Search Results - ${products.length} products found`,
            itemListElement: products.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: product.title,
                    image: product.thumbnail,
                    url: `${process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL}/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${product.handle}`,
                    offers: {
                        '@type': 'Offer',
                        price: formatCryptoPrice(
                            product.prices?.[0]?.amount || 0,
                            product.prices?.[0]?.currency_code ||
                                preferred_currency_code ||
                                'usdc'
                        ),
                        priceCurrency:
                            product.prices?.[0]?.currency_code ||
                            preferred_currency_code ||
                            'usdc',
                        availability: 'https://schema.org/InStock',
                    },
                },
            })),
        };

        return JSON.stringify(schema);
    };

    // Loading UI
    if (isLoading && currentPage === 1) {
        return (
            <Flex
                mt={{ base: '0', md: '1rem' }}
                mb={'4rem'}
                maxW={'1280px'}
                width="100%"
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection="column"
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

                {error && (
                    <Text mt={4} color="red.500">
                        Error loading search results. Please try again.
                    </Text>
                )}
            </Flex>
        );
    }

    // No results found
    if (!isLoading && allProducts.length === 0 && productsIds.length > 0) {
        return (
            <Flex
                mt={{ base: '0', md: '1rem' }}
                mb={'4rem'}
                maxW={'1280px'}
                width="100%"
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection="column"
                px={{ base: padding.base, md: padding.md }}
            >
                <Text
                    textAlign="center"
                    fontSize="lg"
                    my={8}
                    color="whiteAlpha.800"
                >
                    No products found for your search.
                </Text>
            </Flex>
        );
    }

    return (
        <>
            {allProducts.length > 0 && (
                <Script
                    id="search-product-list-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: generateItemListSchema(allProducts),
                    }}
                />
            )}
            <Flex
                mt={{ base: '0', md: '1rem' }}
                mb={'4rem'}
                maxW={'1280px'}
                width="100%"
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                className="search-product-cards"
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
                    {allProducts.map((product) => {
                        try {
                            console.log('product: ', product);
                            // ProductPreviewType has limited data, so we need to adapt

                            const preferredCurrencyCode =
                                preferred_currency_code || 'usdc';

                            const productPrice =
                                product.prices?.find(
                                    (price) =>
                                        price.currency_code ===
                                        preferredCurrencyCode
                                )?.amount ||
                                product.prices?.[0]?.amount ||
                                0;

                            const formattedPrice = formatCryptoPrice(
                                productPrice,
                                preferredCurrencyCode
                            );

                            const usdcFormattedPrice =
                                formatPriceBetweenCurrencies(
                                    product.prices || [],
                                    preferred_currency_code ?? 'usdc',
                                    'usdc'
                                );

                            // ProductPreviewType doesn't have review data, use defaults
                            const reviewCounter = 0;
                            const roundedAvgRating = 0;

                            return (
                                <GridItem
                                    key={product.id}
                                    minHeight={'243.73px'}
                                    height={{ base: '100%', md: '399px' }}
                                    width="100%"
                                    my={{ base: '2', md: '0' }}
                                >
                                    <ProductCard
                                        key={product.id}
                                        reviewCount={reviewCounter}
                                        totalRating={roundedAvgRating}
                                        productHandle={product.handle || ''}
                                        variantID={''}
                                        countryCode={''}
                                        productName={product.title}
                                        productPrice={formattedPrice}
                                        usdcProductPrice={usdcFormattedPrice}
                                        currencyCode={preferredCurrencyCode}
                                        imageSrc={product.thumbnail || ''}
                                        hasDiscount={false}
                                        discountValue={''}
                                        productId={product.id}
                                        inventory={999}
                                        allow_backorder={false}
                                        storeId={''}
                                    />
                                </GridItem>
                            );
                        } catch (err) {
                            console.error(
                                'Error rendering search product:',
                                err
                            );
                            return null;
                        }
                    })}
                </Grid>

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
                                bg: isFetching
                                    ? 'transparent'
                                    : 'rgba(0, 128, 0, 0.05)',
                                transform: isFetching
                                    ? 'none'
                                    : 'translateY(-2px)',
                                boxShadow: isFetching
                                    ? 'none'
                                    : '0 4px 6px rgba(0, 128, 0, 0.1)',
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
                                    <Spinner
                                        size="sm"
                                        color="primary.green.900"
                                        thickness="2px"
                                    />
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
        </>
    );
};

export default SearchProductCardGroup;
