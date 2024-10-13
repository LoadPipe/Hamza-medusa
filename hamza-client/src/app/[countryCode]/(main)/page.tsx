import { Metadata } from 'next';
import { getAllProducts } from '@lib/data';
import { getRegion } from 'app/actions';
import SearchAndFilterPanel from '@modules/home/components/search-and-filter-panel';
import { Box } from '@chakra-ui/react';
import HeroBanner from '@modules/home/components/hero-banner';
import HamzaLogoLoader from '../../components/loaders/hamza-logo-loader';
import getQueryClient from '@/app/getQueryClient';
import { dehydrate } from '@tanstack/react-query';

/**
 * Author: Garo Nazarian
 *
 * This component demonstrates the first working implementation of hydration
 * using TanStack Query v4 in a Next.js application. Hydration allows server-side
 * prefetching of data, which is then passed to the client-side to avoid unnecessary
 * network requests and improve performance.
 *
 * The approach involves:
 * 1. **Server-Side Data Fetching (SSR)**: Data is fetched on the server using
 *    TanStack Query's `prefetchQuery` method.
 *
 * 2. **Dehydration**: After the server fetch, the query cache is dehydrated using
 *    `dehydrate` and passed to the client-side as `dehydratedState`.
 *
 * 3. **Client-Side Hydration**: On the client-side, the `Hydrate` component rehydrates
 *    the query cache with the pre-fetched data, allowing client components to use
 *    `useQuery` without refetching the same data.
 *
 * TanStack Query v4 documentation:
 * https://tanstack.com/query/v4/docs/framework/react/guides/ssr
 *
 * This setup optimizes performance by ensuring that data is fetched server-side and
 * reused client-side, improving both user experience and load times.
 */

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
