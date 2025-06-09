'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function SchemaMarkup() {
    const pathname = usePathname();
    const isRootPath = pathname === '/en';

    if (!isRootPath) return null;

    return (
        <Script
            id="schema-markup"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Hamza Market',
                    url: 'https://hamza.market',
                    contactPoint: [
                        {
                            '@type': 'ContactPoint',
                            email: 'contact@hamzamarket.com',
                            contactType: 'Customer Support',
                        },
                    ],
                    sameAs: ['https://discord.com/invite/JRxzu5ZYjp'],
                }),
            }}
        />
    );
}
