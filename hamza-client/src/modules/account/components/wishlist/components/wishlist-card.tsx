import React, { useEffect, useState } from 'react';
import {
    Flex,
    Text,
    Image as ChakraImage,
    Button,
    Divider,
    Skeleton,
    SkeletonText,
    SkeletonCircle,
    Box,
    Badge,
} from '@chakra-ui/react';
import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { getStore } from '@/lib/server';
import { addToCart } from '@modules/cart/actions';
import CartPopup from '@modules/products/components/cart-popup';
import { useWishlistMutations } from '@/zustand/wishlist/mutations/wishlist-mutations';
import { WishlistProduct } from '@/zustand/wishlist/wishlist-store';
import { Trash } from '@medusajs/icons';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { LuBadgeCheck } from 'react-icons/lu';

type PriceDictionary = {
    eth?: string;
    usdc?: string;
    usdt?: string;
};

interface WishlistCardProps {
    productData: WishlistProduct;
    productDescription: string;
    productPrice: PriceDictionary;
    productImage: string;
    productVariantImage: string | null;
    productId: string;
    productVariantId: string | null;
    countryCode: string;
}

interface StoreData {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    default_currency_code: string;
    swap_link_template: string | null;
    payment_link_template: string | null;
    invite_link_template: string | null;
    default_location_id: string | null;
    metadata: Record<string, any> | null;
    default_sales_channel_id: string | null;
    owner_id: string;
    massmarket_store_id: string | null;
    store_description: string;
    store_followers: number;
    massmarket_keycard: string | null;
    icon: string;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
    productData,
    productDescription,
    productPrice,
    productId,
    productImage,
    productVariantImage,
    productVariantId,
    countryCode,
}) => {
    const { data, error, isLoading, isFetching } = useQuery(
        ['wishlist', productVariantId], // Use the variant ID directly as part of the query key
        async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/product/inventory?variant_id=${productVariantId}`;
            const response = await axios.get(url);
            return response.data; // Return only the data part of the response
        },
        {
            enabled: !!productVariantId, // Ensure the query only runs if productVarientId is defined
        }
    );

    console.log(`VARIANT THUMB ${productVariantImage}`);

    // Shot in the dark, I can't even simulate this...
    const queryClient = useQueryClient();
    useEffect(() => {
        resetCard();
    }, [productVariantId]);

    const resetCard = async () => {
        if (productVariantId !== null && isFetching)
            await queryClient.resetQueries(['wishlist']);
    };

    // Get inventory data
    const productInventory = data?.data ?? 0;

    // Zustand States
    const { preferred_currency_code } = useCustomerAuthStore();
    const { removeWishlistItemMutation } = useWishlistMutations();

    // Open Add To Cart Success Modal
    const [cartModalOpen, setCartModalOpen] = useState(false);

    const currencyCode = preferred_currency_code ?? 'usdc';
    const [storeData, setStoreData] = useState<StoreData>();
    const [loading, setLoading] = useState(true);

    // Get store data by product_id
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const data = await getStore(productId);
                setStoreData(data);
            } catch (error) {
                console.error('Error fetching store data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [productId]);

    // Add wishlist product to cart
    const handleAddToCart = async (showPopup: boolean = true) => {
        if (!productVariantId) {
            console.error('Variant is null or undefined.');
            return;
        }

        try {
            await addToCart({
                variantId: productVariantId!,
                quantity: 1,
                countryCode: countryCode,
            });
            if (showPopup) {
                setCartModalOpen(true);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (isLoading || loading) {
        return (
            <Flex maxWidth={'879px'} width={'100%'} flexDir={'column'}>
                <Flex height={'176px'} flexDir={'column'}>
                    <Flex flexDir={'column'} gap={21} flex={1}>
                        <Flex flexDir={'row'}>
                            <SkeletonCircle size={'32px'} />
                            <Box flex="1" ml="1rem" alignSelf={'center'}>
                                <SkeletonText
                                    noOfLines={1}
                                    spacing="4"
                                    alignSelf={'center'}
                                    skeletonHeight="2"
                                    width="150px"
                                />
                            </Box>
                        </Flex>
                        <Flex flexDir={'row'}>
                            {/* Product image and Description */}
                            <Skeleton
                                height="75px"
                                width="75px"
                                borderRadius="8px"
                            />
                            <SkeletonText
                                ml="1rem"
                                alignSelf={'center'}
                                noOfLines={2}
                                spacing="4"
                                width="300px"
                            />

                            {/* Currency Icon and Price */}
                            <Flex ml="auto" alignSelf={'center'}>
                                <SkeletonCircle size="20px" />
                                <SkeletonText
                                    ml="0.5rem"
                                    noOfLines={1}
                                    spacing="4"
                                    alignSelf={'center'}
                                    skeletonHeight="2"
                                    width="50px"
                                />
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Add To Cart */}
                    <Flex>
                        <SkeletonText
                            alignSelf={'center'}
                            noOfLines={1}
                            spacing="4"
                            width="120px"
                        />
                        <Skeleton
                            ml="auto"
                            height={'36px'}
                            width={'145px'}
                            borderRadius={'full'}
                        />
                        <Flex
                            ml="1rem"
                            alignSelf={'center'}
                            cursor={'pointer'}
                            color="red"
                        >
                            <SkeletonCircle size="36px" />
                        </Flex>
                    </Flex>
                </Flex>
                <Divider mt="1rem" borderColor={'#555555'} />
            </Flex>
        );
    }

    return (
        <Flex maxWidth={'879px'} width={'100%'} flexDir={'column'}>
            <Flex height={'176px'} flexDir={'column'}>
                <Flex flexDir={'column'} gap={21} flex={1}>
                    <Flex flexDir={'row'}>
                        <ChakraImage
                            src={storeData?.icon}
                            alt={storeData?.icon}
                            width={{ base: '20px', md: '32px' }}
                            height={{ base: '20px', md: '32px' }}
                            borderRadius={'full'}
                            objectFit={'cover'}
                        />
                        <Text
                            ml="1rem"
                            fontSize={{ base: '12px', md: '16px' }}
                            alignSelf={'center'}
                        >
                            {storeData?.name}
                        </Text>
                        <LuBadgeCheck
                            className={'ml-2 self-center'}
                            color="#3196DF"
                            size={'16.35px'}
                        />
                    </Flex>
                    <Flex
                        flexDir={'row'}
                        // align="center"
                        // justify="space-between"
                        width="100%"
                    >
                        {/* Product image and Description */}
                        <LocalizedClientLink
                            className={"w-['75px'] h-['75px']"}
                            href={`/products/${productData.handle}`}
                        >
                            <ChakraImage
                                src={productVariantImage ?? productImage}
                                alt={productImage}
                                maxWidth={'75px'}
                                width={'75px'}
                                height={'75px'}
                                objectFit={'cover'}
                                style={{ borderRadius: '8px' }}
                            />
                        </LocalizedClientLink>
                        <Text
                            ml="1rem"
                            mb={{ base: 'auto', md: '0px' }}
                            alignSelf={{ base: 'normal', md: 'center' }}
                            fontSize={{ base: '14px', md: '18px' }}
                            fontWeight={700}
                            overflow={'hidden'}
                            text-overflow={'ellipsis'}
                            noOfLines={2}
                            maxWidth={{ base: '100%', md: '50%' }}
                        >
                            {productDescription}
                        </Text>

                        {/* Currency Icon and Price */}
                        <Flex
                            ml="auto"
                            justifyContent={'center'}
                            alignItems={'center'}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            <Image
                                className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]  mr-2"
                                src={currencyIcons[currencyCode ?? 'usdc']}
                                alt={currencyCode}
                            />

                            <Flex height={'22px'} alignItems={'center'}>
                                <Text
                                    color={'white'}
                                    fontSize={{ base: '14px', md: '24px' }}
                                    lineHeight={{ base: '14px', md: '24px' }}
                                    display="inline-block"
                                    fontWeight={700}
                                >
                                    {formatCryptoPrice(
                                        Number(productPrice),
                                        currencyCode ?? 'usdc'
                                    )}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                {/* Add To Cart */}
                <Flex>
                    <Text
                        alignSelf={'center'}
                        display={{ base: 'none', md: 'block' }}
                    >
                        <Badge
                            backgroundColor={
                                productInventory < 1
                                    ? 'primary.yellow.900'
                                    : 'primary.green.900'
                            }
                            color={'black'}
                            borderRadius="full"
                            px="2"
                            py="1"
                            fontSize={{ base: '10px', md: '0.8rem' }}
                            textTransform="capitalize"
                        >
                            {productInventory < 1
                                ? 'Out Of Stock'
                                : `${productInventory} in stock`}
                        </Badge>
                    </Text>

                    <Flex
                        justifyContent={'center'}
                        alignItems={'center'}
                        display={{ base: 'flex', md: 'none' }}
                    >
                        <Image
                            className="h-[22px] w-[22px] md:h-[20px] md:w-[20px]  mr-2"
                            src={currencyIcons[currencyCode ?? 'usdc']}
                            alt={currencyCode}
                            layout="fixed"
                        />

                        <Flex height={'22px'} alignItems={'center'}>
                            <Text
                                color={'white'}
                                alignSelf={'center'}
                                fontSize={{ base: '20px', md: '24px' }}
                                lineHeight={{ base: '20px', md: '24px' }}
                                fontWeight={700}
                            >
                                {formatCryptoPrice(
                                    Number(productPrice),
                                    currencyCode ?? 'usdc'
                                )}
                            </Text>
                        </Flex>
                    </Flex>

                    <Button
                        ml="auto"
                        height={'42px'}
                        backgroundColor={'transparent'}
                        borderWidth={'1px'}
                        borderColor={'white'}
                        color={'white'}
                        borderRadius={'full'}
                        isDisabled={productInventory < 1}
                        onClick={() => handleAddToCart()}
                    >
                        Add to Cart
                    </Button>
                    <Flex
                        ml="0.75rem"
                        alignSelf={'center'}
                        cursor={'pointer'}
                        color="red"
                        borderWidth={'1px'}
                        borderRadius={'full'}
                        padding="5px"
                        borderColor={'red'}
                        _hover={{
                            color: 'white',
                            borderColor: 'white',
                        }}
                        onClick={() => {
                            removeWishlistItemMutation.mutate({
                                id: productData.id,
                                description: productData.description,
                                handle: productData.handle,
                                thumbnail: productData.thumbnail,
                                variantThumbnail: productData.variantThumbnail,
                                title: productData.title,
                                price: productPrice,
                                productVariantId: productVariantId,
                            });
                        }}
                    >
                        <Trash />
                    </Flex>
                </Flex>
            </Flex>

            <Divider mt="1rem" borderColor={'#555555'} />
            <CartPopup
                open={cartModalOpen}
                productName={productData.title}
                closeModal={() => {
                    setCartModalOpen(false);
                }}
            />
        </Flex>
    );
};

export default WishlistCard;
