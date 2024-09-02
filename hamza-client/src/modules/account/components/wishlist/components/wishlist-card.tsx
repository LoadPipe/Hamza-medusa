import React from 'react';
import { Flex, Text, Image as ChakraImage, Button } from '@chakra-ui/react';
import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

interface WishlistCardProps {
    vendorThumbnail: string;
    vendorName: string;
    productDescription: string;
    productPrice: string;
    productImage: string;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
    vendorThumbnail,
    vendorName,
    productDescription,
    productPrice,
    productImage,
}) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const currencyCode = preferred_currency_code ?? 'usdc';
    return (
        <Flex
            maxWidth={'879px'}
            height={'176px'}
            width={'100%'}
            flexDir={'column'}
        >
            <Flex flexDir={'column'} gap={21} flex={1}>
                <Flex flexDir={'row'}>
                    <Text>{vendorThumbnail}</Text>
                    <Text ml="1rem">{vendorName}</Text>
                </Flex>
                <Flex flexDir={'row'}>
                    {/* Product image and Description */}
                    <ChakraImage
                        src={productImage}
                        alt={productImage}
                        width={'75px'}
                        height={'75px'}
                    />
                    <Text
                        ml="1rem"
                        alignSelf={'center'}
                        fontSize={'18px'}
                        fontWeight={700}
                    >
                        {productDescription}
                    </Text>

                    {/* Price */}
                    <Flex ml="auto" alignSelf={'center'}>
                        <Flex height={'22px'} alignItems={'center'} mb="auto">
                            <Image
                                className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                src={currencyIcons[currencyCode]}
                                alt={currencyCode}
                            />
                        </Flex>
                        <Flex ml="0.5rem" height={'22px'} alignItems={'center'}>
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
                >
                    Add To Cart
                </Button>
            </Flex>
        </Flex>
    );
};

export default WishlistCard;
