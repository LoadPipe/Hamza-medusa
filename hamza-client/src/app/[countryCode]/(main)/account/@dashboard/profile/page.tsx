import { Metadata } from 'next';

import ProfilePhone from '@modules/account//components/profile-phone';
import ProfileBillingAddress from '@modules/account/components/profile-billing-address';
import ProfileEmail from '@modules/account/components/profile-email';
import ProfileName from '@modules/account/components/profile-name';
import ProfilePassword from '@modules/account/components/profile-password';
import ProfileCurrency from '@modules/account/components/profile-currency';

import { getCustomer, listRegions, updateCustomer } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Button, Text, Box } from '@chakra-ui/react';
import ProfileForm from './profile-form/profile-form';
import ProfileImage from './profile-image/profile-image';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'View and edit your Medusa Store profile.',
};

export default async function Profile() {
    const customer = await getCustomer();
    const regions = await listRegions();

    if (!customer || !regions) {
        notFound();
    } else {
        console.log(customer);
    }

    return (
        <Flex
            backgroundColor={'#121212'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            color={'white'}
            height={'739px'}
            borderRadius={'12px'}
            gap={'10px'}
        >
            {/* Avatar update / remove */}
            <ProfileImage customer={customer} />
            {/* Profile Form */}
            <ProfileForm customer={customer} />
        </Flex>
    );
}
