'use client';

import React, { useState, useEffect } from 'react';
import {
    Flex,
    Text,
    Button,
    Box,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react';
import HeroImageCarousel from './components/hero-image-carousel';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProductCollection } from '@/lib/data';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import HeroBGImage from '@/images/home/hero_bg_image.webp';
import { motion } from 'framer-motion';

const HeroSlider: React.FC = () => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch product collection using react-query
    const { data, error, isLoading } = useQuery(
        ['productCollection'],
        () => getProductCollection(),
        {
            staleTime: 60 * 1000,
            cacheTime: 2 * 60 * 1000,
        }
    );

    // Automatic carousel timer
    useEffect(() => {
        const timer = setInterval(() => {
            if (data?.products?.length) {
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % data.products.length
                );
            }
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [data?.products?.length]);

    if (isLoading) {
        return (
            <Flex
                maxW="1280px"
                height="685px"
                justifyContent="space-between"
                flexDir="row"
                px="50px"
                py="62px"
                mx="auto"
                position="relative"
            >
                {/* Skeleton for Left Section */}
                <Flex width="50%" flexDir="column" gap={4}>
                    <Skeleton height="60px" width="80%" />
                    <Skeleton height="24px" width="90%" />
                    <SkeletonText
                        mt="4"
                        noOfLines={3}
                        spacing="4"
                        skeletonHeight="24px"
                    />
                    <Flex flexDir="row" gap={4} mt="2rem">
                        <Skeleton
                            height="48px"
                            width="150px"
                            borderRadius="full"
                        />
                        <Skeleton
                            height="48px"
                            width="150px"
                            borderRadius="full"
                        />
                    </Flex>
                </Flex>

                {/* Skeleton for Right Section */}
                <Flex
                    width="50%"
                    position="relative"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Skeleton height="400px" width="400px" borderRadius="lg" />
                </Flex>
            </Flex>
        );
    }

    if (error) {
        return <Text color="red.500">Error loading products.</Text>;
    }

    const currentProduct = data?.products?.[currentIndex];

    const variantPrices = currentProduct?.variants
        .map((variant: any) => variant.prices)
        .flat();

    const productPricing = formatCryptoPrice(
        variantPrices?.find(
            (p: any) => p.currency_code === preferred_currency_code
        )?.amount || 0,
        preferred_currency_code as string
    );

    return (
        <Flex
            maxW="1280px"
            height={{ base: '354px', md: '685px' }}
            justifyContent="space-between"
            flexDir="row"
            px={{ base: '1rem', md: '50px' }}
            py="62px"
            mx="auto"
            position="relative"
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            borderRadius={'24px'}
        >
            {/* Left Section */}
            <Flex
                width={{ base: '100%', md: '50%' }}
                flexDir="column"
                mt="4rem"
                gap={5}
            >
                <Text
                    textAlign={{ base: 'center', md: 'unset' }}
                    color="white"
                    fontSize={{ base: '24px', md: '56px' }}
                    lineHeight={1}
                >
                    The World's 1st{' '}
                    <Text as="span" color="primary.green.900">
                        Decentralized
                    </Text>
                    {'  '}
                    E-commerce
                </Text>
                <Text
                    textAlign={{ base: 'center', md: 'unset' }}
                    fontSize={{ base: '12px', md: '24px' }}
                    color="white"
                    lineHeight={1.6}
                    maxW={{ base: '100%', md: '520px' }}
                >
                    Discover the world’s first decentralized commerce
                    marketplace. Buy and sell directly, securely, powered by
                    blockchain.
                </Text>
                {/* <Flex
                    flexDir="row"
                    justifyContent={{ base: 'center', md: 'unset' }}
                    gap={4}
                    mt={{ base: '1rem', md: '2rem' }}
                >
                    <Link href="/shop" passHref>
                        <Button
                            backgroundColor={'transparent'}
                            borderColor={'primary.green.900'}
                            borderWidth={2}
                            height={{ base: '41px', md: '44px' }}
                            fontSize={{ base: '12px', md: '16px' }}
                            color={'primary.green.900'}
                            _hover={{ opacity: 0.5 }}
                            rounded="full"
                        >
                            Start Shopping
                        </Button>
                    </Link>
                    <Button
                        backgroundColor={'primary.green.900'}
                        rounded="full"
                        height={{ base: '41px', md: '44px' }}
                        fontSize={{ base: '12px', md: '16px' }}
                        _hover={{ opacity: 0.5 }}
                    >
                        Sell on Hamza
                    </Button>
                </Flex> */}
            </Flex>

            {/* Right Section */}
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
                            currencyCode={
                                currentProduct.variants?.[0]?.prices?.[0]
                                    ?.currency_code
                            }
                            imgSrc={currentProduct.thumbnail || ''}
                            categoryTitle={
                                currentProduct.title || 'Unknown Title'
                            }
                            description={
                                currentProduct.description ||
                                'No description available'
                            }
                            price={productPricing}
                        />
                    </motion.div>
                )}
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    position="absolute"
                    bottom="80px"
                    left="50%"
                    transform="translateX(-50%)"
                    gap={3}
                >
                    {data?.products?.map((_: any, index: number) => (
                        <Box
                            key={index}
                            width="15px"
                            height="15px"
                            borderRadius="50%"
                            border={`2px solid #676767`}
                            bg={
                                currentIndex === index
                                    ? '#94D42A'
                                    : 'transparent'
                            }
                            transition="background-color 0.3s"
                        />
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default HeroSlider;
