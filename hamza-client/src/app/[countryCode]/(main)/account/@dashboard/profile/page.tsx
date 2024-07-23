import { Metadata } from 'next';

import ProfilePhone from '@modules/account//components/profile-phone';
import ProfileBillingAddress from '@modules/account/components/profile-billing-address';
import ProfileEmail from '@modules/account/components/profile-email';
import ProfileName from '@modules/account/components/profile-name';
import ProfilePassword from '@modules/account/components/profile-password';
import ProfileCurrency from '@modules/account/components/profile-currency';

import { getCustomer, listRegions } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Button, Text, Box } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
import ProfilePhoneInput from './components/phone-input';

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
            justifyContent={'center'}
            alignItems={'center'}
            color={'white'}
            height={'739px'}
            borderRadius={'12px'}
            gap={'10px'}
        >
            <Flex maxW={'858px'} width={'100%'}>
                <Flex
                    width={'151.5px'}
                    height={'151.5px'}
                    borderRadius={'full'}
                    backgroundColor={'white'}
                />
                <Flex
                    alignSelf={'center'}
                    ml="2rem"
                    gap="18px"
                    flexDirection={'column'}
                >
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
            </Flex>

            {/* Input personal information */}
            <Flex
                mt={'2rem'}
                flexDirection={'column'}
                maxW={'858px'}
                width={'100%'}
                gap={'23px'}
            >
                <Text
                    fontSize={'18px'}
                    fontWeight={600}
                    color={'primary.indigo.900'}
                >
                    Personal Information
                </Text>

                {/* First and last name input */}
                <Flex gap={'15px'}>
                    <ProfileInput label="first name" />
                    <ProfileInput label="last name" />
                </Flex>

                {/* Birthdate and Email input */}
                <Flex gap={'15px'}>
                    <ProfileInput label="birth date" />
                    <ProfileInput label="email" />
                </Flex>

                {/* Phone input */}
                <ProfilePhoneInput label="phone number" />
                <Button
                    backgroundColor={'primary.indigo.900'}
                    color={'white'}
                    borderRadius={'37px'}
                    fontSize={'18px'}
                    fontWeight={600}
                    height={'47px'}
                    width={'190px'}
                >
                    Update
                </Button>
            </Flex>
        </Flex>
    );
}
