'use client';

import React from 'react';
import { Flex, Text, Box, Image as ChakraImage } from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Use the correct hook for navigation

interface HeroImageCarouselProps {
    imgSrc: string;
    categoryTitle: string;
    description: string;
    price: string | number;
    productHandle: string;
    currencyCode: string;
}

const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({
    imgSrc,
    categoryTitle,
    description,
    price,
    productHandle,
    currencyCode,
}) => {
    const router = useRouter(); // Initialize router instance

    const handleClick = () => {
        router.push(`/products/${productHandle}`);
    };

    const { preferred_currency_code } = useCustomerAuthStore();

    return (
        <Flex width="100%" flexDir="column" alignSelf="center" gap={4} p={4}>
            {/* Featured Product Title */}
            <Flex flexDir="row" gap={2}>
                <Text color="white">Featured Product:</Text>
                <Text
                    color="primary.green.900"
                    onClick={handleClick}
                    cursor="pointer"
                    fontWeight="bold"
                >
                    {categoryTitle}
                </Text>
            </Flex>

            {/* Image and Content */}
            <Flex
                borderRadius="16px"
                maxWidth="100%"
                bgColor="#121212"
                overflow="hidden"
                flexDir={{ base: 'column', md: 'row' }} // Stack on small screens
                alignItems="stretch"
            >
                {/* Image */}
                <ChakraImage
                    src={imgSrc}
                    alt={categoryTitle}
                    flexShrink={0} // Prevent the image from shrinking unnaturally
                    objectFit="cover" // Ensure the image fills the container while maintaining proportions
                    height={{ base: '200px', md: '295px' }} // Consistent height across images
                    width={{ base: '100%', md: 'auto' }} // Shrinks width as needed
                    maxWidth={{ md: '295px' }} // Limit width to maintain balance
                    bgColor="transparent"
                    borderLeftRadius={{ md: '16px' }} // Apply border radius on larger screens
                    cursor="pointer"
                    onClick={handleClick}
                />

                {/* Content */}
                <Flex
                    flex="1"
                    flexDir="column"
                    p={4}
                    gap={3}
                    justifyContent="center"
                >
                    {/* Description */}
                    <Text color="white" noOfLines={4}>
                        {description}
                    </Text>

                    {/* Price */}
                    <Flex flexDir="row" alignItems="center" gap={2}>
                        <Image
                            className="h-[18px] w-[18px] md:h-[20px] md:w-[20px]"
                            src={
                                currencyIcons[preferred_currency_code ?? 'usdc']
                            }
                            alt={preferred_currency_code ?? 'usdc'}
                        />
                        <Text color="white" fontSize="20px" fontWeight="bold">
                            {price}
                        </Text>
                    </Flex>

                    {/* Category Tag */}
                    <Box
                        bgColor="#272727"
                        borderRadius="full"
                        px={3}
                        py={1}
                        mt={2}
                        display="inline-block"
                        maxWidth="fit-content"
                    >
                        <Text color="white" fontSize="12px">
                            {categoryTitle}
                        </Text>
                    </Box>
                </Flex>
            </Flex>

            {/* Sale Text */}
            <Text color="white" fontStyle="italic">
                The product is on sale. Buy now and grab a great discount!
            </Text>
        </Flex>
    );
};

export default HeroImageCarousel;
