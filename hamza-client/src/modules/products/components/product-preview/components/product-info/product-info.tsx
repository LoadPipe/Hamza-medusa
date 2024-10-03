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
import useProductPreview from '@store/product-preview/product-preview';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import useWishlistStore, {
    WishlistProduct,
} from '@store/wishlist/wishlist-store';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { Variant } from 'types/medusa';
import Image from 'next/image';
import { getAverageRatings, getReviewCount } from '@lib/data';
import ReviewStar from '../../../../../../../public/images/products/review-star.svg';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';
import ProductDescription from '../product-description';

const ProductInfo = () => {
    // Zustand
    let { productData, variantId, quantity, setVariantId } =
        useProductPreview();
    const { wishlist } = useWishlistStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();
    const { authData } = useCustomerAuthStore();
    const { preferred_currency_code } = useCustomerAuthStore();
    console.log('user preferred currency code: ', preferred_currency_code);

    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<null | Variant>(
        null
    );

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
            const price =
                selectedProductVariant &&
                selectedProductVariant.prices.find(
                    (p: any) =>
                        p.currency_code === (preferred_currency_code ?? 'usdc')
                );
            setSelectedPrice(price?.amount ?? 0);
        }
    }, [productData, variantId]);

    // Star Feature
    const renderStars = (rating: any) => {
        const fullStars = rating ? Math.floor(rating) : 0;
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex">
                {Array(fullStars)
                    .fill(null)
                    .map((_, index) => (
                        <TiStarFullOutline
                            key={`full-${index}`}
                            className="text-yellow-500 text-2xl  w-['20px'] h-['20px]"
                        />
                    ))}
                {halfStar && (
                    <TiStarHalfOutline className="text-yellow-500 text-2xl w-['20px'] h-['20px]" />
                )}
                {Array(emptyStars)
                    .fill(null)
                    .map((_, index) => (
                        <TiStarOutline
                            key={`empty-${index}`}
                            className="text-yellow-500 text-2xl w-['20px'] h-['20px]"
                        />
                    ))}
            </div>
        );
    };

    // Get product ratings
    const [averageRating, setAverageRating] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);
    useEffect(() => {
        const fetchProductReview = async () => {
            const averageRatingResponse = await getAverageRatings(
                productData?.id ?? ''
            );
            const reviewCountResponse = await getReviewCount(productData?.id ?? '');

            setAverageRating(averageRatingResponse);
            setReviewCount(reviewCountResponse);
        };

        fetchProductReview();
    }, [productData]);

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
                                            thumbnail: productData?.thumbnail ?? '',
                                            title: productData?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId: variantId || null,
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
                                            thumbnail: productData?.thumbnail ?? '',
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

                {reviewCount > 0 ? (
                    <Flex
                        display={{ base: 'none', md: 'flex' }}
                        gap="5px"
                        height="20px"
                    >
                        <Flex flexDirection={'row'}>
                            <Flex flexDirection={'row'} alignSelf={'center'}>
                                {renderStars(averageRating)}
                            </Flex>
                            <Text
                                ml="2"
                                as="h4"
                                fontWeight="600"
                                fontSize={'20px'}
                                color={'white'}
                                alignSelf={'center'}
                                mt="2px"
                            >
                                {averageRating}
                            </Text>
                            <Text
                                ml="2"
                                as="h4"
                                fontWeight="600"
                                fontSize={'14px'}
                                color={'white'}
                                mt="2px"
                            >
                                ({reviewCount}{' '}
                                {reviewCount === 1 ? 'review' : 'reviews'})
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
                                {renderStars(averageRating)}
                            </Flex>

                            <Text
                                ml="2"
                                as="h4"
                                fontWeight="600"
                                fontSize={'14px'}
                                color={'white'}
                                mt="2px"
                            >
                                ({reviewCount}{' '}
                                {reviewCount === 1 ? 'review' : 'reviews'})
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
