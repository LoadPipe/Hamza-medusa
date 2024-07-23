import { Metadata } from 'next';

import ProfilePhone from '@modules/account//components/profile-phone';
import ProfileBillingAddress from '@modules/account/components/profile-billing-address';
import ProfileEmail from '@modules/account/components/profile-email';
import ProfileName from '@modules/account/components/profile-name';
import ProfilePassword from '@modules/account/components/profile-password';

import { getCustomer, listRegions } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Box, Button, Text } from '@chakra-ui/react';
import ProfileCurrency from '@modules/account/components/profile-currency';

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
            backgroundColor={'#121212'}
            flexDirection={'column'}
            color={'white'}
            padding={'10px'}
            gap={'10px'}
        >
            <Flex gap="18px" flexDirection={'column'}>
                <Flex gap={'15px'}>
                    <Button
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        borderRadius={'37px'}
                        fontSize={'18px'}
                        fontWeight={600}
                        height={'47px'}
                    >
                        Change Photo
                    </Button>
                    <Button
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        borderRadius={'37px'}
                        fontSize={'18px'}
                        fontWeight={600}
                        height={'47px'}
                    >
                        Remove Photo
                    </Button>
                </Flex>
                <Text color={'#555555'}>
                    At least 125 x 125 px PNG or JPG file. 1 MB maximum file
                    size
                </Text>
            </Flex>

            <Flex>
                <Text color={'primary.indigo.900'}>Personal Information</Text>
            </Flex>

            <div className="flex flex-col gap-y-8 w-full">
                <ProfileName customer={customer} />
                <Divider />

                {!customer.email.includes('@evm.blockchain') && (
                    <>
                        <ProfileEmail customer={customer} />
                        <Divider />
                    </>
                )}
                {/*<ProfilePhone customer={customer} />*/}
                <ProfileCurrency customer={customer} />
                <Divider />
                {/*<ProfilePassword customer={customer} />*/}
                {/*<Divider />*/}
                <ProfileBillingAddress customer={customer} regions={regions} />
            </div>
        </Flex>
    );
}

const Divider = () => {
    return <div className="w-full h-px bg-gray-200" />;
};
