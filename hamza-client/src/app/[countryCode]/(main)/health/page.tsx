import { Metadata } from 'next';
import { Flex, Box, Text } from '@chakra-ui/react';

export const metadata: Metadata = {
    title: 'Health Check',
    description: 'Something went wrong',
};

export default function Page() {
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
                    A Health to ye Laddie
                </Text>
                <Text textAlign={'center'}>A Health to ye Laddie</Text>
                <a
                    href="/"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <Flex
                        mt="1rem"
                        width={'190px'}
                        height={'50px'}
                        backgroundColor={'primary.indigo.900'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        borderRadius={'full'}
                    >
                        <Text>Go Home</Text>
                    </Flex>
                </a>
            </Flex>
        </Flex>
    );
}
