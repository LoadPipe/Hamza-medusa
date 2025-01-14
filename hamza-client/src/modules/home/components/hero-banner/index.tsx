'use client';

import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Link } from '@chakra-ui/react';

const HeroBanner = () => {
    return (
        <>
            <Flex
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'column'}
            >
                <Flex
                    w="100%"
                    bg="secondary.charcoal.90"
                    color="white"
                    py={2}
                    mb={4}
                    justifyContent="center"
                    alignItems="center"
                    style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }}
                >
                    <Link href="https://blog.hamza.market/beta" isExternal>
                        <Text
                            fontSize={{ base: '12px', md: '16px' }}
                            textAlign={'center'}
                            fontWeight="semi-bold"
                            textColor={'white'}
                        >
                            Hamza Beta Ship - Setting Sail. Join Us In The
                            Journey to Decentralize Ecommerce Unveiling 3
                            game-changing Hamza features that redefine
                            e-commerce —{' '}
                            <Text
                                as="span"
                                color="cyan.300"
                                textDecoration="underline"
                            >
                                learn more!
                            </Text>
                        </Text>
                    </Link>
                </Flex>
            </Flex>
        </>
    );
};

export default HeroBanner;
