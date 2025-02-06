import { Metadata } from 'next';
import { Box } from '@chakra-ui/react';
import StoreContent from '@/modules/store/templates/store-content';
import { redirect } from 'next/navigation';

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
    if (params.slug?.toLowerCase() === "stanzo's%203d%20prints")
        redirect('/en/store/onlyprints');

    //params.slug = 'onlyprints';
    return (
        <Box>
            <StoreContent params={params} />
        </Box>
    );
}
