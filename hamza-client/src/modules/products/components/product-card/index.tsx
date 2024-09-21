'use client';

import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
import {
    Card,
    CardBody,
    Text,
    Flex,
    Box,
    Skeleton,
    Image,
} from '@chakra-ui/react';
import { AiOutlineDollar } from 'react-icons/ai';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import BuyButton from '../buy-button';
import CartButton from '@modules/home/components/product-layout/components/cart-button';
import { addToCart } from '@modules/cart/actions';
import { IoStar } from 'react-icons/io5';
import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { getObjectFit } from '@modules/get-object-fit';

interface ProductCardProps {
    reviewCount?: number;
    totalRating?: number;
    variantID?: string;
    countryCode?: string;
    productName?: string;
    productPrice?: number | string;
    currencyCode?: string;
    imageSrc?: string;
    hasDiscount?: boolean;
    discountValue?: string;
    productHandle?: string;
    productId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    variantID,
    countryCode,
    productName,
    reviewCount,
    totalRating,
    productPrice,
    currencyCode,
    imageSrc,
    hasDiscount,
    discountValue,
    productHandle,
    productId,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const objectFit = getObjectFit(productHandle);

    return (
        <Card
            width={{ base: '167px', md: '280px' }}
            height={{ base: '243px', md: '384px ' }}
            backgroundColor={'#121212'}
            borderRadius="16px"
            overflow="hidden"
        >
            <LocalizedClientLink href={`/products/${productHandle}`}>
                <Box
                    onClick={() => { }}
                    height={{ base: '134.73px', md: '238px' }}
                    width="100%"
                    display="flex"
                    backgroundColor={objectFit === 'cover' ? 'black' : 'white'}
                    justifyContent="center"
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                >
                    {!imageLoaded && <Skeleton height="240px" width="100%" />}
                    <Image
                        src={imageSrc}
                        alt={productName}
                        width="100%"
                        height="100%"
                        objectFit={objectFit}
                        onLoad={() => setImageLoaded(true)}
                        display={imageLoaded ? 'block' : 'none'}
                    />{' '}
                </Box>
            </LocalizedClientLink>

            {/* card body */}
            <Flex
                padding={{ base: '0.5rem', md: '1rem' }}
                height={'100%'}
                display={'flex'}
                flexDirection={'column'}
            >
                <Box display={'flex'} flexDirection={'column'} flex="1">
                    <Flex mb={{ base: '0', md: '1' }}>
                        <Text
                            color={'white'}
                            fontWeight="700"
                            fontSize={{ base: '14px', md: '1.25rem' }}
                            noOfLines={{ base: 2, md: 3 }}
                        >
                            {productName}
                        </Text>
                        {/* wish list heart code */}
                    </Flex>

                    {/* revew + currency */}
                    <Box mt="auto">
                        <Flex mb={{ base: '0', md: '2.5px' }}>
                            <Box
                                ml="2px"
                                fontSize={{ base: '18px', md: '18px' }}
                            >
                                <IoStar
                                    style={{
                                        color: '#FEC84B',
                                    }}
                                />
                            </Box>
                            {(reviewCount ?? 0) > 0 ? (
                                <>
                                    <Text
                                        color={'white'}
                                        alignSelf={'center'}
                                        fontWeight="700"
                                        fontSize={{ base: '14px', md: '14px' }}
                                        ml="1"
                                    >
                                        {totalRating}
                                    </Text>
                                    <Text
                                        alignSelf={'center'}
                                        fontWeight="700"
                                        fontSize={{ base: '14px', md: '16px' }}
                                        color="#555555"
                                        ml="1"
                                    >
                                        ({reviewCount} reviews)
                                    </Text>
                                </>
                            ) : (
                                <Text
                                    alignSelf={'center'}
                                    ml="10px"
                                    fontSize={{ base: '14px', md: '14px' }}
                                    color={'white'}
                                >
                                    {' '}
                                    No Reviews Yet{' '}
                                </Text>
                            )}
                        </Flex>
                        <Flex>
                            <Box
                                alignSelf={'center'}
                                fontSize={{ base: '18px', md: '24px' }}
                            >
                                {/* <Image
                                    src={currencyIcons['USDC']}
                                    style={{ width: '16px', height: '16px' }}
                                    alt="usdc"
                                /> */}
                                <AiOutlineDollar color="#2775CA" />
                            </Box>
                            <Text
                                color={'white'}
                                ml="2"
                                fontWeight="700"
                                fontSize={{ base: '14px', md: '18px' }}
                                lineHeight="33.72px"
                            >
                                {`${formatCryptoPrice(parseInt(productPrice?.toString() ?? '0'), currencyCode ?? 'usdc')} ${currencyCode?.toUpperCase()}`}
                            </Text>
                            <Text
                                textDecoration={
                                    hasDiscount === true
                                        ? 'line-through'
                                        : 'none'
                                }
                                ml={{ base: '1', md: '2' }}
                                mb={{ base: '0', md: '1' }}
                                alignSelf={'center'}
                                color={'#555555'}
                                fontWeight="700"
                                fontSize="0.875rem"
                                lineHeight="17.64px"
                            >
                                {productPrice}
                            </Text>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Card>
    );
};

export default ProductCard;
