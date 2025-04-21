'use client';
import React, { useState } from 'react';
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
import { useNetwork } from 'wagmi';
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
    const [selectedChain, setSelectedChain] = useState<{ id: number, name: string } | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    const handleChainSelect = (chainName: string) => {
        const chainId = getChainIdFromName(chainName);

        if (chainId === null) return;

        setIsSelecting(true);
        setSelectedChain({ id: chainId, name: chainName });
        onChainSelect(chainId, chainName);

        // Reset state after selection
        setIsSelecting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent bg="#1A1A1A" color="white" borderRadius="xl">
                <ModalHeader borderBottomWidth="1px" borderColor="gray.700">Select Payment Network</ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
                    <Text mb={4} color="white">
                        Choose which blockchain network you want to use for your payment:
                    </Text>

                    <VStack spacing={3} align="stretch">
                        {chains.map((network, index) => {
                            const chainId = getChainIdFromName(network.name);
                            const isConnected = chain?.id === chainId;
                            const isCurrentlySelected = selectedChain?.id === chainId;

                            return (
                                <Button
                                    key={index}
                                    onClick={() => !isSelecting && handleChainSelect(network.name)}
                                    variant="outline"
                                    justifyContent="flex-start"
                                    height="60px"
                                    borderRadius="xl"
                                    borderColor="gray.700"
                                    bg={isCurrentlySelected ? "gray.700" : "transparent"}
                                    _hover={{ bg: "gray.800" }}
                                    position="relative"
                                    color="white"
                                    isDisabled={isSelecting}
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

                                        {isCurrentlySelected ? (
                                            <Box bg="green.500" px={2} py={1} borderRadius="md" fontSize="xs">
                                                Selected
                                            </Box>
                                        ) : isConnected ? (
                                            <Box bg="blue.500" px={2} py={1} borderRadius="md" fontSize="xs">
                                                Connected
                                            </Box>
                                        ) : null}
                                    </Flex>
                                </Button>
                            );
                        })}
                    </VStack>

                    {chain && (
                        <Box mt={6} p={4} bg="gray.800" borderRadius="md">
                            <Text fontSize="sm">
                                Your wallet is currently connected to {chain.name}.
                                You can select any network for payment regardless of your current connection.
                            </Text>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ChainSelectionInterstitial;