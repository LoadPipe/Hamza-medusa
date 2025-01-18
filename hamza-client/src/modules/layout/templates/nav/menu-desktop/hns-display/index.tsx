'use client';
import { MdWallet } from 'react-icons/md';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Input } from '@chakra-ui/react';
import { useState } from 'react';

const HnsDisplay = () => {
    const { authData, hnsName } = useCustomerAuthStore();
    const [isCopied, setIsCopied] = useState(false);

    const displayHns =
        hnsName && hnsName.trim() !== ''
            ? hnsName
            : authData?.wallet_address
              ? `${authData.wallet_address.slice(0, 4)}...${authData.wallet_address.slice(-4)}`
              : '';

    // Full address for copying
    const fullAddress =
        hnsName && hnsName.trim() !== ''
            ? hnsName
            : authData?.wallet_address || '';

    const handleCopy = () => {
        navigator.clipboard.writeText(fullAddress).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
        });
    };

    return authData.status === 'authenticated' ? (
        <Flex
            color={'white'}
            justifyContent={'center'}
            backgroundColor={'#2A2A2A'}
            opacity={'90%'}
            flexDirection={'row'}
            alignItems={'center'}
            width={'150px'}
            height={'48px'}
            padding={'14px'}
            cursor="pointer"
            rounded={'lg'}
            onClick={handleCopy}
        >
            <MdWallet />
            <Text
                ml="8px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
            >
                {displayHns}
            </Text>
            <Input type="hidden" value={fullAddress} readOnly />
            {isCopied && (
                <Text ml="8px" color="green.300" fontSize="sm">
                    Copied!
                </Text>
            )}
        </Flex>
    ) : (
        <></>
    );
};

export default HnsDisplay;
