// src/modules/checkout/ConnectionStatusCheck.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDefaultShippingMethod } from '@/lib/data';
interface ConnectionStatusCheckProps {
    cart: {
        shipping_address?: any;
        id: string;
        shipping_methods: string;
        customer_id: string;
    };
}

const ConnectionStatusCheck: React.FC<ConnectionStatusCheckProps> = ({
    cart,
}) => {
    const router = useRouter();

    useEffect(() => {
        const delay = setTimeout(() => {
            // If not connected, redirect to connect wallet
            if (!cart.customer_id) {
                router.replace('/checkout?connected=false');
            }

            if (cart.customer_id) {
                if (cart.shipping_address === null) {
                    router.replace(`/checkout?connected=true&step=address`);
                }
                // If connected, determine step based on the presence of a shipping address
                else if (cart.shipping_address) {
                    if (cart.shipping_methods.length === 0) {
                        addDefaultShippingMethod(cart.id);
                        router.replace(
                            `/checkout?connected=true&step=review&cart=${cart.id}`
                        );
                    } else {
                        router.replace(
                            `/checkout?connected=true&step=review&cart=${cart.id}`
                        );
                    }
                }
            }
        }, 500); // Delay to allow resources to load

        return () => clearTimeout(delay);
    }, [router, cart]);

    return null;
};

export default ConnectionStatusCheck;
