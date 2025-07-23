'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Text, Box, Skeleton, SkeletonText } from '@chakra-ui/react';
import HeroImageCarousel from '../../../home/components/hero-slider/components/hero-image-carousel';
import { useQuery } from '@tanstack/react-query';
import { getHeroProductByCategory, getProductCollection } from '@/lib/server';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { motion } from 'framer-motion';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import bitcoinIcon from '@/images/icon/bitcoin.png';
import safeIcon from '@/images/icon/safe.png';

type CategoryHeroProps = {
    category: string;
};

const currencies = ['usdc', 'usdt', 'eth', 'btc'];

const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Fetch hero products for the category
    const { data: categoryData, isLoading: isCategoryLoading, isError: isCategoryError } = useQuery({
        queryKey: ['hero-products', category],
        queryFn: () => getHeroProductByCategory(category),
        staleTime: 60 * 1000,
    });

    // Fetch generic (home) hero products as fallback
    const { data: fallbackData, isLoading: isFallbackLoading } = useQuery({
        queryKey: ['productCollection'],
        queryFn: () => getProductCollection(),
        enabled: isCategoryError || !categoryData?.products?.length, 
        staleTime: 60 * 1000,
    });

    // Decide which data to show
    const products = categoryData?.products?.length
        ? categoryData.products
        : fallbackData?.products || [];

    // Reset index when products change
    useEffect(() => {
        if (!products.length) {
            setIsPaused(false);
            return;
        }
        setCurrentIndex(0);
    }, [products.length]);

    // Auto-rotation with pause functionality
    useEffect(() => {
        if (!products.length || isPaused) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [products.length, isPaused]);

    // Loading state (show skeleton)
    if (isCategoryLoading || (isFallbackLoading && !products.length)) {
        return (
            <Flex
                mt={{ base: '0', md: '0' }}
                mb={{ base: '2rem', md: '-4rem' }}
                maxW="1280px"
                height={{ base: 'auto', md: '625px' }}
                minHeight={{ base: '280px', md: '625px' }}
                justifyContent="space-between"
                flexDir="row"
                px={{ base: '1rem', md: '50px' }}
                py={{ base: '1rem', md: '62px' }}
                mx="auto"
                position="relative"
                borderRadius="24px"
            >
                <Flex width={{ base: '100%', md: '50%' }} flexDir="column" mt={{ base: '1rem', md: '4rem' }} gap={5}>
                    <Skeleton height={{ base: '24px', md: '56px' }} width="80%" />
                    <Skeleton height={{ base: '12px', md: '24px' }} width="90%" />
                    <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight={{ base: '12px', md: '20px' }} />
                </Flex>
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    width="50%"
                    position="relative"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Skeleton height={{ base: '200px', md: '295px' }} width={{ base: '100%', md: '50%' }} borderRadius="16px" />
                </Flex>
            </Flex>
        );
    }

    // No products anywhere
    if (!products.length) {
        return (
            <Text color="red.500" textAlign="center" py="2rem">
                No products found in this category yet.
            </Text>
        );
    }

    const currentProduct = products[currentIndex];
    const variantPrices = currentProduct?.variants.map((variant: any) => variant.prices).flat();

    const productPricing = formatCryptoPrice(
        variantPrices?.find((p: any) => p.currency_code === (preferred_currency_code ?? 'usdc'))?.amount || 0,
        (preferred_currency_code ?? 'usdc') as string
    );

    const usdPricing = formatCryptoPrice(
        variantPrices?.find((p: any) => p.currency_code === 'usdc')?.amount || 0,
        'usdc'
    );

    const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <Flex
            maxW="1280px"
            height={{ base: 'auto', md: '625px' }}
            minHeight={{ base: '320px', md: '625px' }}
            mt={{ base: '0', md: '0' }}
            mb={{ base: '2rem', md: '-4rem' }}
            justifyContent="space-between"
            flexDir="row"
            px={{ base: '1rem', md: '20px' }}
            py={{ base: '1.5rem', md: '62px' }}
            pt={{ base: '1rem', md: '0' }}
            mx="auto"
            position="relative"
            borderRadius={'24px'}
        >
            {/* Left Section */}
            <Flex
                width={{ base: '100%', md: '40%' }}
                flexDir="column"
                mt={{ base: '0', md: '4.15rem' }}
                gap={{ base: 4, md: 6 }}
                justifyContent={{ base: 'flex-start', md: 'unset' }}
            >
                <Text
                    textAlign={{ base: 'center', md: 'unset' }}
                    color="white"
                    fontSize={{ base: '20px', md: '56px' }}
                    lineHeight={{ base: '1.3', md: '1' }}
                >
                    Buy{' '}
                    <Text as="span" color="primary.green.900">
                        {formattedCategory}{' '}
                    </Text>
                    With Crypto Online{' '}
                    <Box
                        as="span"
                        display="inline-flex"
                        gap="1"
                        alignItems="center"
                        flexWrap="wrap"
                        justifyContent={{ base: 'center', md: 'flex-start' }}
                    >
                        {currencies.map((code) => (
                            <Box
                                key={code}
                                display="inline-block"
                                width={{ base: '14px', md: '28px' }}
                                height={{ base: '14px', md: '28px' }}
                                position="relative"
                                ml={{ base: '2px', md: '8px' }}
                            >
                                <Image
                                    src={currencyIcons[code]}
                                    alt={code.toUpperCase()}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Text>
                <Text
                    textAlign={{ base: 'center', md: 'unset' }}
                    fontSize={{ base: '14px', md: '24px' }}
                    color="white"
                    lineHeight={1.6}
                    maxW={{ base: '100%', md: '520px' }}
                    px={{ base: '0.5rem', md: '0' }}
                >
                    Discover the world's first decentralized commerce marketplace. Buy and sell directly, securely, powered by blockchain.
                </Text>
                <Box
                    color="whiteAlpha.800"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    mt={{ base: 2, md: 4 }}
                    px={{ base: '0.5rem', md: '0' }}
                >
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Image src={safeIcon} alt="Safe" width={16} height={16} />
                        <Box as="span">
                            Shop Private & Secure with{' '}
                            <Text as="span" textDecoration="underline">
                                Escrow
                            </Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Image src={bitcoinIcon} alt="Bitcoin" width={16} height={16} />
                        <Box as="span">Get Crypto Rewards & Ownership</Box>
                    </Box>
                </Box>
            </Flex>

            {/* Right Section*/}
            <Flex
                display={{ base: 'none', md: 'flex' }}
                width="50%"
                position="relative"
                justifyContent="center"
            >
                {currentProduct && (
                    <motion.div
                        key={currentProduct.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        style={{ width: '100%' }}
                    >
                        <HeroImageCarousel
                            productHandle={currentProduct.handle}
                            currencyCode={currentProduct.variants?.[0]?.prices?.[0]?.currency_code}
                            imgSrc={currentProduct.thumbnail || ''}
                            categoryTitle={currentProduct.title || 'Unknown Title'}
                            description={currentProduct.description || 'No description available'}
                            price={productPricing}
                            usdPrice={usdPricing}
                        />
                    </motion.div>
                )}
                {/* Dots */}
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    position="absolute"
                    bottom="50px"
                    left="50%"
                    transform="translateX(-50%)"
                    gap={3}
                >
                    {products.map((_: any, index: number) => (
                        <Box
                            key={index}
                            width="15px"
                            height="15px"
                            borderRadius="50%"
                            border={`2px solid #676767`}
                            bg={currentIndex === index ? '#94D42A' : 'transparent'}
                            transition="background-color 0.3s"
                            onClick={() => {
                                if (!products.length) return;
                                setCurrentIndex(index);
                                setIsPaused(true);
                                setTimeout(() => setIsPaused(false), 3000);
                            }}
                            cursor="pointer"
                        />
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CategoryHero;
