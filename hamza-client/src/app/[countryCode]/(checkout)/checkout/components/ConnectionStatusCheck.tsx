'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDefaultShippingMethod } from '@/lib/data';
import ForceWalletConnect from '@/app/components/loaders/force-wallet-connect';

interface ConnectionStatusCheckProps {
    cart: {
        shipping_address?: any;
        id: string;
        shipping_methods: string;
        customer_id: string;
    };
    connected: boolean;
}

const ConnectionStatusCheck: React.FC<ConnectionStatusCheckProps> = ({
    cart,
    connected,
}) => {
    const router = useRouter();

    useEffect(() => {
        if (!cart.customer_id) {
            router.replace('/checkout?connected=false');
        }
    }, [router, cart]);

    // Render ForceWalletConnect if no customer_id
    if (!cart.customer_id) {
        return <ForceWalletConnect />;
    }

    return null;
};

export default ConnectionStatusCheck;

/*
   if (cart.customer_id) {
            if (cart.shipping_address === null) {
                router.replace(`/checkout?connected=true&step=address`);
            }
            // If connected, determine step based on the presence of a shipping address
            else if (cart.shipping_address) {
                if (cart.shipping_methods.length === 0) {
                    // addDefaultShippingMethod(cart.id);
                    router.replace(
                        `/checkout?connected=true&step=review&cart=${cart.id}`
                    );
                } else {
                    router.replace(
                        `/checkout?connected=true&step=review&cart=${cart.id}`
                    );
                }
            }


*/
