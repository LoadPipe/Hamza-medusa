'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Image, Text, Flex, Box } from '@chakra-ui/react';
import { TiStarFullOutline } from 'react-icons/ti';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { AiOutlineDollar } from 'react-icons/ai';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import BuyButton from './buy-button';
import CartButton from './cart-button';
import { addToCart } from '@modules/cart/actions';
import { IoHeartCircleOutline, IoHeartCircleSharp } from 'react-icons/io5';
import { IoStar } from 'react-icons/io5';
import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import { useWishlistMutations } from '@/zustand/wishlist/mutations/wishlist-mutations';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import axios from 'axios';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
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

const ProductCard: React.FC<ProductCardProps & { productId?: string }> = ({
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
    //Product states
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [loadingAddToCart, setLoadingAddToCard] = useState(false);

    //Auth states
    const { authData, whitelist_config, setWhitelistConfig } =
        useCustomerAuthStore();

    //Wishlist store
    const { wishlist } = useWishlistStore();
    const [isWhitelisted, setIsWhitelisted] = useState(false);

    //Routing
    const router = useRouter();

    // Add to cart
    const handleAddToCart = async () => {
        setLoadingAddToCard(true);
        await addToCart({
            variantId: variantID ?? '',
            quantity: 1,
            countryCode: countryCode ?? '',
        });
        setLoadingAddToCard(false);
    };

    //TODO: is this used, and why is eth hard-coded?
    // Buy now
    const handleBuyNow = async () => {
        setLoadingBuy(true);
        await addToCart({
            variantId: variantID ?? '',
            quantity: 1,
            countryCode: countryCode ?? '',
        });
        setLoadingBuy(false);
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
        <Card
            maxW={'295px'}
            h="480px"
            backgroundColor={'black'}
            borderRadius="0.725rem"
            overflow="hidden"
        >
            <LocalizedClientLink href={`/products/${productHandle}`}>
                <Box
                    onClick={() => {}}
                    h="240px"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                >
                    <Image src={imageSrc} alt={productName} />
                </Box>
            </LocalizedClientLink>
            <CardBody
                backgroundColor={'black'}
                display={'flex'}
                flexDirection={'column'}
            >
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    h="100%"
                    w="100%"
                >
                    <Flex mb="1">
                        <Text
                            color={'white'}
                            fontWeight="700"
                            fontSize="1.25rem"
                            lineHeight="25.29px"
                            mr="4"
                            noOfLines={3}
                        >
                            {productName}
                        </Text>
                        {/* {authData.status == 'authenticated' && (
                            <Box
                                ml="auto"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minWidth="40px"
                                minHeight="40px"
                                borderRadius="50%"
                                border="1px"
                                borderColor="#7B61FF"
                                cursor="pointer"
                                onClick={() => toggleWishlist()} //todo
                                sx={{
                                    userSelect: 'none', // Prevents text selection on card contents
                                }}
                            >
                                <Box alignSelf="center">
                                    {!wishlist.products.find(
                                        (a) => a.id == productId
                                    ) ? (
                                        <FaRegHeart color="#7B61FF" size={23} />
                                    ) : (
                                        <FaHeart color="#7B61FF" size={23} />
                                    )}
                                </Box>
                            </Box>
                        )} */}
                    </Flex>

                    <Box mt="auto">
                        <Flex mb="1">
                            <Box mt="1px">
                                <IoStar
                                    style={{
                                        color: '#FEC84B',
                                        width: '24px',
                                        height: '24px',
                                    }}
                                />
                            </Box>
                            {reviewCount > 0 ? (
                                <>
                                    <Text
                                        color={'white'}
                                        alignSelf={'center'}
                                        fontWeight="700"
                                        fontSize="14px"
                                        ml="1"
                                    >
                                        {totalRating}
                                    </Text>
                                    <Text
                                        alignSelf={'center'}
                                        fontWeight="700"
                                        fontSize="14px"
                                        color="#555555"
                                        ml="1"
                                    >
                                        ({reviewCount} reviews)
                                    </Text>
                                </>
                            ) : (
                                <Text color={'white'}> No Reviews Yet </Text>
                            )}
                        </Flex>
                        <Flex>
                            <Box alignSelf={'center'}>
                                <AiOutlineDollar
                                    style={{ width: '24px', height: '24px' }}
                                    color="#2775CA"
                                />
                            </Box>

                            <Text
                                color={'white'}
                                ml="2"
                                fontWeight="700"
                                fontSize="1.25rem"
                                lineHeight="33.72px"
                            >
                                {`${productPrice} ${currencyCode.toUpperCase()}`}
                            </Text>
                            <Text
                                textDecoration={
                                    hasDiscount === true
                                        ? 'line-through'
                                        : 'none'
                                }
                                ml="2"
                                mb="1"
                                alignSelf={'center'}
                                color={'#555555'}
                                fontWeight="700"
                                fontSize="0.875rem"
                                lineHeight="17.64px"
                            >
                                {productPrice}
                            </Text>
                        </Flex>
                        <Flex
                            direction={{ base: 'column', md: 'row' }} // Stack vertically on small screens, horizontally on medium and up
                            gap="14px"
                            py={2}
                        >
                            <CartButton
                                handleBuyNow={() => {
                                    if (inventory == 0 && !isWhitelisted) {
                                        toast.error('Out of Stock');
                                        return;
                                    }
                                    if (inventory == 0 && isWhitelisted) {
                                        handleAddToCart();
                                        return;
                                    }
                                    if (inventory > 0) {
                                        handleAddToCart();
                                        return;
                                    }
                                }}
                                loader={loadingAddToCart}
                                styles={'w-full'}
                                outOfStock={inventory == 0 && !isWhitelisted}
                                title={
                                    inventory == 0 && !isWhitelisted
                                        ? 'Out of Stock'
                                        : 'Add to Cart'
                                }
                            />

                            <BuyButton
                                handleBuyNow={() => {
                                    if (inventory == 0 && !isWhitelisted) {
                                        toast.error('Out of Stock');
                                        return;
                                    }
                                    if (inventory == 0 && isWhitelisted) {
                                        handleBuyNow();
                                        router.push('/checkout?step=address');
                                        return;
                                    }
                                    if (inventory > 0) {
                                        handleBuyNow();
                                        router.push('/checkout?step=address');
                                        return;
                                    }
                                }}
                                loader={loadingBuy}
                                styles={'w-full'}
                                outOfStock={inventory == 0 && !isWhitelisted}
                                title="Buy Now"
                            />
                        </Flex>
                    </Box>
                </Box>
            </CardBody>
        </Card>
    );
};

export default ProductCard;
