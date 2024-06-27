'use client';

import {
    Box,
    Flex,
    Text,
    Heading,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react';
import React from 'react';
import useProductPreview from '@store/product-preview/product-preview';

const ProductInfo = () => {
    const { productData } = useProductPreview();

    const isLoading = !productData || Object.keys(productData).length === 0;

    if (isLoading) {
        return (
            <Flex
                width="100%"
                backgroundColor="transparent"
                maxWidth={['100%', '90%', '776px']}
                flexDirection="column"
                gap="26px"
            >
                <Skeleton height="40px" width="150px" />
                <Skeleton height="30px" width="200px" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
            </Flex>
        );
    }

    return (
        <Flex
            width="100%"
            backgroundColor="transparent"
            maxWidth={['100%', '90%', '776px']}
            flexDirection="column"
            gap="26px"
        >
            <Flex display={{ base: 'none', md: 'flex' }}>
                <Box
                    backgroundColor="#121212"
                    px="15px" // Horizontal padding
                    py="8px" // Vertical padding, adjust as needed
                    borderRadius="9999px" // High border-radius for the pill shape
                    display="inline-flex" // Using inline-flex to better manage inner Text alignment
                    alignItems="center" // Aligns the text vertically in the center
                    justifyContent="center" // Centers the text horizontally
                >
                    <Text color="white">Electronics</Text>
                </Box>
            </Flex>
            <Heading
                display={{ base: 'none', md: 'block' }}
                as="h1"
                color="white"
            >
                {productData.title}
            </Heading>
            <Flex flexDirection={'column'}>
                <Heading
                    as="h2"
                    fontSize={{ base: '16px', md: '24px' }}
                    color="primary.green.900"
                >
                    Product Info
                </Heading>
                <Text fontSize={{ base: '14px', md: '16px' }} color="white">
                    {productData.subtitle}
                </Text>
            </Flex>
            <Flex flexDirection={'column'}>
                <Heading
                    as="h2"
                    fontSize={{ base: '16px', md: '24px' }}
                    color="primary.green.900"
                >
                    About this item
                </Heading>
                <Text fontSize={{ base: '14px', md: '16px' }} color="white">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: productData.description,
                        }}
                    />
                </Text>
            </Flex>
        </Flex>
    );
};

export default ProductInfo;
