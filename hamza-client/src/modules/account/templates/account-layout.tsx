'use client';
import React, { useEffect } from 'react';

import UnderlineLink from '@modules/common/components/interactive-link';

import AccountNav from '../components/account-nav';
import { Customer } from '@medusajs/medusa';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';

import { Flex, Box, Text } from '@chakra-ui/react';
import axios from 'axios';
import { getClientCookie } from '@lib/util/get-client-cookies';

interface AccountLayoutProps {
    customer: Omit<Customer, 'password_hash'> | null;

    children: React.ReactNode;
}

// Function to get verification status of a customer using their customer_id
async function getVerificationStatus(customer_id: string): Promise<boolean> {
    // Makes a GET request to the backend endpoint to check the verification status of the customer.
    const res: any = axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/customer/verification-status`,
        {
            params: { customer_id },
            headers: {
                authorization: getClientCookie('_medusa_jwt'),
            },
        }
    );

    // Returns true if the verification status is true, else false.
    return res?.data == true;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
    customer,
    children,
}) => {
    // Zustand store - Destructures authData and setCustomerAuthData from the custom store hook.
    const { authData, setCustomerAuthData } = useCustomerAuthStore();

    // Function to fetch and update account verification status
    const accountVerificationFetcher = () => {
        const res = { data: true };
        // Calls getVerificationStatus with the customer ID.
        getVerificationStatus(authData.customer_id).then((r) => {
            if (r) {
                // If verification is successful, update the store with is_verified set to true.
                setCustomerAuthData({ ...authData, is_verified: true });
            }
        });
    };

    // useEffect Hook
    useEffect(() => {
        // Checks if the auth status is 'authenticated'.
        if (authData.status == 'authenticated') {
            // Calls the accountVerificationFetcher function to check and update verification status.
            accountVerificationFetcher();
        }
    }, [authData.status]); // Dependency array includes authData.status, so it runs whenever authData.status changes.

    return (
        <Flex width={'100vw'} justifyContent={'center'}>
            <Flex
                maxW={'1280px'}
                width={'100%'}
                mx={'1rem'}
                justifyContent={'center'}
            >
                <Flex
                    maxW={'1258px'}
                    width={'100%'}
                    gap={'16px'}
                    my="2rem"
                    justifyContent={'center'}
                    flexDirection={{ base: 'column', md: 'row' }}
                >
                    <div>
                        {customer?.id && <AccountNav customer={customer} />}
                    </div>
                    {/* <AccountNav customer={customer} /> */}
                    {customer?.id ? (
                        <Box
                            ml={{ base: 0, md: 'auto' }}
                            maxWidth={'927px'}
                            width={'100%'}
                        >
                            {children}
                        </Box>
                    ) : (
                        // Shows Login Page
                        <Flex mt="4rem" justifyContent="center" h={'50vh'}>
                            {children}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AccountLayout;
