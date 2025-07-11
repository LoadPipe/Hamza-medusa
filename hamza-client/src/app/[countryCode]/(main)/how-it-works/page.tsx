import { Metadata } from 'next';
import { Box } from '@chakra-ui/react';
import HowItWorksTemplate from '@/modules/landing-pages/how-it-works';

export const metadata: Metadata = {
    title: 'Buy Gift Cards with Cryptocurrency | Hamza',
    description:
        'Shop gift cards from top brands using Bitcoin, Ethereum, and other cryptocurrencies. Secure payments, instant delivery, worldwide access.',
    keywords:
        'gift cards, cryptocurrency, bitcoin, ethereum, crypto payments, digital gift cards, instant delivery',
    openGraph: {
        title: 'Buy Gift Cards with Cryptocurrency | Hamza',
        description:
            'Shop gift cards from top brands using Bitcoin, Ethereum, and other cryptocurrencies. Secure payments, instant delivery, worldwide access.',
        type: 'website',
    },
};

type Params = {
    params: {
        countryCode: string;
    };
};

export default async function HowItWorksPage({ params }: Params) {
    return (
        <Box
            style={{
                background:
                    'linear-gradient(to bottom, #020202 0%, #1a1a1a 100%)',
                minHeight: '100vh',
            }}
        >
            <HowItWorksTemplate />
        </Box>
    );
}
