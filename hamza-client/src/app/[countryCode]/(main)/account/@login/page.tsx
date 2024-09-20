import { Metadata } from 'next';

import LoginTemplate from '@modules/account/templates/login-template';
import { Text, Box, Flex } from '@chakra-ui/react';

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to your Medusa Store account.',
};

export default function Login() {
    return (
        <>
            <Text color={'white'} textAlign={'center'}>
                Connect your wallet to sign in.
            </Text>
        </>
    );
}
