'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Text, Button, IconButton, Box } from '@chakra-ui/react';
import HeroImageCarousel from './components/hero-image-carousel';
import products from './productData';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link'; // Import Next.js Link for better SPA navigation
import getQueryClient from '@/app/getQueryClient';
import { getProductCollection } from '@/lib/data';
import { useQuery } from '@tanstack/react-query';

const HeroSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };

    const { data, error, isLoading } = useQuery(
        ['productCollection'],
        () => getProductCollection(),
        {
            staleTime: 60 * 1000,
            cacheTime: 2 * 60 * 1000,
        }
    );

    console.log('product data', data.product.description);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [currentIndex]); // Restart the interval when currentIndex changes

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
            {/* Previous Button */}
            <IconButton
                icon={<ArrowBackIcon />}
                aria-label="Previous"
                position="absolute"
                left="-50px"
                top="50%"
                transform="translateY(-50%)"
                onClick={handlePrev}
                bg="#242424"
                color="white"
                _hover={{ bg: '#2D2D2D' }}
                borderRadius="50%"
                boxSize="50px"
            />

            {/* Left Section */}
            <Flex width="50%" flexDir="column" gap={4}>
                <Text color="white" fontSize="56px" lineHeight={1.2}>
                    The World's first{' '}
                    <Text as="span" color="primary.green.900">
                        decentralized commerce
                    </Text>{' '}
                    marketplace
                </Text>
                <Text fontSize="24px" color="white" maxW="520px">
                    Discover the world’s first decentralized commerce
                    marketplace. Buy and sell directly, securely, and without
                    intermediaries, powered by blockchain. Join us in
                    revolutionizing digital trade.
                </Text>
                <Flex flexDir="row" gap={4} mt="2rem">
                    <Link href="/shop" passHref>
                        <Button
                            backgroundColor={'transparent'}
                            borderColor={'primary.green.900'}
                            borderWidth={2}
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
                        _hover={{ opacity: 0.5 }}
                    >
                        Sell on Hamza
                    </Button>
                </Flex>
            </Flex>

            {/* Right Section */}
            <Flex
                width="50%"
                position="relative"
                justifyContent="center"
                alignItems="center"
            >
                <HeroImageCarousel
                    productData={data}
                    imgSrc={data.product.thumbnail}
                    categoryTitle={data.product.title}
                    description={data.product.description}
                    price={products[currentIndex].price}
                />
            </Flex>

            {/* Next Button */}
            <IconButton
                icon={<ArrowForwardIcon />}
                aria-label="Next"
                position="absolute"
                right="-50px"
                top="50%"
                transform="translateY(-50%)"
                onClick={handleNext}
                bg="#242424"
                color="white"
                _hover={{ bg: '#2D2D2D' }}
                borderRadius="50%"
                boxSize="50px"
            />

            {/* Carousel Indicators */}
            <Flex
                position="absolute"
                bottom="20px"
                left="50%"
                transform="translateX(-50%)"
                gap={2}
            >
                {products.map((_, index) => (
                    <Box
                        key={index}
                        width="20px"
                        height="20px"
                        borderRadius="50%"
                        border={`2px solid #676767`}
                        bg={currentIndex === index ? '#94D42A' : 'transparent'}
                        transition="background-color 0.3s"
                    />
                ))}
            </Flex>
        </Flex>
    );
};

export default HeroSlider;
