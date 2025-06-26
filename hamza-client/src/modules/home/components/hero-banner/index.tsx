'use client';

import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
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
                    bg="#181129"
                    color="white"
                    py={2}
                    px={4}
                    justifyContent="center"
                    alignItems="center"
                    style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }}
                >
                    <Link
                        href="https://blog.hamza.market/multichain-feature/"
                        isExternal
                    >
                        <Text
                            fontSize={{ base: '12px', md: '16px' }}
                            textAlign={'center'}
                            fontWeight="semi-bold"
                            textColor={'white'}
                        >
                            Shop Smarter with Hamza! Use Bitcoin, stablecoins,
                            and more — instantly. —{' '}
                            <Text
                                as="span"
                                color="cyan.300"
                                textDecoration="underline"
                            >
                                Learn more!
                            </Text>
                        </Text>
                    </Link>
                </Flex>
            </Flex>
        </>
    );
};

export default HeroBanner;
