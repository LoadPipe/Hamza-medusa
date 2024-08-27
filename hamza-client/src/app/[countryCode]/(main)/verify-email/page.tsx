'use client';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import Input from '@modules/common/components/input';
import axios from 'axios';
import { useState } from 'react';
import { Toast } from '@medusajs/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import getGoogleOAuthURL from '@lib/util/google-url';
import getTwitterOauthUrl from '@lib/util/twitter-url';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import { Flex, Text, Heading } from '@chakra-ui/react';
import { verifyEmail } from '@lib/data';

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
        let res = await verifyEmail(authData.customer_id, email);
        let data = res.data;
        if (data.status == true) {
            toast.success('Email sent successfully!!');
            router.replace('/');
        } else {
            toast.error(data.message);
            return;
        }
    };

    return (
        <div className="layout-base bg-black flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-full">
                <div className="my-8">
                    <Text
                        color={'primary.indigo.900'}
                        className="font-semibold text-4xl  text-center"
                    >
                        Account Verification
                    </Text>
                </div>
                {searchParams.get('auth_error') == 'true' && (
                    <div>An error occurred during verification</div>
                )}
                <div className="px-16">
                    <div className="p-4 md:p-5">
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
                        <div className="text-white text-md text-center p-4">
                            Or
                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
