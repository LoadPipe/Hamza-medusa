'use client';

import { clearCart } from '@/lib/data';
import { getOrSetCart } from '@/modules/cart/actions';
import { Flex } from '@chakra-ui/react';
import { Cart } from '@medusajs/medusa';
import { usePathname } from 'next/navigation';

export default function MobileNavContainer(props: {
    children: React.ReactNode;
    cart?: Cart;
}) {
    const pathname = usePathname(); // Get the current route

    /*
    // clearCart management
    if (props.cart && props.cart?.completed_at !== null) {
        let countryCode = 'en';
        if (process.env.NEXT_PUBLIC_FORCE_COUNTRY) {
            countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;
        }
        clearCart();
        getOrSetCart(countryCode);
    }
    */

    return (
        <Flex
            userSelect="none"
            zIndex="2"
            className="sticky top-0"
            width="100%"
            height={{ base: '60px', md: '125px' }}
            justifyContent="center"
            alignItems="center"
            backgroundColor="#020202"
            display={{
                base: pathname.includes('/products') ? 'none' : 'flex',
                md: 'flex',
            }}
        >
            {props.children}
        </Flex>
    );
}
