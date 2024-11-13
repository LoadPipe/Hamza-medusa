// src/modules/checkout/components/CheckoutWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import HamzaLogoLoader from '@/app/components/loaders/hamza-logo-loader';
import CheckoutTemplate from '@/modules/checkout/templates';
import ForceWalletConnect from '@/app/components/loaders/force-wallet-connect';

interface CheckoutWrapperProps {
    cart: any;
    cartId: string;
}

const CheckoutWrapper: React.FC<CheckoutWrapperProps> = ({ cart, cartId }) => {
    const [isCartReady, setIsCartReady] = useState(false);

    useEffect(() => {
        if (cart && cart.customer_id && cart.items.length) {
            // Simulate delay for data loading if necessary
            setIsCartReady(true);
        }
    }, [cart]);

    if (!isCartReady) {
        return <HamzaLogoLoader />;
    }

    return (
        <Flex flexDir="row" maxW={'1280px'} width={'100%'}>
            {!cart.customer_id ? (
                <ForceWalletConnect />
            ) : (
                <CheckoutTemplate cart={cart} cartId={cartId} />
            )}
        </Flex>
    );
};

export default CheckoutWrapper;
