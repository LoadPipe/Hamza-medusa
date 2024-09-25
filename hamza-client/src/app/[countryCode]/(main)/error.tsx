'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
    Text,
    Flex,
    Heading,
    Button,
    ListItem,
    UnorderedList,
} from '@chakra-ui/react';
import ErrorIcon from '../../../../public/images/error/error-icon.svg';

type ErrorPageProps = {
    error: any;
    reset: any;
};

export default function Error({ error, reset }: ErrorPageProps) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    const handleBack = () => {
        router.back();
    };

    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
            height={'100vh'}
            style={{
                background:
                    'linear-gradient(to bottom, #020202 5vh, #2C272D 40vh)',
            }}
        >
            <Flex
                flexDirection={'row'}
                maxW={'1127px'}
                width={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
                color={'white'}
            >
                <Flex flexDir={'column'} gap={'32px'}>
                    <Flex flexDir={'column'} gap={'24px'}>
                        <Heading
                            as="h1"
                            fontSize={'72px'}
                            color={'primary.green.900'}
                        >
                            Oops!
                        </Heading>
                        <Heading fontSize={'32px'} color={'primary.green.900'}>
                            Something Went Wrong.
                        </Heading>
                        <Text>
                            It looks like we hit a bump in the road. But don't
                            worry, we're on it!
                        </Text>
                    </Flex>

                    <Flex flexDir={'column'}>
                        <Heading fontSize={'24px'}>What can you do?</Heading>
                        <UnorderedList>
                            <ListItem>
                                Try refreshing the page. Sometimes, that's all
                                it takes.
                            </ListItem>
                            <ListItem>
                                Check your connection/ Make sure you're
                                connected to the internet.
                            </ListItem>
                            <ListItem>
                                Return the homepage or use the navigation above
                                to find what you're looking for.
                            </ListItem>
                            <ListItem>
                                If the problem persists, please contact support.
                            </ListItem>
                        </UnorderedList>
                    </Flex>

                    <Flex maxW={'413px'} width="100%">
                        <Button
                            height={'52px'}
                            width={'190px'}
                            borderRadius={'53px'}
                            borderColor={'primary.green.900'}
                            borderWidth={'2px'}
                            color={'primary.green.900'}
                            backgroundColor={'transparent'}
                        >
                            Try Again
                        </Button>

                        <Button
                            height={'52px'}
                            width={'190px'}
                            ml="auto"
                            backgroundColor={'primary.green.900'}
                            color={'black'}
                            borderRadius={'53px'}
                            onClick={() => handleBack()}
                        >
                            Go to Homepage
                        </Button>
                    </Flex>
                </Flex>
                <Flex>
                    <Image src={ErrorIcon} alt="Error Icon" />
                </Flex>
            </Flex>
        </Flex>
    );
}
