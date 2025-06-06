import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
    getCollectionByHandle,
    getCollectionsList,
    listRegions,
} from '@/lib/server';
import CollectionTemplate from '@modules/collections/templates';
import { SortOptions } from '@modules/shop/components/refinement-list/sort-products';

type Props = {
    params: { handle: string; countryCode: string };
    searchParams: {
        page?: string;
        sortBy?: SortOptions;
    };
};

export const PRODUCT_LIMIT = 12;

export async function generateStaticParams() {
    const { collections } = await getCollectionsList().then(
        (collections) => collections
    );

    if (!collections) {
        return [];
    }

    const countryCodes = [process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'];

    const collectionHandles = collections.map(
        (collection) => collection.handle
    );

    const staticParams = countryCodes
        ?.map((countryCode) =>
            collectionHandles.map((handle) => ({
                countryCode,
                handle,
            }))
        )
        .flat();

    return staticParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const collection = await getCollectionByHandle(params.handle);

    if (!collection) {
        notFound();
    }

    const metadata = {
        title: `${collection.title} | Store`,
        description: `${collection.title} collection`,
    } as Metadata;

    return metadata;
}

export default async function CollectionPage({ params, searchParams }: Props) {
    const { sortBy, page } = searchParams;

    const collection = await getCollectionByHandle(params.handle).then(
        (collection) => collection
    );

    if (!collection) {
        notFound();
    }

    return (
        <CollectionTemplate
            collection={collection}
            page={page}
            sortBy={sortBy}
            countryCode={params.countryCode}
        />
    );
}
