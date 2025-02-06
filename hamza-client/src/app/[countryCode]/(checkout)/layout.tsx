import React from 'react';
import Nav from '@/modules/nav/templates/nav';
import Footer from '@/modules/nav/templates/footer';
import { Flex } from '@chakra-ui/react';

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                background:
                    'linear-gradient(to bottom, #020202 20vh, #2C272D 40vh)',
            }}
        >
            <Nav />
            <Flex
                justifyContent="center"
                style={{
                    background:
                        'linear-gradient(to bottom, #020202 20vh, #2C272D 40vh)',
                }}
            >
                {children}
            </Flex>
            <Footer />
        </div>
    );
}
