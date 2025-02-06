'use client';

import { Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { CheckoutWalletButton } from './components/checkout-wallet-button';

interface HamzaLogoLoaderProps {
    message?: string;
    messages?: string[];
    textAnimOptions?: { base_speed: number };
}

const ForceWalletConnect: React.FC<HamzaLogoLoaderProps> = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Delay showing the component to prevent flash
        const timer = setTimeout(() => setShow(true), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null; // Don't render anything until delay is over

    return (
        <Box>
            <CheckoutWalletButton />
        </Box>
    );
};

export default ForceWalletConnect;
