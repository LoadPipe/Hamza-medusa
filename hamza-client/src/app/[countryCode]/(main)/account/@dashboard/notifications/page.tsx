import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Text } from '@chakra-ui/react';
import Error from '../../../../../error';
import Notification from '@modules/account/components/notifications';

import { getHamzaCustomer, getVerificationStatus } from '@/lib/server';

import { getRegion } from '@/app/actions';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Notifications',
    description: 'View your notifications',
};

export default async function Notifications() {
    const nextHeaders = headers();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
        : nextHeaders.get('next-url')?.split('/')[1] || '';
    const customer = await getHamzaCustomer();
    const region = await getRegion(countryCode);

    if (!customer || !region) {
        notFound();
    }

    // if customer is found, check if the customer is verified
    const verificationStatus = await getVerificationStatus(customer.id);
    if (!verificationStatus.data) {
        return <Error error={'Verify your email to access this page.'} />;
    }

    return (
        <div className="w-full bg-black text-white p-8">
            <div className="mb-8 flex flex-col">
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
