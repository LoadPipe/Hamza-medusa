'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { SwitchNetwork } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';

const HeroBanner = () => {
    //!!!Hydration fix causing hero text not to load instantly

    // const [opacity, setOpacity] = useState(1);

    // const [isHydrated, setIsHydrated] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollY = window.scrollY;
    //         const newOpacity = Math.max(0, 1 - scrollY / 200);
    //         setOpacity(newOpacity);
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    // useEffect(() => {
    //     setIsHydrated(true);
    // }, []);

    // if (!isHydrated) {
    //     return <></>;
    // }

    return (
        <>
            {/* <Flex
                display={{ base: 'none', md: 'flex' }}
                w="100%"
                bg="primary.indigo.900"
                color="white"
                py={2}
                mb={4}
                justifyContent="center"
                alignItems="center"
                style={{ opacity, transition: 'opacity 0.5s ease-out' }}
            >
                <Link href="https://blog.hamza.biz/affiliate/" isExternal>
                    <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                        Become an affiliate
                    </Text>
                </Link>
            </Flex> */}
            <SwitchNetwork enabled={false} />
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
