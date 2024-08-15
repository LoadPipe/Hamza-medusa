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
                    bg="primary.indigo.900"
                    color="white"
                    py={2}
                    mb={4}
                    justifyContent="center"
                    alignItems="center"
                    style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }}
                >
                    <Link href="https://blog.hamza.biz/alpha-ship" isExternal>
                        <Text
                            fontSize={{ base: '12px', md: '16px' }}
                            textAlign={'center'}
                            fontWeight="bold"
                        >
                            Alpha Ship! Join our Ambassador Program To Join
                            Apply Here:{' '}
                            <Text
                                as="span"
                                color="cyan.300"
                                textDecoration="underline"
                            >
                                https://blog.hamza.biz/alpha-ship
                            </Text>
                        </Text>
                    </Link>
                </Flex>
                <Flex
                    mt="2rem"
                    gap={{ base: '0', md: '10px' }}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={{ base: 'column', md: 'row' }}
                >
                    <Text
                        color={'#FBFDFA'}
                        fontWeight={'200'}
                        fontSize={{ base: '24px', md: '32px' }}
                    >
                        The
                    </Text>
                    <Text
                        mt={{ base: '-0.5rem', md: '0' }}
                        fontWeight={'200'}
                        color={'#FBFDFA'}
                        fontSize={{ base: '24px', md: '32px' }}
                    >
                        <span style={{ color: '#7B61FF', fontWeight: '700' }}>
                            <b>World's First</b>
                        </span>{' '}
                        Decom Marketplace
                    </Text>
                </Flex>
                <b />
                <Flex
                    mt={{ base: '0.5rem', md: '0' }}
                    gap={{ base: '0', md: '10px' }}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={{
                        base: 'column',
                        md: 'row',
                    }}
                >
                    <Flex gap={'10px'} color="primary.green.900">
                        <Text
                            flexDir={'row'}
                            color={'primary'}
                            fontWeight={'400'}
                            fontSize={{ base: '16px', md: '24px' }}
                        >
                            <span style={{ color: 'white' }}>
                                Buy & Sell Products Using{' '}
                            </span>
                            Crypto
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
};

export default HeroBanner;
