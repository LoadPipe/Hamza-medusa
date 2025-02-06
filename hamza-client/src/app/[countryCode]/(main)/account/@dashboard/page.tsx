import { Metadata } from 'next';

import { getHamzaCustomer, listCustomerOrders } from '@/lib/server';
import Overview from '@modules/account/components/overview';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Account',
    description: 'Overview of your account activity.',
};

export default async function OverviewTemplate() {
    const customer = await getHamzaCustomer().catch(() => null);

    if (!customer) {
        notFound();
    }
    // redirect('/account/profile');

    return <></>;
}
