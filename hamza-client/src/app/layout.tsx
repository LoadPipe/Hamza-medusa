import { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.css';
import { cookies } from 'next/headers';

const BASE_URL =
    process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL || 'https://localhost:8000';
import MedusaProvider from '@/components/providers/medusa/medusa-provider';
import { RainbowWrapper } from '@/components/providers/rainbowkit/rainbow-provider';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/chakra-theme';
import { Toaster } from 'react-hot-toast';
import { Sora } from 'next/font/google';
import Script from 'next/script';
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
                {/* Google Tag Manager Script */}

                {/* Chat Widget Script */}
                <Script
                    id="freescout-widget"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.FreeScoutW = {
                                s: {
                                    "color": "#5ab334",
                                    "position": "br",
                                    "id": 2009307235
                                }
                            };
                            (function(d, e, s) {
                                if (d.getElementById("freescout-w")) return;
                                var a = d.createElement(e), m = d.getElementsByTagName(e)[0];
                                a.async = 1;
                                a.id = "freescout-w";
                                a.src = "https://support.hamza.market/modules/chat/js/widget.js?v=4239";
                                m.parentNode.insertBefore(a, m);
                            })(document, "script");
                        `,
                    }}
                />
                {/* Klaviyo Script */}
                <Script
                    src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=S4Nw9L"
                    strategy="afterInteractive"
                />
            </head>
            <GoogleTagManager gtmId="GTM-XYZ" />
            <body>
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
                </div>
            </body>
        </html>
    );
}
