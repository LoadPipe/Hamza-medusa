'use client';

import React from 'react';
import { MenuItem } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { WalletConnectButton } from '@/components/providers/rainbowkit/connect-button/nav-connect-button';
import { Flex } from '@chakra-ui/react';
const ConnectWalletLink = () => {
    const { authData } = useCustomerAuthStore();
    return (
        <Flex
            mb="0px"
            borderBottomRadius={'15px'}
            borderWidth={{ base: '1px', md: '0px' }}
            borderColor="rgba(255, 255, 255, 0.5)"
            height={'91px'}
            backgroundColor={
                authData.status === 'authenticated'
                    ? '#2C272D'
                    : 'primary.green.900'
            }
            justifyContent={'center'}
            alignItems={'center'}
        >
            <WalletConnectButton />
        </Flex>
    );
};

export default ConnectWalletLink;
