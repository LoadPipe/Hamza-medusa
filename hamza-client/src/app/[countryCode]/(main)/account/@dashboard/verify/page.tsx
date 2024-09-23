import { getHamzaCustomer, listRegions, updateCustomer } from '@lib/data';
import { notFound } from 'next/navigation';
import { Flex, Button, Text, Box } from '@chakra-ui/react';
import { Metadata } from 'next';
import VerifyEmail from '@modules/account/components/verify';

export const metadata: Metadata = {
    title: 'Verify',
    description: 'View and edit your Medusa Store profile.',
};

export default async function Verify() {
    const customer = await getHamzaCustomer();
    const regions = await listRegions();

    if (!customer || !regions) {
        notFound();
    } else {
        console.log(customer);
    }

    return (
        <Flex
            backgroundColor={'#121212'}
            color={'white'}
            borderRadius={'12px'}
            py={'24px'}
            px={'24px'}
            // gap={'10px'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'561px'}
            width={'100%'}
        >
            <VerifyEmail />
        </Flex>
    );
}
