import { Metadata } from 'next';
import { Box } from '@chakra-ui/react';
import StartSellingTemplate from '@/modules/start-selling';

export const metadata: Metadata = {
    title: 'Sell on Hamza - Join the Decentralized Marketplace | Hamza',
    description: 'Start selling on Hamza marketplace with cryptocurrency payments. Lower fees, instant payments, global reach. Join thousands of successful sellers today.',
    keywords: 'sell online, cryptocurrency marketplace, bitcoin payments, ethereum, crypto seller, decentralized marketplace, low fees, instant payments, global selling',
    openGraph: {
        title: 'Sell on Hamza - Join the Decentralized Marketplace | Hamza',
        description: 'Start selling on Hamza marketplace with cryptocurrency payments. Lower fees, instant payments, global reach. Join thousands of successful sellers today.',
        type: 'website',
    },
};

type Params = {
    params: {
        countryCode: string;
    };
};

export default async function StartSellingPage({ params }: Params) {
    return (
        <Box
            style={{
                background: 'linear-gradient(to bottom, #020202 0%, #1a1a1a 100%)',
                minHeight: '100vh',
            }}
        >
            <StartSellingTemplate />
        </Box>
    );
}