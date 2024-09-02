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
} from '@chakra-ui/react';
import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { getStore } from '@lib/data';
import { addToCart } from '@modules/cart/actions';
import CartPopup from '@modules/products/components/cart-popup';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';
import { WishlistProduct } from '@store/wishlist/wishlist-store';

interface WishlistCardProps {
    productData: WishlistProduct;
    productDescription: string;
    productPrice: string;
    productImage: string;
    productId: string;
    productVarientId: string | null;
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
    productVarientId,
    countryCode,
}) => {
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
        if (!productVarientId) {
            console.error('Variant is null or undefined.');
            return;
        }

        try {
            await addToCart({
                variantId: productVarientId!,
                quantity: 1,
                countryCode: countryCode,
                currencyCode: currencyCode,
            });
            if (showPopup) {
                setCartModalOpen(true);
                setTimeout(() => {
                    setCartModalOpen(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) {
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
                                <SkeletonCircle size="22px" />
                                <Skeleton
                                    ml="0.5rem"
                                    height="24px"
                                    width="100px"
                                />
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex ml="auto" flexDir={'row'}>
                        {/* Add To Cart & Remove from Wishlist Buttons */}
                        <Skeleton
                            height={'36px'}
                            width={'145px'}
                            borderRadius={'full'}
                        />
                        <Skeleton
                            ml="1rem"
                            height={'36px'}
                            width={'145px'}
                            borderRadius={'full'}
                        />
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
                            width={'32px'}
                            height={'32px'}
                            borderRadius={'full'}
                        />
                        <Text ml="1rem" alignSelf={'center'}>
                            {storeData?.name}
                        </Text>
                    </Flex>
                    <Flex flexDir={'row'}>
                        {/* Product image and Description */}
                        <ChakraImage
                            src={productImage}
                            alt={productImage}
                            width={'75px'}
                            height={'75px'}
                            style={{ borderRadius: '8px' }}
                        />
                        <Text
                            ml="1rem"
                            alignSelf={'center'}
                            fontSize={'18px'}
                            fontWeight={700}
                        >
                            {productDescription}
                        </Text>

                        {/* Currency Icon and Price */}
                        <Flex ml="auto" alignSelf={'center'}>
                            <Flex
                                height={'22px'}
                                alignItems={'center'}
                                mb="auto"
                            >
                                <Image
                                    className="h-[14px] w-[14px] md:h-[20px] md:w-[20px] self-center"
                                    src={currencyIcons[currencyCode]}
                                    alt={currencyCode}
                                />
                            </Flex>
                            <Flex
                                ml="0.5rem"
                                height={'22px'}
                                alignItems={'center'}
                            >
                                <Text
                                    color={'white'}
                                    alignSelf={'center'}
                                    fontSize={'24px'}
                                    fontWeight={700}
                                >
                                    {formatCryptoPrice(
                                        Number(productPrice),
                                        currencyCode
                                    )}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex ml="auto" flexDir={'row'}>
                    {/* Add To Cart */}
                    <Button
                        height={'36px'}
                        backgroundColor={'transparent'}
                        borderWidth={'1px'}
                        borderColor={'white'}
                        color={'white'}
                        borderRadius={'full'}
                        onClick={() => {
                            removeWishlistItemMutation.mutate({
                                id: productData.id,
                                description: productData.description,
                                handle: productData.handle,
                                thumbnail: productData.thumbnail,
                                title: productData.title,
                                price: productPrice || '',
                                productVarientId: productVarientId || null,
                            });
                        }}
                    >
                        Remove From Wishlist
                    </Button>
                    <Button
                        ml="1rem"
                        height={'36px'}
                        backgroundColor={'transparent'}
                        borderWidth={'1px'}
                        borderColor={'white'}
                        color={'white'}
                        borderRadius={'full'}
                        onClick={() => handleAddToCart()}
                    >
                        Add To Cart
                    </Button>
                </Flex>
            </Flex>
            <Divider mt="1rem" borderColor={'#555555'} />
            <CartPopup
                open={cartModalOpen}
                closeModal={() => {
                    setCartModalOpen(false);
                }}
            />
        </Flex>
    );
};

export default WishlistCard;
