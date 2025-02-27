'use client';

import {
    Box,
    Flex,
    Text,
    Heading,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import useProductPreview from '@/zustand/product-preview/product-preview';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import useWishlistStore, {
    WishlistProduct,
} from '@/zustand/wishlist/wishlist-store';
import { useWishlistMutations } from '@/zustand/wishlist/mutations/wishlist-mutations';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Variant } from '@/types/medusa';
import ProductDescription from '../product-description';
import { renderStars20px } from '@modules/products/components/review-stars';
import { useQueryClient } from '@tanstack/react-query';
import { Product } from '@/lib/schemas/product';

interface ProductProps {
    handle: string;
}

const ProductInfo = ({ handle }: ProductProps): JSX.Element => {
    const queryClient = useQueryClient();
    const product = queryClient.getQueryData<Product>(['product', handle]);

    // Zustand
    let { variantId, setVariantId, ratingAverage, ratingCounter } =
        useProductPreview();

    // WISHLIST
    const { wishlist } = useWishlistStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();

    // CUSTOMER AUTH
    const { authData } = useCustomerAuthStore();
    const [selectedVariant, setSelectedVariant] = useState<
        Product['variants'][number] | null
    >(null);
    const [selectedVariantImage, setSelectedVariantImage] = useState<
        null | string
    >(null);

    const convertToPriceDictionary = (
        selectedVariant: Product['variants'][number] | null
    ) => {
        const output: { [key: string]: number } = {};
        if (selectedVariant) {
            for (let price of selectedVariant.prices) {
                output[price.currency_code] = price.amount;
            }
        }
        return output;
    };

    useEffect(() => {
        if (product?.variants) {
            const newVariantId = variantId ?? product.variants[0]?.id;
            setVariantId(newVariantId ?? '');

            const selectedProductVariant = product.variants.find(
                (a: any) => a.id === newVariantId
            );
            setSelectedVariant(selectedProductVariant ?? null);

            if (
                selectedProductVariant?.metadata &&
                typeof selectedProductVariant.metadata.imgUrl === 'string'
            ) {
                setSelectedVariantImage(selectedProductVariant.metadata.imgUrl);
            } else {
                setSelectedVariantImage(null); // Reset to null if no imgUrl is found
            }
        }
    }, [product, variantId, setVariantId]);

    if (!product) {
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
            maxWidth={['100%', '90%', '720px']}
            flexDirection="column"
            gap="26px"
        >
            <Flex flexDir={'column'}>
                <Flex flexDir={'row'}>
                    <Heading
                        display={{ base: 'none', md: 'block' }}
                        as="h1"
                        fontSize={'32px'}
                        color="white"
                        className="product-info-title"
                        maxWidth={'550px'}
                    >
                        {product?.title ?? ''}
                    </Heading>

                    {authData.status == 'authenticated' && (
                        <Box
                            display={{ base: 'none', md: 'block' }}
                            ml="auto"
                            mt="0.7rem"
                        >
                            {wishlist.products.find(
                                (a) => a.id == product?.id
                            ) ? (
                                <BiSolidHeart
                                    size={'26px'}
                                    onClick={() => {
                                        removeWishlistItemMutation.mutate({
                                            id: product?.id ?? '',
                                            description:
                                                product?.description ?? '',
                                            handle: product?.handle ?? '',
                                            thumbnail: product?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: product?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId:
                                                wishlist.products.find(
                                                    (i) => i.id == product?.id
                                                )?.productVariantId || null,
                                        });
                                    }}
                                    className="text-white  cursor-pointer"
                                />
                            ) : (
                                <BiHeart
                                    size={26}
                                    onClick={() => {
                                        addWishlistItemMutation.mutate({
                                            id: product?.id,
                                            description:
                                                product?.description ?? '',
                                            handle: product?.handle ?? '',
                                            thumbnail: product?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: product?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId: variantId || null,
                                        });
                                    }}
                                    className="text-white cursor-pointer"
                                />
                            )}
                        </Box>
                    )}
                </Flex>

                {ratingCounter > 0 ? (
                    <Flex
                        display={{ base: 'none', md: 'flex' }}
                        gap="5px"
                        height="20px"
                    >
                        <Flex flexDirection={'row'}>
                            <Flex flexDirection={'row'} alignSelf={'center'}>
                                {renderStars20px(ratingAverage)}
                            </Flex>
                            <Text
                                ml="2"
                                fontWeight="600"
                                fontSize={'20px'}
                                color={'white'}
                                alignSelf={'center'}
                                mt="2px"
                            >
                                {ratingAverage}
                            </Text>
                            <Text
                                ml="2"
                                fontWeight="600"
                                fontSize={'14px'}
                                color={'white'}
                                mt="2px"
                            >
                                ({ratingCounter}{' '}
                                {ratingCounter === 1 ? 'review' : 'reviews'})
                            </Text>
                        </Flex>
                    </Flex>
                ) : null}
            </Flex>

            <ProductDescription
                description={product?.description ?? ''}
                subtitle={product?.subtitle ?? ''}
            />
        </Flex>
    );
};

export default ProductInfo;
