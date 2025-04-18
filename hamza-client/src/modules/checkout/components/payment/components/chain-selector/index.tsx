'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Image,
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
    const [switchingChain, setSwitchingChain] = useState<{ id: number, name: string } | null>(null);

    // Refs to prevent multiple triggers
    const hasTriggeredPayment = useRef(false);
    const initialChainId = useRef<number | null>(null);

    // Store initial chain ID when modal opens
    useEffect(() => {
        if (isOpen && chain) {
            initialChainId.current = chain.id;
            hasTriggeredPayment.current = false;
        }
    }, [isOpen, chain]);

    // Handle chain selection
    const handleChainSelect = (chainName: string) => {
        const chainId = getChainIdFromName(chainName);

        if (chainId === null) return;

        // Store the chain we're trying to switch to
        setSwitchingChain({ id: chainId, name: chainName });

        // If the selected chain matches the current chain, just proceed with payment
        if (chain?.id === chainId) {
            if (!hasTriggeredPayment.current) {
                hasTriggeredPayment.current = true;
                onChainSelect(chainId, chainName);
                onClose();
            }
        } else {
            // Otherwise, switch the network first
            switchNetwork?.(chainId);
        }
    };

    // When network switch is complete, proceed with payment
    useEffect(() => {
        if (isSuccess && chain && switchingChain && !hasTriggeredPayment.current) {
            hasTriggeredPayment.current = true;
            onChainSelect(chain.id, chain.name);
            onClose();
        }
    }, [isSuccess, chain, switchingChain, onChainSelect, onClose]);

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
                            const isSwitching = isLoading && pendingChainId === chainId;

                            return (
                                <Button
                                    key={index}
                                    onClick={() => !isSwitching && !hasTriggeredPayment.current && handleChainSelect(network.name)}
                                    variant="outline"
                                    justifyContent="flex-start"
                                    height="60px"
                                    borderRadius="xl"
                                    borderColor="gray.700"
                                    bg={isConnected ? "gray.700" : "transparent"}
                                    _hover={{ bg: "gray.800" }}
                                    position="relative"
                                    color="white"
                                    isDisabled={isSwitching || hasTriggeredPayment.current}
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

                                        {isSwitching ? (
                                            <Text fontSize="sm" color="gray.300">Switching...</Text>
                                        ) : isConnected ? (
                                            <Box bg="green.500" px={2} py={1} borderRadius="md" fontSize="xs">
                                                Connected
                                            </Box>
                                        ) : null}
                                    </Flex>
                                </Button>
                            );
                        })}
                    </VStack>

                    {error && (
                        <Box mt={4} p={3} bg="red.900" color="red.200" borderRadius="md">
                            <Text fontWeight="bold">Error switching networks:</Text>
                            <Text>{error.message}</Text>
                            <Text mt={2} fontSize="sm">
                                Try switching networks directly in your wallet first, then selecting here.
                            </Text>
                        </Box>
                    )}

                    {chain && (
                        <Box mt={6} p={4} bg="gray.800" borderRadius="md">
                            <Text fontSize="sm">
                                Your wallet is currently connected to {chain.name}.
                                You can select a different network, but you may need to approve the network switch in your wallet.
                            </Text>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ChainSelectionInterstitial;