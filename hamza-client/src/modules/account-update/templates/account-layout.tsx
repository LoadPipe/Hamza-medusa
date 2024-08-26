'use client';
import React, { useEffect } from 'react';

import UnderlineLink from '@modules/common/components/interactive-link';

import AccountNav from '../components/account-nav';
import { Customer } from '@medusajs/medusa';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

import { Flex, Box } from '@chakra-ui/react';
import { getVerificationStatus } from '@lib/data';

interface AccountLayoutProps {
    customer: Omit<Customer, 'password_hash'> | null;
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
    customer,
    children,
}) => {
    const { authData, setCustomerAuthData } = useCustomerAuthStore();
    const accountVerificationFetcher = async () => {
        let res = await getVerificationStatus(authData.customer_id);
        if (res.data == true) {
            setCustomerAuthData({ ...authData, is_verified: true });
        }

        return;
    };
    useEffect(() => {
        if (authData.status == 'authenticated') {
            accountVerificationFetcher();
        }
    }, [authData.status]);

    return (
        <Flex width={'100vw'} justifyContent={'center'}>
            <Flex maxW={'1280px'} justifyContent={'center'}>
                <Flex width={'1258px'} gap={'16px'} my="2rem">
                    <div>{customer && <AccountNav customer={customer} />}</div>
                    <div className="flex-1">{children}</div>
                </Flex>
                {/* <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
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
                </div> */}
            </Flex>
        </Flex>
    );
};

export default AccountLayout;
