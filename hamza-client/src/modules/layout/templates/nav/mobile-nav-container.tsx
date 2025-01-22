'use client';

import { Flex } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export default function MobileNavContainer(props: {
    children: React.ReactNode;
}) {
    const pathname = usePathname(); // Get the current route

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
                md: 'none',
            }}
        >
            {props.children}
        </Flex>
    );
}
