'use client';

import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { SwitchNetwork } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';

const enableSwitch: boolean =
    process.env.NEXT_PUBLIC_FORCE_SWITCH_BLOCKCHAIN == '1';

const HeroBanner = () => {
    return (
        <>
            <SwitchNetwork />
            <Flex
                mt="2rem"
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'column'}
            >
                <Flex
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
                        Buy & Sell Products Using
                    </Text>
                    <Text
                        mt={{ base: '-0.5rem', md: '0' }}
                        fontWeight={'200'}
                        color={'#FBFDFA'}
                        fontSize={{ base: '24px', md: '32px' }}
                    >
                        <span style={{ color: '#7B61FF', fontWeight: '700' }}>
                            <b>Crypto</b>
                        </span>{' '}
                        as a Community
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
                    <Flex gap={'10px'}>
                        <Text
                            color={'#FBFDFA'}
                            fontWeight={'400'}
                            fontSize={{ base: '16px', md: '20px' }}
                        >
                            By The <b>People</b>
                        </Text>
                        <Box
                            fontSize={{ base: '21px', md: '24px' }}
                            alignSelf="center"
                        >
                            <FaArrowRightLong color="#FBFDFA" />
                        </Box>
                    </Flex>
                    <Text
                        color={'#FBFDFA'}
                        fontWeight={'400'}
                        fontSize={{ base: '16px', md: '20px' }}
                    >
                        For The <b>People</b> Using Blockchain Tech
                    </Text>
                </Flex>
            </Flex>
        </>
    );
};

export default HeroBanner;
