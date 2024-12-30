import React from 'react';
import { Flex, Text, Button, Image } from '@chakra-ui/react';
import HeroImageCarousel from './components/hero-image-carousel';

const HeroSlider = () => {
    return (
        <Flex
            maxW={'1280px'}
            height={'685px'}
            justifyContent={'center'}
            flexDir={'row'}
            paddingX={'50px'}
            paddingY={'62px'}
            mx="auto"
        >
            <Flex width={'100%'} flexDir={'column'} gap={2}>
                <Text color={'white'} fontSize={'56px'} lineHeight={1.2}>
                    The World's first{' '}
                    <Text as={'span'} color={'primary.green.900'}>
                        decentralized commerce
                    </Text>{' '}
                    marketplace
                </Text>
                <Text fontSize={'24px'} color={'white'} maxW={'520px'}>
                    Discover the world’s first decentralized commerce
                    marketplace. Buy and sell directly, securely, and without
                    intermediaries, powered by blockchain. Join us in
                    revolutionizing digital trade.
                </Text>
                <Flex flexDir={'row'} gap={4} mt="2rem">
                    <Button rounded={'full'}>Start Shopping</Button>
                    <Button rounded={'full'}>Sell on Hamza</Button>
                </Flex>
            </Flex>
            <HeroImageCarousel categoryTitle={'Electronics'} />
        </Flex>
    );
};

export default HeroSlider;
