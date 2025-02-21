import { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.css';
import { cookies } from 'next/headers';

const BASE_URL =
    process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL || 'https://localhost:8000';
import MedusaProvider from '@/components/providers/medusa/medusa-provider'; // Import MedusaProvider
import { RainbowWrapper } from '@/components/providers/rainbowkit/rainbow-provider';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import theme from '../styles/chakra-theme';
import { Toaster } from 'react-hot-toast';
import { Sora } from 'next/font/google';
import Script from 'next/script';
import FreeScoutWidget from './components/scripts/chat-widget';
import { GoogleTagManager } from '@next/third-parties/google';
export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
};

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function RootLayout(props: { children: React.ReactNode }) {
    // Retrieve token server-side
    const token = cookies().get('_medusa_jwt')?.value;

    return (
        <html lang="en" data-mode="dark">
            <head>
                {/* Klaviyo Script */}
                <Script
                    src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=S4Nw9L"
                    strategy="afterInteractive"
                />
            </head>
            <body>
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-W9HPPFG3"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>

                <div>
                    <MedusaProvider token={token}>
                        {/* Pass token as prop */}
                        <RainbowWrapper>
                            <ChakraProvider theme={theme}>
                                <main className={sora.className}>
                                    {props.children}
                                </main>
                            </ChakraProvider>
                        </RainbowWrapper>
                    </MedusaProvider>
                    <div>
                        <Toaster position="top-right" />
                    </div>
                    <FreeScoutWidget />
                </div>
            </body>
        </html>
    );
}
