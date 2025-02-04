import { Metadata } from 'next';
import { getHamzaCustomer, listRegions } from '@lib/data';
import { notFound } from 'next/navigation';
import Profile from '@/modules/account/components/profile';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'View and edit your Medusa Store profile.',
};

export default async function ProfilePage() {
    const customer = await getHamzaCustomer();
    const regions = await listRegions();

    if (!customer || !regions) {
        notFound();
    }

    return (
        <>
            <Profile customer={customer} />
        </>
    );
}
