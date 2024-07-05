import { Metadata } from 'next';

import { getCustomer, listCustomerOrders } from '@lib/data';
import Overview from '@modules/account/components/overview';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Account',
    description: 'Overview of your account activity.',
};

export default async function OverviewTemplate() {
    const customer = await getCustomer().catch(() => null);
    const orders = (await listCustomerOrders().catch(() => null)) || null;
    if (!customer) {
        notFound();
    }
    redirect('/account/profile');

    return <></>;
}
