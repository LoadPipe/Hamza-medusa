'use client';

import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyToken } from '@/lib/server/index';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { FaRegCheckCircle } from 'react-icons/fa';

const VerifyEmail = () => {
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { token } = useParams();
    const { setCustomerAuthData, authData } = useCustomerAuthStore();

    useEffect(() => {
        const confirmationTokenHandler = async () => {
            if (status !== 'ok') {
                let res: any = await verifyToken(token as string);
                if (res.status) {
                    console.log('this is status', res.status);
                    toast.success('Email verified successfully!');
                    setCustomerAuthData({ ...authData, is_verified: true });
                    setMessage('Email Verified Successfully');
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                    return;
                } else {
                    toast.error(res?.message);
                    setMessage('Email Verification Failed');
                    return;
                }
            }
        };
        confirmationTokenHandler();
    }, []);

    return (
        <Flex direction="column" align="center" height={'100vh'} p={4}>
            <Flex
                mt="4rem"
                p={'24px'}
                borderRadius={'12px'}
                maxWidth={'435px'}
                height={'319px'}
                width={'100%'}
                backgroundColor={'#121212'}
                flexDirection={'column'}
                justifyContent={'space-evenly'}
                alignItems={'center'}
                color={'white'}
            >
                <FaRegCheckCircle color={'#94D42A'} size={72} />
                <Text fontSize={'24px'} fontWeight={900} mt="1rem">
                    Your account has been verified!
                </Text>
                <Text textAlign={'center'}>
                    Your account is now fully activated, and you can start
                    enjoying all the features.
                </Text>
                <a href="/">
                    <Button
                        borderRadius={'full'}
                        backgroundColor={'primary.green.900'}
                        height={'44px'}
                        mt="2rem"
                    >
                        Go Back Home
                    </Button>
                </a>
            </Flex>
        </Flex>
    );
};

export default VerifyEmail;
