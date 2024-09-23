'use client';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
// import Input from '@modules/common/components/input';
import axios from 'axios';
import { useState } from 'react';
import { Toast } from '@medusajs/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import getGoogleOAuthURL from '@lib/util/google-url';
import getTwitterOauthUrl from '@lib/util/twitter-url';
import toast from 'react-hot-toast';
import { IoLogoGoogle } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import { BsDiscord } from 'react-icons/bs';

import {
    Flex,
    Text,
    Input,
    Heading,
    Box,
    Divider,
    Button,
} from '@chakra-ui/react';
import { verifyEmail } from '@lib/data/index';

const VerifyEmail = () => {
    // Customer Authentication
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    const searchParams = useSearchParams();

    // Email input hook
    const [email, setEmail] = useState('');

    // Routing
    const router = useRouter();
    const authParams = `customer_id=${authData.customer_id}`;

    // //
    // if (authData.status == 'unauthenticated') {
    //     return <div>Please connect wallet before adding email address.</div>;
    // }

    // Email validation
    const emailVerificationHandler = async () => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === '') {
            toast.error('Email address cannot be empty!');
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address!');
            return;
        }

        try {
            let res: any = await verifyEmail(authData.customer_id, email);

            if (res !== undefined) {
                toast.success('Email sent successfully!');
                router.replace('/');
            } else {
                toast.error('Failed to send email. Please try again.');
                return;
            }
        } catch (error) {
            toast.error(
                'An error occurred while sending the email. Please try again.'
            );
        }
    };

    return (
        <Flex
            flexDir={'column'}
            width={'100%'}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={6}
        >
            <Text textAlign={'center'} maxW={'746px'}>
                Please verify your account by clicking the link sent to your
                email, or by logging in with your Google, X (formerly Twitter),
                or Discord account. This will ensure full access to your account
                and features. If you didn’t receive the email, check your spam
                folder or resend the link.
            </Text>

            <Flex w={'100%'} maxW={'468px'} flexDir={'column'} gap="1rem">
                {/* Input Email Address */}
                <Input
                    name="email"
                    placeholder="Your email address"
                    value={email}
                    type="email"
                    width={'100%'}
                    borderRadius={'12px'}
                    height={'50px'}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <Flex flexDir={'row'} my="1rem" alignItems={'center'}>
                    <Divider />
                    <Text mx="1rem">OR</Text>
                    <Divider />
                </Flex>

                {/* Google Auth */}
                <a href={getGoogleOAuthURL(authParams)}>
                    <Button
                        leftIcon={<IoLogoGoogle size={24} />}
                        borderWidth={'1px'}
                        borderColor={'#555555'}
                        borderRadius={'12px'}
                        backgroundColor={'transparent'}
                        color={'white'}
                        height={'56px'}
                        width={'100%'}
                        justifyContent={'center'}
                    >
                        <Flex maxW={'157px'} width={'100%'}>
                            <Text mr="auto"> Verify with Google</Text>
                        </Flex>
                    </Button>
                </a>

                {/* Twitter Auth */}
                <a href={getTwitterOauthUrl(authParams)}>
                    <Button
                        leftIcon={<FaXTwitter size={24} />}
                        borderWidth={'1px'}
                        borderColor={'#555555'}
                        borderRadius={'12px'}
                        backgroundColor={'transparent'}
                        color={'white'}
                        height={'56px'}
                        width={'100%'}
                        justifyContent={'center'}
                    >
                        <Flex maxW={'157px'} width={'100%'}>
                            <Text mr="auto">Verify with X</Text>
                        </Flex>
                    </Button>
                </a>

                {/* Discord Auth */}
                <a
                    href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DISCORD_ACCESS_KEY}&scope=identify+email&state=123456&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL}&prompt=consent`}
                >
                    <Button
                        leftIcon={<BsDiscord size={24} color="white" />}
                        borderWidth={'1px'}
                        borderColor={'#555555'}
                        borderRadius={'12px'}
                        backgroundColor={'transparent'}
                        color={'white'}
                        height={'56px'}
                        width={'100%'}
                    >
                        <Flex maxW={'157px'} width={'100%'}>
                            <Text mr="auto"> Verify with Discord</Text>
                        </Flex>
                    </Button>
                </a>
            </Flex>
            <Button
                onClick={emailVerificationHandler}
                mt="auto"
                borderRadius={'full'}
                backgroundColor={'primary.green.900'}
                height={'44px'}
                maxW={'468px'}
                width={'100%'}
            >
                Verify Account
            </Button>
        </Flex>
    );
};

export default VerifyEmail;
