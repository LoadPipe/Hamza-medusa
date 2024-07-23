import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Text } from '@chakra-ui/react';
import Notification from '@modules/account/components/notifications';

import { getCustomer } from '@lib/data';

import { getRegion } from 'app/actions';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Notifications',
    description: 'View your notifications',
};

export default async function Notifications() {
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
                <Text className="text-2xl-semi" color={'primary.indigo.900'}>
                    Notification Setting
                </Text>
                <p className="text-base-regular">
                    Select the kinds of notifications you get about your
                    activities and recommendations.
                </p>
            </div>
            <Notification customer={customer} region={region} />
        </div>
    );
}
