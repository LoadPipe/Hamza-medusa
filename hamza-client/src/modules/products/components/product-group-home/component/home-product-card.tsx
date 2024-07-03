import React, { useState, useEffect } from 'react';
import {
    Text,
    Box,
    Flex,
    Skeleton,
    Image as ChakraImage,
} from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';
import { IoStar } from 'react-icons/io5';
import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import { AiOutlineDollar } from 'react-icons/ai';
import { addToCart } from '@modules/cart/actions';
import Link from 'next/link';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { MdShoppingCart } from 'react-icons/md';
import USDC from '../../../../../../public/images/currencies/usdc-icon.svg';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

interface ProductCardProps {
    variantID: string;
    countryCode: string;
    productName: string;
    reviewCount: number;
    totalRating: number;
    productPrice: number | string;
    currencyCode: string;
    imageSrc: string;
    hasDiscount: boolean;
    discountValue: string;
    productHandle: string;
    allow_backorder: boolean;
    inventory: number;
    storeId: string;
}

const ProductCardHome: React.FC<ProductCardProps & { productId?: string }> = ({
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
    allow_backorder,
    inventory,
    storeId,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // new
    //Product states
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [loadingAddToCart, setLoadingAddToCard] = useState(false);

    //Auth states
    const { authData, whitelist_config, setWhitelistConfig } =
        useCustomerAuthStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();

    //Wishlist store
    const { wishlist } = useWishlistStore();
    const [isWhitelisted, setIsWhitelisted] = useState(false);

    //Routing
    // const router = useRouter();
    //Toggle wish list

    const toggleWishlist = async () => {
        // console.log('toggle wishlist-dropdown item', product);
        wishlist.products.find((a) => a.id == productId)
            ? removeWishlistItemMutation.mutate({
                  id: productId!,
                  description: '',
                  handle: productHandle,
                  thumbnail: imageSrc,
                  title: productName,
              })
            : addWishlistItemMutation.mutate({
                  id: productId!,
                  description: '',
                  handle: productHandle,
                  thumbnail: imageSrc,
                  title: productName,
              });
    };

    // Add to cart
    const handleAddToCart = async () => {
        setLoadingAddToCard(true);
        await addToCart({
            variantId: variantID ?? '',
            quantity: 1,
            countryCode: countryCode ?? '',
            currencyCode: 'eth',
        });
        setLoadingAddToCard(false);
    };

    //White listed
    const whitelistedProductHandler = async () => {
        const whitelistedProduct =
            whitelist_config.is_whitelisted &&
            whitelist_config.whitelisted_stores.includes(storeId)
                ? true
                : false;

        setIsWhitelisted(whitelistedProduct);
        return;
    };

    useEffect(() => {
        if (authData.status == 'authenticated' && allow_backorder == true) {
            whitelistedProductHandler();
        }
    }, [authData.status]);

    return (
        <LocalizedClientLink href={`/products/${productHandle}`}>
            <Box
                borderRadius="16px"
                overflow="hidden"
                backgroundColor="black"
                transition="transform 0.2s ease-in-out" // Adds a smooth transition effect
                _hover={{
                    transform: 'scale(1.02)', // Increases the size by 2% on hover
                }}
            >
                <Box
                    height={{ base: '134.73', md: '238px' }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    // onClick={() => console.log('hello')}
                    style={{ cursor: 'pointer' }}
                >
                    {!imageLoaded && <Skeleton height="240px" width="100%" />}
                    <ChakraImage
                        src={imageSrc}
                        alt={productName}
                        objectFit="cover"
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
                        <Flex
                            alignItems="center"
                            mb={{ base: '2.5px', md: '0' }}
                        >
                            <IoStar style={{ color: '#FEC84B' }} />
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
                                    ml={{ base: '1.5', md: '2' }}
                                    fontSize={{ base: '14px', md: '16px' }}
                                    color={'white'}
                                >
                                    no reviews yet
                                </Text>
                            )}
                        </Flex>

                        <Flex alignItems="center">
                            <Flex
                                wrap={'nowrap'}
                                width={{ base: '14px', md: '16px' }}
                                height={{ base: '14px', md: '16px' }}
                            >
                                <Image
                                    src={require('../../../../../../public/images/currencies/usdc-icon.svg')}
                                    alt="usdc"
                                    style={{ width: '100%', height: '100%' }}
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
                                {`${productPrice}`}{' '}
                                <Text
                                    as="span"
                                    display={{
                                        base: 'none',
                                        md: 'inline-block',
                                    }}
                                    style={{
                                        fontSize: '12px',
                                        color: '#555555',
                                    }}
                                >
                                    {productPrice}
                                </Text>
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </LocalizedClientLink>
    );
};

export default ProductCardHome;
