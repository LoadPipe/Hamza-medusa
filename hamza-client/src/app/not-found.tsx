import { Metadata } from 'next';
import { Flex, Box, Text } from '@chakra-ui/react';

import InteractiveLink from '@modules/common/components/interactive-link';

export const metadata: Metadata = {
    title: '404',
    description: 'Something went wrong',
};

export default function NotFound() {
    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'black'}
            color={'white'}
            height={'100vh'}
        >
            <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                maxWidth={'504px'}
                width={'100%'}
                gap={'10px'}
            >
                <Text color={'primary.green.900'} fontSize={'40px'}>
                    Page not found
                </Text>
                <Text textAlign={'center'}>
                    We're sorry, the page you requested could not be found.
                    Please go back to the home page
                </Text>
                <Flex
                    mt="1rem"
                    width={'190px'}
                    height={'50px'}
                    backgroundColor={'primary.indigo.900'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    borderRadius={'full'}
                >
                    <a href="/">
                        <Text>Go Home</Text>
                    </a>
                </Flex>
            </Flex>
        </Flex>
    );
}
