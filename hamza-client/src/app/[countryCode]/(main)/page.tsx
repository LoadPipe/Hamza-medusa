import { Metadata } from 'next';
import { getAllProducts } from '@lib/data';
import { getRegion } from 'app/actions';
import SearchAndFilterPanel from '@modules/home/components/search-and-filter-panel';
import { Box } from '@chakra-ui/react';
import HeroBanner from '@modules/home/components/hero-banner';
import HamzaLogoLoader from '../../components/loaders/hamza-logo-loader';

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
    const products = await getAllProducts();

    if (!region || !products) {
        return null;
    }

    return (
        <Box backgroundColor={'transparent'}>
            <HeroBanner />
            <SearchAndFilterPanel products={products} />
        </Box>
    );
}
