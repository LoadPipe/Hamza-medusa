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
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

const ProductInfo = () => {
    const { productData } = useProductPreview();
    const { wishlist } = useWishlistStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();
    const { authData } = useCustomerAuthStore();

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
                    px="15px"
                    py="8px"
                    borderRadius="9999px"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text color="white">Electronics</Text>
                </Box>
            </Flex>
            <Flex className="flex justify-between items-center pr-5">
                <Heading
                    display={{ base: 'none', md: 'block' }}
                    as="h1"
                    color="white"
                >
                    {productData.title}
                </Heading>

                {authData.status == 'authenticated' && (
                    <Box>
                        {wishlist.products.find(
                            (a) => a.id == productData.id
                        ) ? (
                            <BiSolidHeart
                                onClick={() => {
                                    removeWishlistItemMutation.mutate({
                                        id: productData.id,
                                        description: productData.description,
                                        handle: productData.handle,
                                        thumbnail: productData.thumbnail,
                                        title: productData.title,
                                    });
                                }}
                                className="text-white text-2xl cursor-pointer"
                            />
                        ) : (
                            <BiHeart
                                onClick={() => {
                                    addWishlistItemMutation.mutate({
                                        id: productData.id,
                                        description: productData.description,
                                        handle: productData.handle,
                                        thumbnail: productData.thumbnail,
                                        title: productData.title,
                                    });
                                }}
                                className="text-white text-2xl cursor-pointer"
                            />
                        )}
                    </Box>
                )}
            </Flex>

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
                <Box fontSize={{ base: '14px', md: '16px' }} color="white">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: productData.description,
                        }}
                    />
                </Box>
            </Flex>
        </Flex>
    );
};

export default ProductInfo;
