import { Metadata } from 'next';

import ProfilePhone from '@modules/account//components/profile-phone';
import ProfileBillingAddress from '@modules/account/components/profile-billing-address';
import ProfileEmail from '@modules/account/components/profile-email';
import ProfileName from '@modules/account/components/profile-name';
import ProfilePassword from '@modules/account/components/profile-password';

import { getCustomer, listRegions } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Box, Button, Text, Input } from '@chakra-ui/react';
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

            {/* Input personal information */}
            <Flex justifyContent={'center'} alignItems={'center'}>
                <Flex
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

                    <Flex gap={'15px'}>
                        <Flex
                            flexDirection={'column'}
                            maxW={'420px'}
                            width={'100%'}
                        >
                            <Text fontSize={'12px'} pl="1rem" mb={'8px'}>
                                FIRST NAME
                            </Text>
                            <Input
                                borderRadius={'12px'}
                                backgroundColor={'#020202'}
                                border={'none'}
                            />
                        </Flex>

                        <Flex
                            flexDirection={'column'}
                            maxW={'420px'}
                            width={'100%'}
                        >
                            <Text fontSize={'12px'} pl="1rem" mb={'8px'}>
                                LAST NAME
                            </Text>
                            <Input
                                maxW={'420px'}
                                width={'100%'}
                                borderRadius={'12px'}
                                backgroundColor={'#020202'}
                                border={'none'}
                            />
                        </Flex>
                    </Flex>

                    <Flex gap={'15px'}>
                        <Flex
                            flexDirection={'column'}
                            maxW={'420px'}
                            width={'100%'}
                        >
                            <Text fontSize={'12px'} pl="1rem" mb={'8px'}>
                                BIRTH DATE
                            </Text>
                            <Input
                                borderRadius={'12px'}
                                backgroundColor={'#020202'}
                                border={'none'}
                            />
                        </Flex>

                        <Flex
                            flexDirection={'column'}
                            maxW={'420px'}
                            width={'100%'}
                        >
                            <Text fontSize={'12px'} pl="1rem" mb={'8px'}>
                                EMAIL
                            </Text>
                            <Input
                                borderRadius={'12px'}
                                backgroundColor={'#020202'}
                                border={'none'}
                            />
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection={'column'}
                        maxW={'420px'}
                        width={'100%'}
                    >
                        <Text fontSize={'12px'} pl="1rem" mb={'8px'}>
                            PHONE NUMBER
                        </Text>
                        <Input
                            borderRadius={'12px'}
                            backgroundColor={'#020202'}
                            border={'none'}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
