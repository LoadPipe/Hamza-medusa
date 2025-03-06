'use client';

import React, { useState } from 'react';
import { Flex, Text, Box, Tooltip } from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';
import { MdWallet } from 'react-icons/md';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';

const shortenAddress = (addr: string) =>
    `${addr.slice(0, 12)}...${addr.slice(-4)}`;

const AddressDisplay: React.FC = () => {
    const { authData, hnsName } = useCustomerAuthStore();
    const [isCopied, setIsCopied] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    if (authData.status !== 'authenticated' || !authData.wallet_address) {
        return null;
    }

    const displayValue =
        hnsName && hnsName.trim() !== ''
            ? hnsName
            : shortenAddress(authData.wallet_address);

    const fullValue =
        hnsName && hnsName.trim() !== ''
            ? hnsName
            : authData.wallet_address;

    const handleMouseEnter = () => {
        if (!isCopied) {
            setTooltipOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setTooltipOpen(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(fullValue).then(() => {
            setIsCopied(true);
            setTooltipOpen(true);

            setTimeout(() => {
                setIsCopied(false);
                setTooltipOpen(false);
            }, 1500);
        });
    };

    return (
        <Flex alignItems="center" gap="8px">
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
