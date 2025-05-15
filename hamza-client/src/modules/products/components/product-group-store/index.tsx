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
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProductCard from '../product-card';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { formatPriceBetweenCurrencies } from '@/lib/util/prices';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { Product, ProductPrice, ProductReview } from '@/types/global';

type Props = {
    storeName: string;
    filterByRating?: string | null;
    productsPerPage?: number;
};

const ProductCardGroup = ({
    storeName,
    productsPerPage = 8,
}: Props) => {
    // get preferred currency
    const { preferred_currency_code } = useCustomerAuthStore();
    const { selectedCategories } = useUnifiedFilterStore();

    // State for pagination
    const [offset, setOffset] = useState(0);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);

    // Store references to previous values to avoid unnecessary resets
    const prevFiltersRef = React.useRef({
        categories: selectedCategories,
        currency: preferred_currency_code,
        store: storeName
    });

    // Reset pagination only when filters actually change
    useEffect(() => {
        const prevFilters = prevFiltersRef.current;
        const categoriesChanged =
            prevFilters.categories.join(',') !== selectedCategories.join(',');
        const storeChanged = prevFilters.store !== storeName;

        // Only reset if something actually changed
        if (categoriesChanged || storeChanged) {
            console.log('Filters actually changed - resetting pagination state');
            setOffset(0);
            setAllProducts([]);
            setHasMore(true);

            // Update refs with new values
            prevFiltersRef.current = {
                categories: selectedCategories,
                currency: preferred_currency_code,
                store: storeName
            };
        }
    }, [selectedCategories, preferred_currency_code, storeName]);

    const categoryParam = selectedCategories.join(',');

    const fetchProducts = async () => {
        const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products/category-name?store_name=${storeName}&category_name=${categoryParam}&currency_code=${preferred_currency_code ?? 'usdc'}&limit=${productsPerPage}&offset=${offset}`;

        console.log('Fetching data from URL:', url);
        try {
            const response = await axios.get(url);
            console.log('Data fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ['products', storeName, selectedCategories, offset],
        queryFn: fetchProducts,
        enabled: !!storeName,
    });

    // Update allProducts when new data is loaded
    useEffect(() => {
        console.log('Data changed. Data:', data);

        if (data) {
            console.log('Processing data. Current allProducts length:', allProducts.length);
            // Make sure we properly handle the data as an array
            const productsArray = Array.isArray(data) ? data : [];
            console.log('Products array length:', productsArray.length);

            if (offset === 0) {
                console.log('Setting initial products');
                setAllProducts(productsArray);
            } else {
                console.log('Appending products, current count:', allProducts.length);
                setAllProducts(prev => [...prev, ...productsArray]);
            }

            // Check if we have more products to load
            setHasMore(productsArray.length === productsPerPage);
            console.log('Setting hasMore to:', productsArray.length === productsPerPage);
        }
    }, [data, offset, productsPerPage]);

    // Log if there's an error
    if (error) {
        console.error('Error fetching data:', error);
    }


    if (isLoading && offset === 0) {
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
                                key={index}
                                //   maxW={'295px'}
                                minHeight={'243.73px'}
                                height={{ base: '100%', md: '399px' }}
                                width="100%"
                            >
                                <ProductCard
                                    key={index}
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
                        console.error(`Error rendering product at index ${index}:`, err);
                        return null;
                    }
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

    function handleLoadMore() {
        console.log('Loading more products...');
        setOffset(prev => prev + productsPerPage);
    }
};

export default ProductCardGroup;
