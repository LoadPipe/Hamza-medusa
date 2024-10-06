import { Metadata } from 'next';

import InteractiveLink from '@modules/common/components/interactive-link';
import Image from 'next/image';
import { Flex, Text } from '@chakra-ui/react';
import errorMessage from '../../../../public/images/error/error-404.svg';

export const metadata: Metadata = {
    title: '404',
    description: 'Something went wrong',
};

export default function NotFound() {
    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'transparent'}
            color={'white'}
            my="4rem"
        >
            <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                maxWidth={'504px'}
                width={'100%'}
                gap={'10px'}
            >
                <Image
                    src={errorMessage}
                    alt="404"
                    style={{ width: '494px', height: '482px' }}
                />
                <Text color={'primary.green.900'} fontSize={'40px'}>
                    Page not found
                </Text>
                <Text textAlign={'center'}>
                    We're sorry, the page you requested could not be found.
                    Please go back to the home page
                </Text>
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
