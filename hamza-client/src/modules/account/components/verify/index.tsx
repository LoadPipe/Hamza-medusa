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
import { FcGoogle } from 'react-icons/fc';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import { Flex, Text, Input, Heading, Box } from '@chakra-ui/react';
import { verifyEmail } from '@lib/data/index';

const VerifyEmail = () => {
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const router = useRouter();
    const authParams = `customer_id=${authData.customer_id}`;

    if (authData.status == 'unauthenticated') {
        return <div>Please connect wallet before adding email address.</div>;
    }

    const emailVerificationHandler = async () => {
        if (email === '') {
            toast.error('Email address cannot be empty!');
            return;
        }

        let res: any = await verifyEmail(authData.customer_id, email);
        if (res == true) {
            toast.success('Email sent successfully!!');
            router.replace('/');
        } else {
            toast.error(res.message);
            return;
        }
    };

    return (
        <Flex
            flexDir={'column'}
            width={'100%'}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={5}
        >
            <Text maxW={'746px'}>
                Please verify your account by clicking the link sent to your
                email, or by logging in with your Google, X (formerly Twitter),
                or Discord account. This will ensure full access to your account
                and features. If you didn’t receive the email, check your spam
                folder or resend the link.
            </Text>

            <Flex w={'100%'} maxW={'468px'}>
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
            </Flex>
            {/* <div>
                {searchParams.get('auth_error') == 'true' && (
                    <div>An error occurred during verification</div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        emailVerificationHandler();
                    }}
                >
                    <Input
                        name="email"
                        label="Your Email Address"
                        value={email}
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <button
                        type="submit"
                        className="w-full text-white bg-[#7B61FF] hover:bg-[#624DCC] focus:ring-4 focus:outline-none focus:ring-[#7B61FF] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Verify
                    </button>
                </form>
                <div className="text-white text-md text-center p-4">Or</div>
                <div className="buttons flex flex-col space-y-2 w-full">
                    <a href={getGoogleOAuthURL(authParams)}>
                        <button className="px-4 py-2 w-full border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                            <Flex>
                                <Flex padding={'5px'}>
                                    <FcGoogle
                                        size={20}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </Flex>
                                <Text ml="0.5rem" alignSelf={'center'}>
                                    Verify with Google
                                </Text>
                            </Flex>
                        </button>
                    </a>

                    <a href={getTwitterOauthUrl(authParams)}>
                        <button className="px-4 py-2 w-full border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 items-center">
                            <Flex>
                                <Flex padding={'5px'}>
                                    <FaTwitter
                                        color="#1DA1F2"
                                        size={20}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </Flex>
                                <Text ml="0.5rem" alignSelf={'center'}>
                                    Verify with Twitter
                                </Text>
                            </Flex>
                        </button>
                    </a>

                    <a
                        href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DISCORD_ACCESS_KEY}&scope=identify+email&state=123456&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL}&prompt=consent`}
                    >
                        <button className="px-4 py-2 w-full border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 items-center">
                            <Flex>
                                <Flex padding={'5px'}>
                                    <FaDiscord
                                        color="#5865F2"
                                        size={20}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </Flex>
                                <Text ml="0.5rem" alignSelf={'center'}>
                                    Verify with Discord
                                </Text>
                            </Flex>
                        </button>
                    </a>
                </div>
            </div> */}
        </Flex>
    );
};

export default VerifyEmail;

{
    /* <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        emailVerificationHandler();
                    }}
                >
                 
                    <button type="submit">Verify</button>
                </form> */
}
