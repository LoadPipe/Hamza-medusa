'use server';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getVendors } from '@lib/data/index';
import { Region } from '@medusajs/medusa';
import { getRegion } from 'app/actions';
import VendorTemplate from '@modules/vendors/vendor-template';

type Props = {
    params: { countryCode: string; handle: string };
};

export default async function VendorPage({ params }: Props) {
    const vendors = await getVendors().catch(() => null);

    if (!vendors) {
        notFound();
    }

    return <VendorTemplate vendors={vendors} />;
}
