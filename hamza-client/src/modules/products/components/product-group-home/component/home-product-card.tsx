import React, { useEffect, useState } from 'react';
import {
    Text,
    Box,
    Flex,
    Skeleton,
    Image as ChakraImage,
} from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { IoStar } from 'react-icons/io5';
import Image from 'next/image';
import { getObjectFit } from '@modules/get-object-fit';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';

interface ProductCardProps {
    variantID: string;
    countryCode: string;
    productName: string;
    productPrice: number | string;
    currencyCode: string;
    imageSrc: string;
    hasDiscount: boolean;
    discountValue: string;
    productHandle: string;
    allow_backorder: boolean;
    inventory: number;
    storeId: string;
    productId: string;
    reviewCount: number;
    totalRating: number;
}

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { getAverageRatings, getReviewCount } from '@lib/data';
import useProductPreview from '@store/product-preview/product-preview';
import { useRouter } from 'next/navigation';

const ProductCardHome: React.FC<ProductCardProps & { productId?: string }> = ({
    variantID,
    countryCode,
    productName,
    productPrice,
    currencyCode,
    imageSrc,
    hasDiscount,
    discountValue,
    productHandle,
    productId,
    allow_backorder,
    inventory,
    storeId,
    reviewCount,
    totalRating,
}) => {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const { preferred_currency_code } = useCustomerAuthStore();
    const { setRatingCounter, setRatingAverage } = useProductPreview();

    const objectFit = getObjectFit(productHandle);

    const handleClick = () => {
        // Update Zustand state first
        setRatingCounter(reviewCount);
        setRatingAverage(totalRating);

        // Navigate to the product page after state update
        router.push(`/products/${productHandle}`);
    };

    return (
        <Box
            borderRadius="16px"
            overflow="hidden"
            backgroundColor="#121212"
            transition="transform 0.2s ease-in-out" // Adds a smooth transition effect
            _hover={{
                transform: 'scale(1.02)', // Increases the size by 2% on hover
            }}
            onClick={handleClick}
            cursor={'pointer'}
        >
            <Box
                height={{ base: '134.73px', md: '238px' }}
                display="flex"
                justifyContent="center"
                backgroundColor={objectFit === 'cover' ? 'black' : 'white'}
                alignItems="center"
                style={{ cursor: 'pointer' }}
            >
                {!imageLoaded && <Skeleton height="240px" width="100%" />}
                <ChakraImage
                    src={imageSrc}
                    alt={productName}
                    objectFit={objectFit}
                    height="100%"
                    width="100%"
                    onLoad={() => setImageLoaded(true)}
                    display={imageLoaded ? 'block' : 'none'}
                />
            </Box>

            <Flex
                p={{ base: '2', md: '4' }}
                flexDirection={'column'}
                height={{ base: '109px', md: '161px' }} //161px
            >
                <Flex alignItems="center" flexShrink={0}>
                    <Text
                        color="white"
                        fontWeight="700"
                        fontSize={{ base: '14px', md: '1.25rem' }}
                        isTruncated
                        noOfLines={2}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="normal"
                        wordBreak="break-word"
                    >
                        {productName}
                    </Text>
                </Flex>

                <Flex
                    mt="auto"
                    mb={{ base: '0', md: '5px' }}
                    flexDirection={'column'}
                >
                    <Flex alignItems="center" mb={{ base: '2.5px', md: '0' }}>
                        <IoStar style={{ color: '#FEC84B' }} />
                        {reviewCount > 0 ? (
                            <>
                                <Text
                                    color={'white'}
                                    alignSelf={'center'}
                                    fontWeight="700"
                                    fontSize={{ base: '14px', md: '14px' }}
                                    ml={{ base: '1.5', md: '2' }}
                                >
                                    {totalRating}
                                </Text>
                                <Text
                                    alignSelf={'center'}
                                    fontWeight="700"
                                    fontSize={{ base: '14px', md: '16px' }}
                                    color="#555555"
                                    ml="2"
                                >
                                    ({reviewCount}{' '}
                                    {reviewCount === 1 ? 'review' : 'reviews'})
                                </Text>
                            </>
                        ) : (
                            <Text
                                alignSelf={'center'}
                                fontWeight="700"
                                fontSize={{ base: '14px', md: '16px' }}
                                color="white"
                                ml="2"
                            >
                                no reviews yet
                            </Text>
                        )}
                    </Flex>

                    <Flex alignItems="center">
                        <Flex mb="1px">
                            <Image
                                className="h-[18px] w-[18px] md:h-[20px] md:w-[20px]"
                                src={
                                    currencyIcons[
                                        preferred_currency_code || 'usdc'
                                    ]
                                }
                                alt={preferred_currency_code || 'usdc'}
                            />
                        </Flex>

                        <Text
                            display={'flex'}
                            flexDirection={'row'}
                            noOfLines={1}
                            color="white"
                            ml="2"
                            fontWeight="700"
                            fontSize={{ base: '14px', md: '18px' }}
                        >
                            {`${productPrice}`}
                            <Text
                                ml="5px"
                                as="span"
                                display={{
                                    base: 'none',
                                    md: 'inline-block',
                                }}
                                style={{
                                    fontSize: '12px',
                                    color: 'white',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {preferred_currency_code?.toUpperCase() ||
                                    'USDC'}
                            </Text>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default ProductCardHome;
