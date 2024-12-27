'use server';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getStores } from '@lib/data/index';
import { Region } from '@medusajs/medusa';
import { getRegion } from '@/app/actions';
import StoreTemplate from '@modules/store/store-template';

type Props = {
    params: { countryCode: string; handle: string };
};

export default async function StorePage({ params }: Props) {
    const vendors = await getStores().catch(() => null);

    if (!vendors) {
        notFound();
    }

    return <StoreTemplate vendors={vendors} />;
}
