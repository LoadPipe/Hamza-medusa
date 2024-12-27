'use client';

import { Box } from '@chakra-ui/react';
import React from 'react';
import { CheckoutWalletButton } from './components/checkout-wallet-button';

interface HamzaLogoLoaderProps {
    message?: string; // Optional message prop
    messages?: string[]; // Array of messages for rotating text
    textAnimOptions?: { base_speed: number }; // Text animation options
}

const ForceWalletConnect: React.FC<HamzaLogoLoaderProps> = ({}) => {
    return (
        <Box>
            <CheckoutWalletButton />
        </Box>
    );
};

export default ForceWalletConnect;
