'use client';

import React, { useEffect, useState, useRef } from 'react';
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

interface ProductResponse {
    products: Product[];
    count: number;
}

const ProductCardGroup = ({
    columns = { base: 2, lg: 4 },
    gap = { base: 4, md: '25.5px' },
    skeletonCount = 8,
    skeletonHeight = { base: '134.73', md: '238px' },
    productsPerPage = parseInt(
        process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || '24'
    ),
    padding = { base: '1rem', md: '1rem' },
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
    } = useUnifiedFilterStore();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Component state
    const [offset, setOffset] = useState(0);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isUrlInitialized, setIsUrlInitialized] = useState(false);
    const [loadingInitialBatches, setLoadingInitialBatches] = useState(false);

    // Refs for tracking state without triggering re-renders
    const isUpdatingUrl = useRef(false);
    const currentFilters = useRef({
        categories: [] as string[],
        upperRange: 0,
        lowerRange: 0,
        offset: 0,
    });

    // Make sure store is hydrated
    useEffect(() => {
        if (!hasHydrated) {
            setHasHydrated(true);
        }
    }, [hasHydrated, setHasHydrated]);

    // Load initial batches if starting with non-zero offset
    const { data: initialBatchesData, isLoading: isLoadingInitialBatches } =
        useQuery({
            queryKey: [
                'initialBatches',
                selectedCategories,
                rangeUpper,
                rangeLower,
                offset,
            ],
            queryFn: async () => {
                if (offset === 0 || !loadingInitialBatches)
                    return [] as ProductResponse[];

                const batchCount = Math.ceil(offset / productsPerPage);
                const batches: ProductResponse[] = [];

                for (let i = 0; i < batchCount; i++) {
                    const batchOffset = i * productsPerPage;
                    const response = await getAllProducts(
                        selectedCategories,
                        rangeUpper,
                        rangeLower,
                        preferred_currency_code ?? 'usdc',
                        productsPerPage,
                        batchOffset
                    );
                    batches.push(response);
                }

                return batches;
            },
            enabled: loadingInitialBatches && isUrlInitialized,
        });

    // Main product loading query
    const { data, error, isLoading, isFetching } = useQuery<ProductResponse>({
        queryKey: [
            'products',
            selectedCategories,
            rangeUpper,
            rangeLower,
            offset,
        ],
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
        enabled: !loadingInitialBatches && isUrlInitialized,
        retry: 1,
    });

    // 1. Initialize state from URL parameters (runs once)
    useEffect(() => {
        if (!hasHydrated) return;

        // Skip if already initialized
        if (isUrlInitialized) return;

        // Get parameters from URL
        const offsetParam = searchParams.get('offset');
        const categoryParam = searchParams.get('category');
        const priceLow = searchParams.get('price_lo');
        const priceHigh = searchParams.get('price_hi');

        // Set initial filter values
        let newOffset = 0;
        let newCategories = selectedCategories;
        let newLowerRange = rangeLower;
        let newUpperRange = rangeUpper;

        // Apply offset if present
        if (offsetParam) {
            newOffset = parseInt(offsetParam, 10);
            setOffset(newOffset);

            // If non-zero offset, we'll need to load previous batches
            if (newOffset > 0) {
                setLoadingInitialBatches(true);
            }
        }

        // Apply categories if present
        if (categoryParam) {
            newCategories = categoryParam
                .split(',')
                .map((cat) => cat.trim().toLowerCase());
            setSelectedCategories(newCategories);
        }

        // Apply price filters if present
        if (priceLow) {
            newLowerRange = parseInt(priceLow, 10);
            setRangeLower(newLowerRange);
        }

        if (priceHigh) {
            newUpperRange = parseInt(priceHigh, 10);
            setRangeUpper(newUpperRange);
        }

        // Update range array for consistency
        setRange([newLowerRange, newUpperRange]);

        // Store current filter values for comparison
        currentFilters.current = {
            categories: [...newCategories],
            upperRange: newUpperRange,
            lowerRange: newLowerRange,
            offset: newOffset,
        };

        // Mark as initialized
        setIsUrlInitialized(true);
    }, [
        hasHydrated,
        searchParams,
        isUrlInitialized,
        selectedCategories,
        rangeLower,
        rangeUpper,
        setSelectedCategories,
        setRangeLower,
        setRangeUpper,
        setRange,
    ]);

    // 2. Handle initial batches loading
    useEffect(() => {
        if (
            !initialBatchesData ||
            !Array.isArray(initialBatchesData) ||
            initialBatchesData.length === 0 ||
            !loadingInitialBatches
        ) {
            return;
        }

        try {
            // Combine all products from all batches
            const allInitialProducts = initialBatchesData.flatMap(
                (batch: ProductResponse) => batch.products || []
            );

            setAllProducts(allInitialProducts);
        } catch (error) {
            console.error('Error processing initial batches:', error);
        } finally {
            setLoadingInitialBatches(false);
        }
    }, [initialBatchesData, loadingInitialBatches]);

    // 3. Update products when new data is loaded or filters change
    useEffect(() => {
        // Skip during initial loading
        if (
            !isUrlInitialized ||
            loadingInitialBatches ||
            isLoadingInitialBatches
        )
            return;

        // Process new data when it arrives
        if (data?.products) {
            if (offset === 0) {
                // When offset is 0, replace all products
                setAllProducts(data.products);
            } else {
                // When loading more, append only new products
                const currentProductIds = new Set(allProducts.map((p) => p.id));
                const newProducts = data.products.filter(
                    (p) => !currentProductIds.has(p.id)
                );

                if (newProducts.length > 0) {
                    setAllProducts((prev) => [...prev, ...newProducts]);
                }
            }

            // Update hasMore flag
            setHasMore(data.products.length === productsPerPage);

            // Update URL with current state
            updateUrlWithCurrentState();
        }
    }, [
        data,
        offset,
        isUrlInitialized,
        loadingInitialBatches,
        isLoadingInitialBatches,
        allProducts,
        productsPerPage,
    ]);

    // 4. Handle filter changes
    useEffect(() => {
        // Skip during initial loading or if filters haven't been initialized
        if (
            !isUrlInitialized ||
            loadingInitialBatches ||
            isLoadingInitialBatches
        ) {
            return;
        }

        // Check if filters have changed from their previously tracked values
        const categoriesChanged =
            JSON.stringify(currentFilters.current.categories) !==
            JSON.stringify(selectedCategories);

        const rangeChanged =
            currentFilters.current.upperRange !== rangeUpper ||
            currentFilters.current.lowerRange !== rangeLower;

        // Only reset pagination if filters have changed
        if (categoriesChanged || rangeChanged) {
            setOffset(0);
            setAllProducts([]);
            setHasMore(true);

            // Update tracked values
            currentFilters.current = {
                categories: [...selectedCategories],
                upperRange: rangeUpper,
                lowerRange: rangeLower,
                offset: 0,
            };
        }
    }, [
        selectedCategories,
        rangeUpper,
        rangeLower,
        isUrlInitialized,
        loadingInitialBatches,
        isLoadingInitialBatches,
    ]);

    // Helper function to update URL with current state
    const updateUrlWithCurrentState = () => {
        if (isUpdatingUrl.current) return;

        const isOnCategoryPage = pathname.includes('/category/');
        if (isOnCategoryPage) return;

        isUpdatingUrl.current = true;

        try {
            if (!router || typeof router.replace !== 'function') {
                console.error('Router not available for URL update');
                return;
            }

            // Create URL params from current state
            const params = new URLSearchParams();

            // Add offset
            params.set('offset', offset.toString());

            // Add categories
            if (selectedCategories && selectedCategories.length > 0) {
                if (
                    selectedCategories.includes('all') ||
                    selectedCategories[0] === 'all'
                ) {
                    params.set('category', 'all');
                } else {
                    params.set('category', selectedCategories.join(','));
                }
            }

            // Add price range
            params.set('price_lo', rangeLower.toString());
            params.set('price_hi', rangeUpper.toString());

            // Update URL without page refresh
            const newUrl = `${pathname}?${params.toString()}`;
            router.replace(newUrl, { scroll: false });

            // Update current filters for future comparison
            currentFilters.current = {
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
    };

    // Load more products handler
    const handleLoadMore = () => {
        if (!isFetching) {
            setOffset(offset + productsPerPage);
        }
    };

    // Loading UI
    if (
        (isLoading && offset === 0 && !loadingInitialBatches) ||
        loadingInitialBatches ||
        isLoadingInitialBatches
    ) {
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
                {(loadingInitialBatches || isLoadingInitialBatches) && (
                    <Text mb={4} fontWeight="medium">
                        Loading previous products...
                    </Text>
                )}
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
                {allProducts.map((product) => {
                    try {
                        const variant = product.variants[0];
                        const productPricing =
                            variant?.prices?.find(
                                (price: ProductPrice) =>
                                    price.currency_code ===
                                    (preferred_currency_code ?? 'usdc')
                            )?.amount ||
                            variant?.prices?.[0]?.amount ||
                            0;

                        const formattedPrice = formatCryptoPrice(
                            productPricing ?? 0,
                            preferred_currency_code as string
                        );

                        const usdcFormattedPrice = formatPriceBetweenCurrencies(
                            variant?.prices,
                            preferred_currency_code ?? 'usdc',
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
                                    currencyCode={
                                        preferred_currency_code || 'usdc'
                                    }
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
                    } catch (err) {
                        console.error('Error rendering product:', err);
                        return null;
                    }
                })}
            </Grid>

            {/* No products message */}
            {allProducts.length === 0 &&
                !isLoading &&
                !loadingInitialBatches &&
                !isLoadingInitialBatches && (
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
                            bg: isFetching
                                ? 'transparent'
                                : 'rgba(0, 128, 0, 0.05)',
                            transform: isFetching ? 'none' : 'translateY(-2px)',
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
    );
};

export default ProductCardGroup;
