'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Image,
    Tooltip,
} from '@chakra-ui/react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { chains } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import {
    getChainIdFromName,
    getChainLogoFromName,
} from '@/modules/chain-select';

interface ChainSelectionInterstitialProps {
    isOpen: boolean;
    onClose: () => void;
    onChainSelect: (chainId: number, chainName: string) => void;
}

const ChainSelectionInterstitial: React.FC<ChainSelectionInterstitialProps> = ({
    isOpen,
    onClose,
    onChainSelect
}) => {
    const { chain } = useNetwork();
    const { switchNetwork, isSuccess, isLoading, pendingChainId, error } = useSwitchNetwork();

    const ALLOWED_CHAIN_ID = 11155111;

    // Handle chain selection
    const handleChainSelect = (chainName: string) => {
        const chainId = getChainIdFromName(chainName);

        if (chainId !== null && chainId === ALLOWED_CHAIN_ID) {
            // If the selected chain matches the current chain, just proceed with payment
            if (chain?.id === chainId) {
                onChainSelect(chainId, chainName);
                onClose();
            } else {
                // Otherwise, switch the network first
                switchNetwork?.(chainId);
            }
        }
    };

    // When network switch is complete, proceed with payment
    useEffect(() => {
        if (isSuccess && chain && chain.id === ALLOWED_CHAIN_ID) {
            onChainSelect(chain.id, chain.name);
            onClose();
        }
    }, [isSuccess, chain, onChainSelect, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent bg="#1A1A1A" color="white" borderRadius="xl">
                <ModalHeader borderBottomWidth="1px" borderColor="gray.700">Select Blockchain Network</ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
                    <Text mb={4} color="white">
                        Choose which blockchain network you want to use for your payment:
                    </Text>

                    <VStack spacing={3} align="stretch">
                        {chains.map((network, index) => {
                            const chainId = getChainIdFromName(network.name);
                            const isConnected = chain?.id === chainId;
                            const isAllowed = chainId === ALLOWED_CHAIN_ID;

                            return (
                                <Tooltip
                                    key={index}
                                    label={isAllowed ? "" : "This network is not currently supported for payments"}
                                    isDisabled={isAllowed}
                                >
                                    <Button
                                        onClick={() => isAllowed && handleChainSelect(network.name)}
                                        variant="outline"
                                        justifyContent="flex-start"
                                        height="60px"
                                        borderRadius="xl"
                                        borderColor="gray.700"
                                        bg={isConnected ? "gray.700" : "transparent"}
                                        _hover={{ bg: isAllowed ? "gray.800" : "transparent" }}
                                        position="relative"
                                        color="white"
                                        opacity={isAllowed ? 1 : 0.5}
                                        cursor={isAllowed ? "pointer" : "not-allowed"}
                                    >
                                        <Flex flex={1} justifyContent="space-between" alignItems="center">
                                            <Flex alignItems="center">
                                                {getChainLogoFromName(network.name) && (
                                                    <Image
                                                        src={getChainLogoFromName(network.name).src}
                                                        alt={`${network.name} logo`}
                                                        width="24px"
                                                        height="24px"
                                                        mr="8px"
                                                    />
                                                )}
                                                <Text color="white">{network.name}</Text>
                                            </Flex>

                                            {isLoading && pendingChainId === chainId ? (
                                                <Text fontSize="sm" color="gray.300">Switching...</Text>
                                            ) : isConnected ? (
                                                <Box bg="green.500" px={2} py={1} borderRadius="md" fontSize="xs">
                                                    Connected
                                                </Box>
                                            ) : null}

                                            {!isAllowed && (
                                                <Box bg="gray.600" px={2} py={1} borderRadius="md" fontSize="xs">
                                                    Coming Soon
                                                </Box>
                                            )}
                                        </Flex>
                                    </Button>
                                </Tooltip>
                            );
                        })}
                    </VStack>

                    {error && (
                        <Box mt={4} p={3} bg="red.900" color="red.200" borderRadius="md">
                            {error.message}
                        </Box>
                    )}

                    {chain && (
                        <Box mt={6} p={4} bg="gray.800" borderRadius="md">
                            <Text fontSize="sm">
                                Your wallet is currently connected to {chain.name}.
                                {chain.id !== ALLOWED_CHAIN_ID &&
                                    " Currently, only Sepolia testnet is supported for payments."}
                            </Text>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ChainSelectionInterstitial;