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
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProductCard from '../product-card';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { Product, ProductPrice, ProductReview } from '@/types/global';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Props = {
    storeName: string;
    filterByRating?: string | null;
    productsPerPage?: number;
};

const ProductCardGroup = ({
    storeName,
    productsPerPage = parseInt(process.env.NEXT_PUBLIC_STORE_PRODUCTS_PER_PAGE || '8'),
}: Props) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const { selectedCategories, setSelectedCategories } = useUnifiedFilterStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State for pagination and products
    const [offset, setOffset] = useState(0);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingInitialBatches, setLoadingInitialBatches] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Track current filter state to detect changes
    const filterState = useRef({
        categories: [] as string[],
        currency: '',
        store: ''
    });

    // URL update helper function
    const updateUrl = (currentOffset: number) => {

        const isOnCategoryPage = pathname.includes('/category/');
        if (isOnCategoryPage) return;
        
        const params = new URLSearchParams(searchParams.toString());

        // Update offset
        params.set('offset', currentOffset.toString());

        // Update category filter
        if (selectedCategories && selectedCategories.length > 0) {
            if (selectedCategories.includes('all') || selectedCategories[0] === 'all') {
                params.set('category', 'all');
            } else {
                params.set('category', selectedCategories.join(','));
            }
        } else if (params.has('category')) {
            params.delete('category');
        }

        // Replace URL without full page refresh
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // API call helper functions
    const getProductsUrl = (storeNameParam: string, categoryParam: string, currencyCode: string, limit: number, offsetValue: number) => {
        return `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products/category-name?store_name=${storeNameParam}&category_name=${categoryParam}&currency_code=${currencyCode}&limit=${limit}&offset=${offsetValue}`;
    };

    // 1. Initialize from URL parameters (runs once)
    useEffect(() => {
        if (isInitialized) return;

        // Get offset from URL
        const offsetParam = searchParams.get('offset');
        if (offsetParam) {
            const parsedOffset = parseInt(offsetParam, 10);
            setOffset(parsedOffset);

            // If starting at non-zero offset, need to load previous batches
            if (parsedOffset > 0) {
                setLoadingInitialBatches(true);
            }
        }

        // Get category from URL
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            const categories = categoryParam.split(',').map(cat => cat.trim().toLowerCase());
            setSelectedCategories(categories);

            // Track initial categories for change detection
            filterState.current.categories = [...categories];
        } else {
            // Track current categories
            filterState.current.categories = [...selectedCategories];
        }

        // Track other filter state values
        filterState.current.currency = preferred_currency_code || 'usdc';
        filterState.current.store = storeName;

        setIsInitialized(true);
    }, [searchParams, isInitialized, setSelectedCategories, preferred_currency_code, storeName, selectedCategories]);

    // 2. Handle filter changes (reset pagination when filters change)
    useEffect(() => {
        // Skip during initialization
        if (!isInitialized || loadingInitialBatches) return;

        const prevState = filterState.current;
        const categoriesChanged = prevState.categories.join(',') !== selectedCategories.join(',');
        const currencyChanged = prevState.currency !== (preferred_currency_code || 'usdc');
        const storeChanged = prevState.store !== storeName;

        // Reset pagination if any filters changed
        if (categoriesChanged || currencyChanged || storeChanged) {
            setOffset(0);
            setAllProducts([]);
            setHasMore(true);

            // Update tracking refs with new values
            filterState.current = {
                categories: [...selectedCategories],
                currency: preferred_currency_code || 'usdc',
                store: storeName
            };

            // Update URL to reflect reset pagination
            updateUrl(0);
        }
    }, [selectedCategories, preferred_currency_code, storeName, isInitialized, loadingInitialBatches]);

    // Function to fetch initial batches (when URL has non-zero offset)
    const fetchInitialBatches = async () => {
        if (offset === 0 || !loadingInitialBatches) return [];

        const batchCount = Math.ceil(offset / productsPerPage);
        const batches = [];
        const categoryParam = selectedCategories.join(',');
        const currencyCode = preferred_currency_code || 'usdc';

        // Load all previous batches (0 to current offset)
        for (let i = 0; i < batchCount; i++) {
            const batchOffset = i * productsPerPage;
            try {
                const url = getProductsUrl(storeName, categoryParam, currencyCode, productsPerPage, batchOffset);
                const response = await axios.get(url);
                batches.push(response.data);
            } catch (error) {
                // Continue loading other batches even if one fails
            }
        }

        return batches;
    };

    // Function to fetch products for current offset
    const fetchProducts = async () => {
        const categoryParam = selectedCategories.join(',');
        const currencyCode = preferred_currency_code || 'usdc';

        try {
            const url = getProductsUrl(storeName, categoryParam, currencyCode, productsPerPage, offset);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return [];
        }
    };

    // Query for loading initial batches
    const { data: initialBatchesData, isLoading: isLoadingInitialBatches } = useQuery({
        queryKey: ['initialBatches', storeName, selectedCategories, offset],
        queryFn: fetchInitialBatches,
        enabled: loadingInitialBatches && !!storeName && isInitialized,
    });

    // Process initial batches when they load
    useEffect(() => {
        if (initialBatchesData && Array.isArray(initialBatchesData) && initialBatchesData.length > 0 && loadingInitialBatches) {
            // Flatten all batches into a single array of products
            const allInitialProducts = initialBatchesData.flatMap(batch =>
                Array.isArray(batch) ? batch : []
            );

            if (allInitialProducts.length > 0) {
                setAllProducts(allInitialProducts);
            }
            setLoadingInitialBatches(false);
        }
    }, [initialBatchesData, loadingInitialBatches]);

    // Main query for current offset
    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ['products', storeName, selectedCategories, offset, preferred_currency_code],
        queryFn: fetchProducts,
        enabled: !!storeName && !loadingInitialBatches && isInitialized,
    });

    // Update allProducts when new data is loaded
    useEffect(() => {
        if (!data || loadingInitialBatches || !isInitialized) return;

        // Make sure properly handle the data as an array
        const productsArray = Array.isArray(data) ? data : [];

        if (offset === 0) {
            setAllProducts(productsArray);
        } else {
            // Ensure don't duplicate products
            const currentProductIds = new Set(allProducts.map(p => p.id));
            const newProducts = productsArray.filter(p => !currentProductIds.has(p.id));

            if (newProducts.length > 0) {
                setAllProducts(prev => [...prev, ...newProducts]);
            }
        }

        // Check if have more products to load
        setHasMore(productsArray.length === productsPerPage);

        // Update URL with current pagination state
        updateUrl(offset);
    }, [data, offset, productsPerPage, allProducts, loadingInitialBatches, isInitialized]);

    // Load more products handler
    const handleLoadMore = () => {
        if (!isFetching) {
            setOffset(prev => prev + productsPerPage);
        }
    };

    // Loading UI
    if ((isLoading && offset === 0 && !loadingInitialBatches) || loadingInitialBatches || isLoadingInitialBatches) {
        return (
            <Flex
                maxW={'1280px'}
                width="100%"
                mx="auto"
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection="column"
            >
                {(loadingInitialBatches || isLoadingInitialBatches) && (
                    <Text mb={4} fontWeight="medium">Loading previous products...</Text>
                )}
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
            mb={'4rem'}
            maxW={'1280px'}
            width="100%"
            flexDir={'column'}
            mx="auto"
            justifyContent={'center'}
            alignItems={'center'}
            className="product-group-store"
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
                {allProducts.map((product, index) => {
                    try {
                        const variant = product.variants && product.variants.length > 0
                            ? product.variants[0]
                            : { prices: [], inventory_quantity: 0, allow_backorder: false, id: '0' };

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
                            (preferred_currency_code ?? 'usdc') as string,
                        );

                        const usdcFormattedPrice = formatPriceBetweenCurrencies(
                            variant?.prices,
                            preferred_currency_code ?? 'usdc',
                            'usdc',
                        );

                        // Safely handle reviews array
                        const reviews = product.reviews || [];
                        const reviewCounter = reviews.length;
                        const totalRating = reviews.reduce(
                            (acc: number, review: ProductReview) => acc + (review.rating || 0),
                            0,
                        );
                        const avgRating = reviewCounter
                            ? totalRating / reviewCounter
                            : 0;
                        const roundedAvgRating = parseFloat(avgRating.toFixed(2));

                        return (
                            <GridItem
                                key={product.id || `product-${index}`}
                                minHeight={'243.73px'}
                                height={{ base: '100%', md: '399px' }}
                                width="100%"
                            >
                                <ProductCard
                                    key={product.id || `product-${index}`}
                                    reviewCount={reviewCounter}
                                    totalRating={roundedAvgRating}
                                    productHandle={product.handle}
                                    variantID={variant?.id || '0'}
                                    countryCode={product.countryCode || ''}
                                    productName={product.title}
                                    productPrice={formattedPrice}
                                    usdcProductPrice={usdcFormattedPrice}
                                    currencyCode={preferred_currency_code ?? 'usdc'}
                                    imageSrc={product.thumbnail || ''}
                                    hasDiscount={product.is_giftcard || false}
                                    discountValue={product.discountValue || ''}
                                    productId={product.id || ''}
                                    inventory={variant?.inventory_quantity || 0}
                                    allow_backorder={variant?.allow_backorder || false}
                                    storeId={product.store_id || ''}
                                />
                            </GridItem>
                        );
                    } catch (err) {
                        return null;
                    }
                })}
            </Grid>

            {/* No products message */}
            {allProducts.length === 0 && !isLoading && !loadingInitialBatches && !isLoadingInitialBatches && (
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
