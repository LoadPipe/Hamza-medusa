'use server';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
    getProductByHandle,
    getProductsList,
    retrievePricedProductById,
    getPricedProductByHandle,
    getProductTermsByProductHandle,
} from '@/lib/server';
import { Region } from '@medusajs/medusa';
import ProductTemplate from '@modules/products/templates';
import { getRegion } from '@/app/actions';
import {
    QueryClient,
    dehydrate,
    HydrationBoundary,
} from '@tanstack/react-query';

type Props = {
    params: { countryCode: string; handle: string };
};

export async function generateStaticParams() {
    const countryCodes = [process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'];

    const products = await Promise.all(
        countryCodes.map((countryCode) => {
            return getProductsList({ countryCode });
        })
    ).then((responses) =>
        responses.map(({ response }) => response.products).flat()
    );

    const staticParams = countryCodes
        ?.map((countryCode) =>
            products.map((product) => ({
                countryCode,
                handle: product.handle,
            }))
        )
        .flat();

    return staticParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = params;

    const { product } = await getProductByHandle(handle).then(
        (product) => product
    );

    if (!product) {
        notFound();
    }

    return {
        title: `${product.title} | Store`,
        description: `${product.title}`,
        openGraph: {
            title: `${product.title} | Store`,
            description: `${product.title}`,
            images: product.thumbnail ? [product.thumbnail] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const queryClient = new QueryClient();
    const region = await getRegion(params.countryCode);
    if (!region || !params?.countryCode) notFound();

    // Fetch the priced product *once*
    // Async function renders on server before sending html to browser
    // const pricedProduct = await getPricedProductByHandle(params?.handle, region);

    // Prefetch query for React Query Hydration (this doesn't actually fetch again, its storing data
    // inside the React Query's cache so for when the client hydrates, it doesn't need to refetch..
    await queryClient.prefetchQuery({
        queryKey: ['product', params.handle],
        queryFn: () => getPricedProductByHandle(params?.handle, region), // Avoid fetching twice
    });

    await queryClient.prefetchQuery({
        queryKey: ['product_terms', params.handle],
        queryFn: () => getProductTermsByProductHandle(params?.handle), // Avoid fetching twice
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductTemplate
                region={region}
                handle={params.handle}
                countryCode={params.countryCode}
            />
        </HydrationBoundary>
    );
}
