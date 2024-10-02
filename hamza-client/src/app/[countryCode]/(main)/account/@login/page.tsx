import { Metadata } from 'next';

import LoginTemplate from '@modules/account/templates/login-template';
import { Text, Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import connect_wallet from '../../../../../../public/images/wallet_connect/connect_wallet.webp';
import React from 'react';
export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to your Medusa Store account.',
};

export default function Login() {
    return (
        <Flex direction="column" align="center" justify="center" padding={4}>
            <Box
                width="400px"
                height="400px"
                position="relative"
                marginBottom={8}
            >
                <Image
                    src={connect_wallet}
                    alt="Connect wallet illustration"
                    layout="fill"
                    objectFit="contain"
                />
            </Box>
            <Text
                color={'white'}
                textAlign={'center'}
                fontSize="xl"
                fontWeight="bold"
                padding={2}
            >
                Attach thy purse to yon network, that thou mayst enter thine own
                account's chamber.
            </Text>
        </Flex>
    );
}
