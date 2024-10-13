'use client';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import getGoogleOAuthURL from '@lib/util/google-url';
import getTwitterOauthUrl from '@lib/util/twitter-url';
import toast from 'react-hot-toast';
import { IoLogoGoogle } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import { BsDiscord } from 'react-icons/bs';
import { Flex, Text, Input, Divider, Button } from '@chakra-ui/react';
import { verifyEmail } from '@lib/data/index';
import VerifyFail from './components/verify-fail';
import VerifySuccess from './components/verify-success';

const VerifyAccount = () => {
    // Customer Authentication
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    const searchParams = useSearchParams();

    // Email input hook
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Routing
    const router = useRouter();
    const authParams = `customer_id=${authData.customer_id}`;

    // Verification status, type and reason
    const [status, setStatus] = useState<'default' | 'error' | 'success'>(
        'default'
    );
    const [verificationType, setVerificationType] = useState('');
    const [errorReason, setErrorReason] = useState<string | null>(null);

    // Check url information for verification status
    useEffect(() => {
        const verify = searchParams.get('verify');
        const message = searchParams.get('message');
        const type = searchParams.get('type');

        if (verify === 'true') {
            setStatus('success');
            setErrorReason(null);
        } else if (verify === 'false' && message && type) {
            setErrorReason(decodeURIComponent(message)); // Decode URL-encoded reason

            switch (type) {
                case 'google':
                    setVerificationType(getGoogleOAuthURL(authParams));
                    break;
                case 'twitter':
                    setVerificationType(getTwitterOauthUrl(authParams));
                    break;
                case 'discord':
                    setVerificationType(
                        `https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DISCORD_ACCESS_KEY}&scope=identify+email&state=123456&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL}&prompt=consent`
                    );
                    break;
                default:
                    setErrorReason('Invalid verification type.');
                    setStatus('error');
                    return;
            }
            setStatus('error');
        } else {
            setStatus('default');
        }
    }, [searchParams]);

    // Email validation
    const emailVerificationHandler = async () => {
        setLoading(true);
        console.log('hello');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === '') {
            toast.error('Email address cannot be empty!');
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address!');
            setLoading(false);
            return;
        }

        try {
            console.log('response lets go');
            let res: any = await verifyEmail(authData.customer_id, email);

            if (res.message.includes('409')) {
                toast.error(
                    'This email address is already in use. Please try using a different email.'
                );
            }
            if (res !== undefined && !res.message.includes('409')) {
                toast.success('Email sent successfully!');
                router.replace('/');
            }
        } catch (error) {
            console.error('Error in email verification:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex
            flexDir={'column'}
            width={'100%'}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={{ base: 3, md: 6 }}
        >
            {status === 'success' && <VerifySuccess />}

            {status === 'error' && (
                <VerifyFail
                    title="Verification Failed"
                    message={
                        errorReason ||
                        'An unknown error occurred. Please try again.'
                    }
                    resendLink={verificationType}
                    onCancel={() => setStatus('default')}
                />
            )}

            {status === 'default' && (
                <>
                    <Text
                        textAlign={'center'}
                        maxW={'746px'}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
                        Please verify your account by clicking the link sent to
                        your email, or by logging in with your Google, X
                        (formerly Twitter), or Discord account. This will ensure
                        full access to your account and features. If you didn’t
                        receive the email, check your spam folder or resend the
                        link.
                    </Text>
                    <Flex
                        w={'100%'}
                        maxW={'468px'}
                        flexDir={'column'}
                        mt="0.5rem"
                        gap="1rem"
                    >
                        {/* Input Email Address */}
                        <Input
                            name="email"
                            placeholder="Your email address"
                            value={email}
                            type="email"
                            width={'100%'}
                            borderColor={'#555555'}
                            backgroundColor={'black'}
                            borderRadius={'12px'}
                            height={'50px'}
                            _placeholder={{ color: '#555555' }}
                            onChange={(e) => {
                                setEmail(e.target.value.toLowerCase());
                            }}
                        />

                        <Flex
                            flexDir={'row'}
                            my={{ base: '0px', md: '0.5rem' }}
                            alignItems={'center'}
                        >
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
                                backgroundColor={'black'}
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

                        {/* Twitter Auth
                        <a href={getTwitterOauthUrl(authParams)}>
                            <Button
                                leftIcon={<FaXTwitter size={24} />}
                                borderWidth={'1px'}
                                borderColor={'#555555'}
                                borderRadius={'12px'}
                                backgroundColor={'black'}
                                color={'white'}
                                height={'56px'}
                                width={'100%'}
                                justifyContent={'center'}
                            >
                                <Flex maxW={'157px'} width={'100%'}>
                                    <Text mr="auto">Verify with X</Text>
                                </Flex>
                            </Button>
                        </a>*/}

                        {/* Discord Auth */}
                        <a
                            href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DISCORD_ACCESS_KEY}&scope=identify+email&state=123456&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL}&prompt=consent`}
                        >
                            <Button
                                leftIcon={<BsDiscord size={24} color="white" />}
                                borderWidth={'1px'}
                                borderColor={'#555555'}
                                borderRadius={'12px'}
                                backgroundColor={'black'}
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
                        isLoading={loading}
                        onClick={() => {
                            console.log('Button Clicked!');
                            emailVerificationHandler();
                        }}
                        mt="auto"
                        borderRadius={'full'}
                        backgroundColor={'primary.green.900'}
                        height={'44px'}
                        maxW={'468px'}
                        width={'100%'}
                    >
                        Verify Account
                    </Button>
                </>
            )}
        </Flex>
    );
};

export default VerifyAccount;
