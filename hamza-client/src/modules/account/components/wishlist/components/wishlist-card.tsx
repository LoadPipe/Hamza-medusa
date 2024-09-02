import React, { useEffect, useState } from 'react';
import {
    Flex,
    Text,
    Image as ChakraImage,
    Button,
    Divider,
} from '@chakra-ui/react';
import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { getStore } from '@lib/data';
import { addToCart } from '@modules/cart/actions';
import CartPopup from '@modules/products/components/cart-popup';

interface WishlistCardProps {
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
    productDescription,
    productPrice,
    productId,
    productImage,
    productVarientId,
    countryCode,
}) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const currencyCode = preferred_currency_code ?? 'usdc';
    const [storeData, setStoreData] = useState<StoreData>();

    // Open Add To Cart Success Modal
    const [cartModalOpen, setCartModalOpen] = useState(false);

    // Get store data by product_id
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const data = await getStore(productId);
                setStoreData(data);
            } catch (error) {
                console.error('Error fetching store data:', error);
            }
        };

        fetchStoreData();
    }, [productId]);

    // Add wishlist product to cart
    const handleAddToCart = async () => {
        try {
            await addToCart({
                variantId: productVarientId!,
                quantity: 1,
                countryCode: countryCode,
                currencyCode: currencyCode,
            });
            setCartModalOpen(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

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

                <Flex ml="auto">
                    {/* Add To Cart */}
                    <Button
                        width={'145px'}
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
