import { Metadata } from 'next';
import { getAllProducts } from '@lib/data';
import { getRegion } from 'app/actions';
import SearchAndFilterPanel from '@modules/home/components/search-and-filter-panel';
import { Box } from '@chakra-ui/react';
import HeroBanner from '@modules/home/components/hero-banner';
import HamzaLogoLoader from '../../components/loaders/hamza-logo-loader';
import getQueryClient from '@/app/getQueryClient';
import { dehydrate } from '@tanstack/react-query';

// Author; Garo Nazarian
// First working version of hydration, this one is a bit tricky with
// tanstack v4
// https://tanstack.com/query/v4/docs/framework/react/guides/ssr

export const metadata: Metadata = {
    title: 'Hamza Store',
    description: 'Buy & Sell Products Using Crypto as a Community',
};

export default async function Home({
    params: { countryCode },
}: {
    params: { countryCode: string };
}) {
    const region = await getRegion(countryCode);

    const queryClient = new getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['homeProducts'],
        queryFn: getAllProducts,
    });

    const dehydratedHomeProducts = dehydrate(queryClient);

    if (!region) {
        return null;
    }

    return (
        <Box backgroundColor={'transparent'}>
            <HeroBanner />
            <SearchAndFilterPanel dehydratedState={dehydratedHomeProducts} />
        </Box>
    );
}
