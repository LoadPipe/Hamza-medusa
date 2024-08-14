import { Metadata } from 'next';

import ProfilePhone from '@modules/account//components/profile-phone';
import ProfileBillingAddress from '@modules/account/components/profile-billing-address';
import ProfileEmail from '@modules/account/components/profile-email';
import ProfileName from '@modules/account/components/profile-name';
import ProfilePassword from '@modules/account/components/profile-password';
import ProfileCurrency from '@modules/account/components/profile-currency';

import { getCustomer, listRegions, updateCustomer } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Text } from '@chakra-ui/react';
import ProfileForm from './profile-form/profile-form';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'View and edit your Medusa Store profile.',
};

export default async function Profile() {
    const customer = await getCustomer();
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

            <ProfileForm />
        </Flex>
    );
}

// {/* <Flex
// maxW={'927px'}
// width="100%"
// flexDirection={'column'}
// fontSize={'32px'}
// >
// <Text color="primary.indigo.900" fontWeight={500} mb="1rem">
//     My Profile
// </Text>
// <Flex
//     maxW={'927px'}
//     width="100%"
//     backgroundColor={'#121212'}
//     flexDirection={'column'}
//     justifyContent={'center'}
//     alignItems={'center'}
//     borderRadius={'12px'}
//     py={'2rem'}
// >
//     {/* Profile Form */}

//     <ProfileForm />
// </Flex>
// </Flex> */}
