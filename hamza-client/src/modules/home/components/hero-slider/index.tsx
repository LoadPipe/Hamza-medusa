'use client';

import React, { useState } from 'react';
import { Flex, Text, Button, IconButton, Box } from '@chakra-ui/react';
import HeroImageCarousel from './components/hero-image-carousel';
import products from './productData';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';

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
                    <Button rounded="full">Start Shopping</Button>
                    <Button rounded="full">Sell on Hamza</Button>
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
                    imgSrc={products[currentIndex].imgSrc}
                    categoryTitle={products[currentIndex].categoryTitle}
                    description={products[currentIndex].description}
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
