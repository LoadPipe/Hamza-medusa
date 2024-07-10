import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AddressBook from '@modules/account/components/address-book';

import { getCustomer } from '@lib/data';

import { getRegion } from 'app/actions';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Addresses',
    description: 'View your addresses',
};

export default async function Addresses() {
    const nextHeaders = headers();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_US_COUNTRY
        ? 'us'
        : nextHeaders.get('next-url')?.split('/')[1] || '';
    const customer = await getCustomer();
    const region = await getRegion(countryCode);

    if (!customer || !region) {
        notFound();
    }

    return (
        <div className="w-full bg-black text-white p-8">
            <div className="mb-8 flex flex-col gap-y-4">
                <h1 className="text-2xl-semi">Shipping Addresses</h1>
                <p className="text-base-regular">
                    View and update your shipping addresses, you can add as many
                    as you like. Saving your addresses will make them available
                    during checkout.
                </p>
            </div>
            <AddressBook customer={customer} region={region} />
        </div>
    );
}
