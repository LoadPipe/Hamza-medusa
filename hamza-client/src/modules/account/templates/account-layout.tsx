'use client';
import React, { useEffect } from 'react';

import UnderlineLink from '@modules/common/components/interactive-link';

import AccountNav from '../components/account-nav';
import { Customer } from '@medusajs/medusa';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

import { Flex, Box } from '@chakra-ui/react';
import axios from 'axios';
import { getClientCookie } from '@lib/util/get-client-cookies';

interface AccountLayoutProps {
    customer: Omit<Customer, 'password_hash'> | null;
    children: React.ReactNode;
}

async function getVerificationStatus(customer_id: string): Promise<boolean> {
    const res: any = axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/customer/verification-status`, {
        params: { customer_id },
        headers: {
            authorization: getClientCookie('_medusa_jwt')
        }
    });

    return res?.data == true;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
    customer,
    children,
}) => {
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    const accountVerificationFetcher = () => {
        const res = { data: true }
        getVerificationStatus(authData.customer_id).then(r => {
            if (r) {
                setCustomerAuthData({ ...authData, is_verified: true });
            }
        });
    };
    useEffect(() => {
        if (authData.status == 'authenticated') {
            accountVerificationFetcher();
        }
    }, [authData.status]);

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
                    {/* <div>{customer && <AccountNav customer={customer} />}</div> */}
                    <AccountNav customer={customer} />
                    <Flex
                        ml={{ base: 0, md: 'auto' }}
                        maxWidth={'927px'}
                        width={'100%'}
                    >
                        {children}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AccountLayout;

{
    /* <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
                    <div>
                        <h3 className="text-xl-semi mb-4">Got questions?</h3>
                        <span className="txt-medium">
                            You can find frequently asked questions and answers
                            on our customer service page.
                        </span>
                    </div>
                    <div>
                        <UnderlineLink href="/customer-service">
                            Customer Service
                        </UnderlineLink>
                    </div>
                </div> */
}
