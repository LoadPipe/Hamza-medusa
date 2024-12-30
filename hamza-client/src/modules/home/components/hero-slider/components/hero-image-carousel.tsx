import React from 'react';
import { Flex, Text, Button, Image, Link } from '@chakra-ui/react';

interface HeroImageCarouselProps {
    imgSrc: string;
    categoryTitle: string;
    description: string;
}

const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({
    imgSrc,
    categoryTitle,
    description,
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
                width={'622px'}
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
            </Flex>
            <Text color={'white'} fontStyle={'italic'}>
                The product is on sale. Buy now and grab a great discount!
            </Text>
        </Flex>
    );
};

export default HeroImageCarousel;
