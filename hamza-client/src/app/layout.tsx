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
                {/* Google Tag Manager Script */}
                <Script
                    id="google-tag-manager"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-W9HPPFG3');
                        `,
                    }}
                />

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
                        {' '}
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
                </div>
            </body>
        </html>
    );
}
