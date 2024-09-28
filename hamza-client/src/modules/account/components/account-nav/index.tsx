'use client';
import { Customer } from '@medusajs/medusa';
import { Flex, Box } from '@chakra-ui/react';
import React from 'react';
import AccountNavMobile from './account-nav-mobile/account-nav-mobile';
import AccountNavDesktop from './account-nav-desktop/account-nav-desktop';

const AccountNav = ({
    customer,
}: {
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    return (
        <Box>
            <Box display={{ base: 'block', md: 'none' }}>
                <AccountNavMobile customer={customer} />
            </Box>
            <Box display={{ base: 'none', md: 'block' }}>
                <AccountNavDesktop customer={customer} />
            </Box>
        </Box>
    );
};

export default AccountNav;
