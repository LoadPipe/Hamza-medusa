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
import Image from 'next/image';
import ReviewStar from '../../../../../../../public/images/products/review-star.svg';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';
import ProductDescription from '../product-description';
import { renderStars20px } from '@modules/products/components/review-stars';

const ProductInfo = () => {
    // Zustand
    let {
        productData,
        variantId,
        quantity,
        setVariantId,
        ratingAverage,
        ratingCounter,
    } = useProductPreview();
    const { wishlist } = useWishlistStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();
    const { authData } = useCustomerAuthStore();
    const { preferred_currency_code } = useCustomerAuthStore();
    const [selectedVariant, setSelectedVariant] = useState<null | Variant>(
        null
    );
    const [selectedVariantImage, setSelectedVariantImage] = useState<
        null | string
    >(null);

    const convertToPriceDictionary = (selectedVariant: Variant | null) => {
        const output: { [key: string]: number } = {};
        if (selectedVariant) {
            for (let price of selectedVariant.prices) {
                output[price.currency_code] = price.amount;
            }
        }
        return output;
    };

    // Memoize the selected variant to avoid recalculating on every render

    useEffect(() => {
        if (productData?.variants) {
            variantId = variantId ?? productData?.variants[0]?.id;
            setVariantId(variantId ?? '');

            let selectedProductVariant = productData.variants.find(
                (a: any) => a.id == variantId
            );

            setSelectedVariant(selectedProductVariant);

            if (
                selectedProductVariant?.metadata &&
                typeof selectedProductVariant.metadata.imgUrl === 'string'
            ) {
                setSelectedVariantImage(selectedProductVariant.metadata.imgUrl);
            } else {
                setSelectedVariantImage(null); // Reset to null if no imgUrl is found
            }

            // variantThumbnail = setSelectedVariant(selectedProductVariant);
            const price =
                selectedProductVariant &&
                selectedProductVariant.prices.find(
                    (p: any) =>
                        p.currency_code === (preferred_currency_code ?? 'usdc')
                );
        }
    }, [productData, variantId]);

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
                    >
                        {productData?.title ?? ''}
                    </Heading>

                    {authData.status == 'authenticated' && (
                        <Box
                            display={{ base: 'none', md: 'block' }}
                            ml="auto"
                            mt="0.7rem"
                        >
                            {wishlist.products.find(
                                (a) => a.id == productData?.id
                            ) ? (
                                <BiSolidHeart
                                    size={'26px'}
                                    onClick={() => {
                                        removeWishlistItemMutation.mutate({
                                            id: productData?.id ?? '',
                                            description:
                                                productData?.description ?? '',
                                            handle: productData?.handle ?? '',
                                            thumbnail:
                                                productData?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: productData?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId:
                                                wishlist.products.find(
                                                    (i) =>
                                                        i.id == productData?.id
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
                                            id: productData?.id,
                                            description:
                                                productData?.description ?? '',
                                            handle: productData?.handle ?? '',
                                            thumbnail:
                                                productData?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: productData?.title ?? '',
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
                ) : (
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
                                as="h4"
                                fontWeight="600"
                                fontSize={'14px'}
                                color={'white'}
                                mt="2px"
                            >
                                no reviews yet
                            </Text>
                        </Flex>
                    </Flex>
                )}
            </Flex>

            <ProductDescription
                description={productData?.description ?? ''}
                subtitle={productData?.subtitle ?? ''}
            />
        </Flex>
    );
};

export default ProductInfo;
