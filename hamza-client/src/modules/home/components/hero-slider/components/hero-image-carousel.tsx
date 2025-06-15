'use client';

import React, { useMemo } from 'react';
import { Flex, Text, Box, Image as ChakraImage } from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify'; // Use the correct hook for navigation
import { currencyIsUsdStable } from '@/lib/util/currencies';

interface HeroImageCarouselProps {
    imgSrc: string;
    categoryTitle: string;
    description: string;
    price: string | number;
    usdPrice: string | number;
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
    usdPrice,
}) => {
    const router = useRouter(); // Initialize router instance

    const handleClick = () => {
        router.push(`/products/${productHandle}`);
    };

    const { preferred_currency_code } = useCustomerAuthStore();

    // Function to check if a string contains HTML tags
    const isHTML = (str: string): boolean => {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return Array.from(doc.body.childNodes).some(
            (node) => node.nodeType === 1
        ); // Node type 1 = Element
    };

    // Function to extract the first <p> element's content from the description HTML
    const extractFirstParagraph = (htmlContent: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const firstParagraph = doc.querySelector('p');
        return firstParagraph ? firstParagraph.innerHTML : '';
    };

    // Compute the sanitized description at the top level using useMemo
    const sanitizedDescription = useMemo(() => {
        if (isHTML(description)) {
            const firstParagraph = extractFirstParagraph(description);
            return DOMPurify.sanitize(firstParagraph);
        }
        return description;
    }, [description]);

    // Render description based on whether sanitized HTML is available
    const renderDescription = () => {
        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: sanitizedDescription || 'No description available.',
                }}
            />
        );
    };

    return (
        <Flex width="100%" flexDir="column" gap={7} p={4}>
            {/* Featured Product Title */}
            <Flex flexDir="row" gap={2}>
                <Text color="#A0A0A0">Featured Product:</Text>
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
                w="100%" // Ensure the card takes full width of the container
                maxW="622px" // Restrict the maximum width
                h="295px" // Set a fixed height to ensure it appears
                maxH="295px" // Restrict the maximum height
                bgColor="#121212"
                overflow="hidden"
                flexDir={{ base: 'column', md: 'row' }} // Stack on small screens
                alignItems="stretch"
                boxShadow="12px 12px 24px rgba(18, 18, 18, 0.5), -6px -6px 12px rgba(18, 18, 18, 0.1)"
            >
                {/* Image */}
                <ChakraImage
                    src={imgSrc}
                    alt={categoryTitle}
                    flexShrink={1}
                    objectFit="cover"
                    height="100%"
                    width={{ base: '100%', md: '50%' }}
                    minWidth="150px"
                    bgColor="transparent"
                    borderLeftRadius={{ md: '16px' }}
                    cursor="pointer"
                    onClick={handleClick}
                />

                {/* Description */}
                <Flex
                    flex="1"
                    flexDir="column"
                    p={4}
                    gap={3}
                    justifyContent="center"
                >
                    <Text color="white" noOfLines={4}>
                        {renderDescription()}
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

                        {!currencyIsUsdStable(preferred_currency_code) && (
                            <Text
                                color="gray.300"
                                fontSize="14px"
                                fontWeight="medium"
                                opacity="0.7"
                            >
                                ≅ ${usdPrice} USD
                            </Text>
                        )}
                    </Flex>

                    {/* Title */}
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
            {/* <Text color="#A0A0A0" fontStyle="italic">
                The product is on sale. Buy now and grab a great discount!
            </Text> */}
        </Flex>
    );
};

export default HeroImageCarousel;
