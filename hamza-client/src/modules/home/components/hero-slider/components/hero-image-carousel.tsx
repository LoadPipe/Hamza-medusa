import React from 'react';
import {
    Flex,
    Text,
    Button,
    Box,
    Link,
    Image as ChakraImage,
} from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import Image from 'next/image';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import router from 'next/router';

interface HeroImageCarouselProps {
    imgSrc: string;
    categoryTitle: string;
    description: string;
    price: string;
    productData: any;
}

const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({
    imgSrc,
    categoryTitle,
    description,
    price,
    productData,
}) => {
    const handleClick = () => {
        // Navigate to the product page after state update
        router.push(`/products/${productData.product.handle}`);
    };

    const { preferred_currency_code } = useCustomerAuthStore();
    return (
        <Flex width={'100%'} flexDir={'column'} alignSelf={'center'} gap={2}>
            <Text color={'white'}>
                Featured Product:{' '}
                <Link onClick={handleClick} color={'primary.green.900'}>
                    {categoryTitle}
                </Link>
            </Text>
            <Flex
                bgColor={'red'}
                borderRadius={'16px'}
                maxWidth={'622px'}
                height={'295px'}
                bgColor={'#121212'}
            >
                <ChakraImage
                    src={imgSrc}
                    alt={imgSrc}
                    height={'295px'}
                    width={'295px'}
                    bgColor={'white'}
                    borderLeftRadius={'16px'}
                />
                <Flex flexDir={'column'} p={4} gap={2} alignSelf={'center'}>
                    <Text color={'white'} noOfLines={4}>
                        {description}
                    </Text>
                    <Flex flexDir={'row'} alignItems={'center'} gap={2}>
                        <Image
                            className="h-[18px] w-[18px] md:h-[20px] md:w-[20px]"
                            src={
                                currencyIcons[preferred_currency_code ?? 'usdc']
                            }
                            alt={preferred_currency_code ?? 'usdc'}
                        />
                        <Text
                            color={'white'}
                            fontSize={'20px'}
                            fontWeight="bold"
                        >
                            {price}
                        </Text>
                    </Flex>
                    <Box
                        bgColor={'#272727'}
                        borderRadius={'full'}
                        px={3} // Padding for horizontal space
                        py={1} // Padding for vertical space
                        display="inline-block" // Ensures the box only wraps the text
                        mt={2} // Adds spacing above the box
                        maxWidth="fit-content" // Ensures it doesn't expand unnecessarily
                    >
                        <Text color={'white'} fontSize={'12px'}>
                            {categoryTitle}
                        </Text>
                    </Box>
                </Flex>
            </Flex>
            <Text color={'white'} fontStyle={'italic'}>
                The product is on sale. Buy now and grab a great discount!
            </Text>
        </Flex>
    );
};

export default HeroImageCarousel;
