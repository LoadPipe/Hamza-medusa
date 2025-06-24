'use client';

import React, { useState } from 'react';
import { Flex, Text, Box, Tooltip } from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';
import { MdWallet } from 'react-icons/md';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { AuthenticationStatus } from '@rainbow-me/rainbowkit';

interface AuthData {
    status: AuthenticationStatus;
    wallet_address: string;
}

interface CustomerAuthStoreState {
    authData: AuthData;
    hnsName: string | null;
}

const shortenAddress = (addr: string): string =>
    `${addr.slice(0, 19)}...${addr.slice(-4)}`;

const AddressDisplay: React.FC = (): JSX.Element | null => {
    const { authData, hnsName } = useCustomerAuthStore(
        (state: CustomerAuthStoreState) => ({
            authData: state.authData,
            hnsName: state.hnsName,
        })
    );
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

    if (authData.status !== 'authenticated' || !authData.wallet_address) {
        return null;
    }

    const displayValue: string =
        hnsName && hnsName.trim() !== ''
            ? hnsName
            : shortenAddress(authData.wallet_address);

    const fullValue: string =
        hnsName && hnsName.trim() !== '' ? hnsName : authData.wallet_address;

    const handleMouseEnter = (): void => {
        if (!isCopied) {
            setTooltipOpen(true);
        }
    };

    const handleMouseLeave = (): void => {
        setTooltipOpen(false);
    };

    const handleCopy = (): void => {
        navigator.clipboard.writeText(fullValue).then((): void => {
            setIsCopied(true);
            setTooltipOpen(true);

            setTimeout((): void => {
                setIsCopied(false);
                setTooltipOpen(false);
            }, 1500);
        });
    };

    return (
        <Flex alignItems="center" gap="8px" mb={5}>
            {/* Wallet icon */}
            <Box boxSize="20px" color="#E8EAED">
                <MdWallet size={20} />
            </Box>

            {/* Truncated address or HNS name */}
            <Text
                fontWeight={400}
                fontSize="16px"
                lineHeight="25px"
                color="#FFFFFF"
            >
                {displayValue}
            </Text>

            {/* Copy icon with a controlled tooltip */}
            <Tooltip
                label={isCopied ? 'Copied!' : 'Copy'}
                isOpen={tooltipOpen}
                hasArrow
                placement="bottom"
                bg="#272727"
                color="white"
            >
                <Box
                    as="button"
                    onClick={handleCopy}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                >
                    <FiCopy color="white" size={18} />
                </Box>
            </Tooltip>
        </Flex>
    );
};

export default AddressDisplay;
