'use client';

import { clearCart } from '@/lib/data';
import { getOrSetCart } from '@/modules/cart/actions';
import { Flex } from '@chakra-ui/react';
import { Cart } from '@medusajs/medusa';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function MobileNavContainer(props: {
    children: React.ReactNode;
    cart?: Cart;
}) {
    const pathname = usePathname();
    let countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY || 'en';
    
    useEffect(() => {
        const handleCartClear = async () => {
            if ((pathname.includes('/cart') || pathname.includes('/checkout')) && 
                props.cart?.completed_at !== null) {
                try {
                    await clearCart();
                    await getOrSetCart(countryCode);
                } catch (error) {
                    console.error("Error handling cart clear:", error);
                }
            }
        };
        
        handleCartClear();
    }, [pathname, props.cart, countryCode]);

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
