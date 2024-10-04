import { Product } from '@medusajs/medusa';
import { Metadata } from 'next';
import { getCollectionsList, getProductsList } from '@lib/data';
import { getRegion } from 'app/actions';
import { ProductCollectionWithPreviews } from 'types/global';
import SearchAndFilterPanel from '@modules/home/components/search-and-filter-panel';
import { Box } from '@chakra-ui/react';
import HeroBanner from '@modules/home/components/hero-banner';
import HamzaLogoLoader from '../../components/loaders/hamza-logo-loader';

export const metadata: Metadata = {
    title: 'Hamza Store',
    description: 'Buy & Sell Products Using Crypto as a Community',
};

const getCollectionsWithProducts = async (
    countryCode: string
): Promise<ProductCollectionWithPreviews[] | null> => {
    const { collections } = await getCollectionsList(0, 3).then(
        (collections) => collections
    );

    if (!collections) {
        return null;
    }

    const collectionIds = collections.map((collection) => collection.id);

    await Promise.all(
        collectionIds.map((id) =>
            getProductsList({
                queryParams: { collection_id: [id] },
                countryCode,
            })
        )
    ).then((responses) =>
        responses.forEach(({ response, queryParams }) => {
            let collection;

            if (collections) {
                collection = collections.find(
                    (collection) =>
                        collection.id === queryParams?.collection_id?.[0]
                );
            }

            if (!collection) {
                return;
            }

            collection.products = response.products as unknown as Product[];
        })
    );

    return collections as unknown as ProductCollectionWithPreviews[];
};

export default async function Home({
    params: { countryCode },
}: {
    params: { countryCode: string };
}) {
    const collections = await getCollectionsWithProducts(countryCode);
    const region = await getRegion(countryCode);

    if (!collections || !region) {
        return null;
    }

    return (
        <Box backgroundColor={'transparent'}>
            <HeroBanner />
            <SearchAndFilterPanel />
        </Box>
    );
}
