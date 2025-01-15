'use client';
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import hns from '../../../../../public/images/reputation/footer-logo-handshake.png';
import cbs from '../../../../../public/images/reputation/footer-logo-cross-border-summit.png';
import ethlondon from '../../../../../public/images/reputation/footer-logo-ethglobal-london.png';
import ethglobal from '../../../../../public/images/reputation/footer-logo-ethglobal.png';
import Image from 'next/image';

const imageStyles = {
    width: "160px",
    filter: 'hue-rotate(186deg) brightness(90%) contrast(90%)',
    height: 'fit-content !important' as const,
};

const Reputation = () => {
    return (
        <Box
            bg="transparent"
            mt={6}
            p={5}
            display="flex"
            flexDirection="column"
            alignItems="center"
            className="w-full font-sora"
        >
            <Text
                fontWeight="bold"
                className="text-xs font-bold leading-6 tracking-wider text-center"
                color="#FFF"
                mb={5}
            >
                AS SEEN IN
            </Text>
            <Flex gap={'51'} justifyContent="center" alignItems="center" mb={6}>
                <Image
                    src={ethlondon}
                    alt={'ETH London'}
                    style={imageStyles}
                />
                <Image
                    src={ethglobal}
                    alt={'ETH Global'}
                    style={imageStyles}
                />
                <Image
                    src={cbs}
                    alt={'Cross Border Summit'}
                    style={imageStyles}
                />
                <Image
                    src={hns}
                    alt={'Handshake Conference'}
                    style={imageStyles}
                />
            </Flex>
        </Box>
    );
};

export default Reputation;
