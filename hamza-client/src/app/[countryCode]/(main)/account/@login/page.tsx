import { Metadata } from 'next';

import LoginTemplate from '@modules/account/templates/login-template';
import { Text } from '@chakra-ui/react';

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to your Medusa Store account.',
};

export default function Login() {
    return (
        <div>
            <Text color={'white'}>Connect your wallet to sign in.</Text>
        </div>
    );
}
