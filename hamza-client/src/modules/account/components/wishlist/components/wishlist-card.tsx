import React from 'react';
import { Flex, Text, Image, Button } from '@chakra-ui/react';

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
                    <Image
                        src={productImage}
                        alt={productImage}
                        width={'35px'}
                        height={'35px'}
                    />
                    <Text ml="1rem" alignSelf={'center'}>
                        {productDescription}
                    </Text>

                    {/* Price */}
                    <Text ml={'auto'} alignSelf={'center'}>
                        {productPrice}
                    </Text>
                </Flex>
            </Flex>

            <Flex ml="auto">
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
