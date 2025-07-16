'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
import ProductCard from '../product-card';
import { getAllProducts } from '@/lib/server';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { Product, ProductPrice, ProductReview } from '@/types/global';
import Script from 'next/script';

interface ProductResponse {
    products: Product[];
    count: number;
}

interface CategoryData {
    subcategories: any[];
    totalProducts: number;
    products: Product[];
    count: number;
}

interface ProductCardGroupProps {
    columns?: { base: number; lg: number };
    gap?: { base: number; md: string };
    skeletonCount?: number;
    skeletonHeight?: { base: string; md: string };
    productsPerPage?: number;
    padding?: { base: string; md: string };
    preloadedCategoryData?: CategoryData | null;
    category?: string;
}

const ProductCardGroup: React.FC<ProductCardGroupProps> = ({
    columns = { base: 2, lg: 4 },
    gap = { base: 4, md: '25.5px' },
    skeletonCount = 8,
    skeletonHeight = { base: '134.73', md: '238px' },
    productsPerPage = parseInt(
        process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || '24'
    ),
    padding = { base: '1rem', md: '1rem' },
    preloadedCategoryData = null,
    category = null,
}) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const {
        selectedCategories,
        setSelectedCategories,
        range,
        rangeUpper,
        rangeLower,
        setRange,
        setRangeUpper,
        setRangeLower,
        hasHydrated,
        setHasHydrated,
        sortBy,
    } = useUnifiedFilterStore();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Component state
    const [offset, setOffset] = useState(0);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Refs for tracking state
    const isUpdatingUrl = useRef(false);
    const filtersRef = useRef({
        categories: [] as string[],
        upperRange: 0,
        lowerRange: 0,
        offset: 0,
    });

    // Memoized values
    const currentCurrency = preferred_currency_code ?? 'usdc';
    const isOnCategoryPage = pathname.includes('/category/');

    // Helper functions
    const getFormattedProductPrice = useCallback(
        (variant: any, currency: string) => {
            const productPricing =
                variant?.prices?.find(
                    (price: ProductPrice) => price.currency_code === currency
                )?.amount ||
                variant?.prices?.[0]?.amount ||
                0;

            return formatCryptoPrice(productPricing ?? 0, currency);
        },
        []
    );

    const sortProducts = useCallback(
        (products: Product[], sortType: string, currency: string): Product[] => {
            if (!products || products.length === 0) return [];

            const productsCopy = [...products];

            switch (sortType) {
                case 'price-low':
                    return productsCopy.sort((a, b) => {
                        const priceA = a.variants[0]?.prices?.find(
                            p => p.currency_code === currency
                        )?.amount || 0;
                        const priceB = b.variants[0]?.prices?.find(
                            p => p.currency_code === currency
                        )?.amount || 0;
                        return priceA - priceB;
                    });

                case 'price-high':
                    return productsCopy.sort((a, b) => {
                        const priceA = a.variants[0]?.prices?.find(
                            p => p.currency_code === currency
                        )?.amount || 0;
                        const priceB = b.variants[0]?.prices?.find(
                            p => p.currency_code === currency
                        )?.amount || 0;
                        return priceB - priceA;
                    });

                case 'newest':
                    return productsCopy.sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );

                case 'highest-rated':
                    return productsCopy.sort((a, b) => {
                        const avgRatingA = a.reviews?.length ?
                            a.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / a.reviews.length : 0;
                        const avgRatingB = b.reviews?.length ?
                            b.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / b.reviews.length : 0;
                        return avgRatingB - avgRatingA;
                    });

                case 'featured':
                default:
                    return productsCopy;
            }
        },
        []
    );

    const canUsePreloadedData = useCallback(() => {
        return offset === 0 &&
            preloadedCategoryData &&
            category &&
            (
                selectedCategories.includes(category) ||
                selectedCategories.includes('all') ||
                (selectedCategories.length === 1 &&
                    preloadedCategoryData.subcategories.some(subcat =>
                        subcat.handle.toLowerCase() === selectedCategories[0].toLowerCase()
                    ))
            );
    }, [offset, preloadedCategoryData, category, selectedCategories]);

    const getFilteredPreloadedProducts = useCallback(() => {
        if (!preloadedCategoryData) return [];

        let filteredProducts = preloadedCategoryData.products;

        // Filter by subcategory if needed
        if (selectedCategories.length === 1 &&
            !selectedCategories.includes('all') &&
            category && !selectedCategories.includes(category)) {

            const selectedSubcategory = selectedCategories[0];
            const subcategoryData = preloadedCategoryData.subcategories.find(
                subcat => subcat.handle.toLowerCase() === selectedSubcategory.toLowerCase()
            );

            if (subcategoryData && subcategoryData.products) {
                filteredProducts = subcategoryData.products;
            }
        }

        // Apply price filtering
        return filteredProducts.filter(product => {
            const variant = product.variants[0];
            if (!variant) return false;

            const rawPrice = variant.prices?.find(
                p => p.currency_code === currentCurrency
            )?.amount || 0;

            const formattedPrice = formatCryptoPrice(rawPrice, currentCurrency, false);
            const price = typeof formattedPrice === 'string' ?
                parseFloat(formattedPrice) : formattedPrice;

            return price >= rangeLower && price <= rangeUpper;
        });
    }, [preloadedCategoryData, selectedCategories, category, currentCurrency, rangeLower, rangeUpper]);

    // Initialize from URL parameters
    const initializeFromUrl = useCallback(() => {
        if (!hasHydrated || isInitialized) return;

        const offsetParam = searchParams.get('offset');
        const categoryParam = searchParams.get('category');
        const priceLow = searchParams.get('price_lo');
        const priceHigh = searchParams.get('price_hi');

        let newOffset = 0;
        let newCategories = selectedCategories;
        let newLowerRange = rangeLower;
        let newUpperRange = rangeUpper;

        if (offsetParam) {
            newOffset = parseInt(offsetParam, 10);
            setOffset(newOffset);
        }

        if (categoryParam) {
            newCategories = categoryParam
                .split(',')
                .map((cat) => cat.trim().toLowerCase());
            setSelectedCategories(newCategories);
        }

        if (priceLow) {
            newLowerRange = parseInt(priceLow, 10);
            setRangeLower(newLowerRange);
        }

        if (priceHigh) {
            newUpperRange = parseInt(priceHigh, 10);
            setRangeUpper(newUpperRange);
        }

        setRange([newLowerRange, newUpperRange]);

        filtersRef.current = {
            categories: [...newCategories],
            upperRange: newUpperRange,
            lowerRange: newLowerRange,
            offset: newOffset,
        };

        setIsInitialized(true);
    }, [
        hasHydrated,
        isInitialized,
        searchParams,
        selectedCategories,
        rangeLower,
        rangeUpper,
        setSelectedCategories,
        setRangeLower,
        setRangeUpper,
        setRange,
    ]);

    // Update URL with current state
    const updateUrl = useCallback(() => {
        if (isUpdatingUrl.current || isOnCategoryPage) return;

        isUpdatingUrl.current = true;

        try {
            const params = new URLSearchParams();
            params.set('offset', offset.toString());

            if (selectedCategories && selectedCategories.length > 0) {
                if (selectedCategories.includes('all') || selectedCategories[0] === 'all') {
                    params.set('category', 'all');
                } else {
                    params.set('category', selectedCategories.join(','));
                }
            }

            params.set('price_lo', rangeLower.toString());
            params.set('price_hi', rangeUpper.toString());

            const newUrl = `${pathname}?${params.toString()}`;
            router.replace(newUrl, { scroll: false });

            filtersRef.current = {
                categories: [...selectedCategories],
                upperRange: rangeUpper,
                lowerRange: rangeLower,
                offset: offset,
            };
        } catch (error) {
            console.error('Error updating URL:', error);
        } finally {
            isUpdatingUrl.current = false;
        }
    }, [offset, selectedCategories, rangeLower, rangeUpper, pathname, router, isOnCategoryPage]);

    // Check if filters have changed
    const filtersChanged = useMemo(() => {
        const categoriesChanged =
            JSON.stringify(filtersRef.current.categories) !== JSON.stringify(selectedCategories);
        const rangeChanged =
            filtersRef.current.upperRange !== rangeUpper ||
            filtersRef.current.lowerRange !== rangeLower;

        return categoriesChanged || rangeChanged;
    }, [selectedCategories, rangeUpper, rangeLower]);

    // Handle filter changes
    const handleFilterChange = useCallback(() => {
        if (!isInitialized) return;

        if (filtersChanged) {
            setOffset(0);
            setAllProducts([]);
            setHasMore(true);

            filtersRef.current = {
                categories: [...selectedCategories],
                upperRange: rangeUpper,
                lowerRange: rangeLower,
                offset: 0,
            };
        }
    }, [isInitialized, filtersChanged, selectedCategories, rangeUpper, rangeLower]);

    // Main product loading query
    const { data, error, isLoading, isFetching } = useQuery<ProductResponse>({
        queryKey: ['products', selectedCategories, rangeUpper, rangeLower, offset],
        queryFn: async () => {
            // Use preloaded data if available
            if (canUsePreloadedData()) {
                const filteredProducts = getFilteredPreloadedProducts();
                return {
                    products: filteredProducts,
                    count: filteredProducts.length
                };
            }

            console.log('query this api instead');
            // Otherwise, fetch from API
            return getAllProducts(
                selectedCategories,
                rangeUpper,
                rangeLower,
                currentCurrency,
                productsPerPage,
                offset
            );
        },
        staleTime: 60 * 1000,
        enabled: isInitialized,
        retry: 1,
    });

    // Sorted products
    const sortedProducts = useMemo(() => {
        if (!allProducts || allProducts.length === 0) return [];
        return sortProducts(allProducts, sortBy || 'featured', currentCurrency);
    }, [allProducts, sortBy, currentCurrency, sortProducts]);

    // Schema generation
    const generateItemListSchema = useCallback((products: Product[]) => {
        const categoryName = selectedCategories.length > 0
            ? selectedCategories.join(', ')
            : 'All Products';

        const currentPage = Math.floor(offset / productsPerPage) + 1;

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Displaying products for ${categoryName} - in ${currentCurrency.toUpperCase()} - Page ${currentPage}`,
            itemListElement: products.map((product, index) => ({
                '@type': 'ListItem',
                position: offset + index + 1,
                item: {
                    '@type': 'Product',
                    name: product.title,
                    image: product.thumbnail,
                    url: `${process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL}/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${product.handle}`,
                    offers: {
                        '@type': 'Offer',
                        price: getFormattedProductPrice(product.variants[0], currentCurrency),
                        priceCurrency: currentCurrency,
                        availability: product.variants[0]?.inventory_quantity > 0
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                    },
                },
            })),
        };

        return JSON.stringify(schema);
    }, [selectedCategories, offset, productsPerPage, currentCurrency, getFormattedProductPrice]);

    // Load more handler
    const handleLoadMore = useCallback(() => {
        if (!isFetching && hasMore) {
            setOffset(prev => prev + productsPerPage);
        }
    }, [isFetching, hasMore, productsPerPage]);

    // Effects
    useEffect(() => {
        if (!hasHydrated) {
            setHasHydrated(true);
        }
    }, [hasHydrated, setHasHydrated]);

    useEffect(() => {
        initializeFromUrl();
    }, [initializeFromUrl]);

    useEffect(() => {
        handleFilterChange();
    }, [handleFilterChange]);

    useEffect(() => {
        if (!isInitialized || !data?.products) return;

        if (offset === 0) {
            setAllProducts(data.products);
        } else {
            const currentProductIds = new Set(allProducts.map(p => p.id));
            const newProducts = data.products.filter(p => !currentProductIds.has(p.id));
            
            if (newProducts.length > 0) {
                setAllProducts(prev => [...prev, ...newProducts]);
            }
        }

        setHasMore(data.products.length === productsPerPage);
        updateUrl();
    }, [data, offset, isInitialized, allProducts, productsPerPage, updateUrl]);

    // Loading UI
    if (isLoading && offset === 0) {
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
                        Error loading products. Please try refreshing the page.
                    </Text>
                )}
            </Flex>
        );
    }

    return (
        <>
            {sortedProducts.length > 0 && (
                <Script
                    id="product-list-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: generateItemListSchema(sortedProducts),
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
                className="product-cards"
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
                    {sortedProducts.map((product) => {
                        try {
                            const variant = product.variants[0];
                            const formattedPrice = getFormattedProductPrice(
                                variant,
                                currentCurrency
                            );

                            const usdcFormattedPrice =
                                formatPriceBetweenCurrencies(
                                    variant?.prices,
                                    currentCurrency,
                                    'usdc'
                                );

                            const reviewCounter = product.reviews?.length || 0;
                            const totalRating = (product.reviews || []).reduce(
                                (acc: number, review: ProductReview) =>
                                    acc + (review?.rating || 0),
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
                                        productHandle={product.handle}
                                        variantID={variant?.id}
                                        countryCode={product.origin_country}
                                        productName={product.title}
                                        productPrice={formattedPrice}
                                        usdcProductPrice={usdcFormattedPrice}
                                        currencyCode={currentCurrency}
                                        imageSrc={product.thumbnail}
                                        hasDiscount={product.is_giftcard}
                                        discountValue={
                                            product.discountValue || ''
                                        }
                                        productId={product.id}
                                        inventory={variant?.inventory_quantity}
                                        allow_backorder={
                                            variant?.allow_backorder
                                        }
                                        storeId={product.store_id}
                                    />
                                </GridItem>
                            );
                        } catch (err) {
                            console.error('Error rendering product:', err);
                            return null;
                        }
                    })}
                </Grid>

                {/* No products message */}
                {sortedProducts.length === 0 && !isLoading && (
                        <Text textAlign="center" fontSize="lg" my={8} color="whiteAlpha.800">
                            No products found. Try adjusting your filters.
                        </Text>
                    )}

                {/* Load More Button */}
                {hasMore && sortedProducts.length > 0 && (
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

export default ProductCardGroup;
