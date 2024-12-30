import React from 'react';
import { Flex, Text, Button, Box, Image, Link } from '@chakra-ui/react';

interface HeroImageCarouselProps {
    imgSrc: string;
    categoryTitle: string;
    description: string;
    price: string;
}

const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({
    imgSrc,
    categoryTitle,
    description,
    price,
}) => {
    return (
        <Flex width={'100%'} flexDir={'column'} alignSelf={'center'} gap={2}>
            <Text color={'white'}>
                Featured Products on{' '}
                <Link color={'primary.green.900'}>{categoryTitle}</Link>
            </Text>
            <Flex
                bgColor={'red'}
                borderRadius={'16px'}
                maxWidth={'622px'}
                height={'295px'}
                bgColor={'#121212'}
            >
                <Image
                    src={imgSrc}
                    alt={imgSrc}
                    height={'295px'}
                    width={'295px'}
                    bgColor={'white'}
                    borderLeftRadius={'16px'}
                />
                <Flex flexDir={'column'} p={4} gap={2} alignSelf={'center'}>
                    <Text color={'white'}>{description}</Text>
                    <Text
                        color={'white'}
                        fontSize={'20px'}
                        mt={4}
                        fontWeight="bold"
                    >
                        {price}
                    </Text>
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
