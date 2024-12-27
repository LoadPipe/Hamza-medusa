import { Metadata } from 'next';
import { Box } from '@chakra-ui/react';
import StoreContent from './components/store-content';

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const storeName = decodeURIComponent(params.slug);

    return {
        title: `${storeName} Seller Profile | Hamza Marketplace`,
        description: `Discover products and details about ${storeName} on Hamza Marketplace.`,
    };
}

export default async function StorePage({
    params,
}: {
    params: { slug: string };
}) {
    return (
        <Box>
            <StoreContent params={params} />
        </Box>
    );
}
