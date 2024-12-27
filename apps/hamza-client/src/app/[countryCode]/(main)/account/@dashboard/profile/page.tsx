import { Metadata } from 'next';
import { getHamzaCustomer, listRegions } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import ProfileForm from './profile-form/profile-form';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'View and edit your Medusa Store profile.',
};

export default async function Profile() {
    const customer = await getHamzaCustomer();
    const regions = await listRegions();

    if (!customer || !regions) {
        notFound();
    }

    return (
        <Flex
            maxW={'927px'}
            width="100%"
            backgroundColor={'#121212'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={'12px'}
            p={'1.5rem'}
        >
            {/* Profile Form */}
            <ProfileForm customer={customer} />
        </Flex>
    );
}
