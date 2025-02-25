'use client';

import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Text,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    IconButton,
} from '@chakra-ui/react';
import { useSwitchChain } from 'wagmi';
import { getChainId } from '@wagmi/core';
import { wagmiConfig } from '@/app/components/providers/rainbowkit/wagmi';
import { RxQuestionMarkCircled } from 'react-icons/rx';
import { MdClose } from 'react-icons/md'; // Import the Close Icon from react-icons
import { useState } from 'react';

import arbLogo from '@/images/chains/arbitrum-arb-logo.png';
import ethLogo from '@/images/chains/ethereum-eth-logo.png';
import optimismLogo from '@/images/chains/optimism-ethereum-op-logo.png';
import polygonLogo from '@/images/chains/polygon-matic-logo.png';
import baseLogo from '@/images/chains/base-logo-in-blue.png';
import Image, { StaticImageData } from 'next/image';

/**
 * Mapping from network names to their chain IDs.
 */
const chainNameToIdMap: Record<string, number> = {
    Sepolia: 11155111,
    'OP Mainnet': 10,
    Base: 8453,
    'Arbitrum One': 42161,
};

/**
 * Mapping from network names to their logos.
 */
const chainLogoMap: Record<string, StaticImageData> = {
    Sepolia: ethLogo,
    'OP Mainnet': optimismLogo,
    'Arbitrum One': arbLogo,
    Base: baseLogo,
    Polygon: polygonLogo, // Use this if your chains array includes "Polygon"
};

/**
 * Returns the chain ID for a given network name.
 */
const getChainIdFromName = (networkName: string): number | null => {
    return chainNameToIdMap[networkName] ?? null;
};

interface CustomChainModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomChainModal: React.FC<CustomChainModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { chains, switchChain } = useSwitchChain();
    const chainId = getChainId(wagmiConfig);
    const [loadingChainId, setLoadingChainId] = useState<number | null>(null);

    console.log('chains', chains);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'16px'}
                backgroundColor={'rgb(26, 27, 31)'}
                border={'1px'}
                borderColor={'white'}
            >
                <ModalBody width={'100%'} py="1.5rem">
                    <Flex flexDirection={'column'} alignItems={'center'}>
                        <Flex
                            mr={'auto'}
                            alignItems={'center'}
                            gap={3}
                            width={'100%'}
                        >
                            <Text
                                fontSize={'18px'}
                                color={'white'}
                                fontWeight={800}
                            >
                                Switch Networks
                            </Text>
                            {/* Popover wrapping the question mark icon */}
                            <Popover
                                trigger="hover"
                                openDelay={100}
                                closeDelay={300}
                            >
                                <PopoverTrigger>
                                    <Box cursor={'pointer'}>
                                        <RxQuestionMarkCircled color="white" />
                                    </Box>
                                </PopoverTrigger>
                                <PopoverContent
                                    width="200px"
                                    height="120px"
                                    bg="gray.700"
                                    color="white"
                                    border="none"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <PopoverArrow bg="gray.700" />
                                    <PopoverBody fontSize="12px">
                                        <>
                                            Switch networks to access different
                                            tokens, dApps, and features that are
                                            only available on specific
                                            blockchains.{' '}
                                            {/* <a
                                                href="https://example.com" // Your link here
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'cyan',
                                                    pointerEvents: 'auto', // Ensures the link is clickable
                                                }}
                                            >
                                                Learn more.
                                            </a> */}
                                        </>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>

                            {/* Close Button with Grey Circle */}
                            <IconButton
                                aria-label="Close modal"
                                icon={<MdClose />}
                                isRound
                                size="sm"
                                variant="ghost"
                                color="white"
                                ml="auto"
                                backgroundColor={'gray.600'}
                                _hover={{ backgroundColor: 'gray.600' }}
                                onClick={onClose}
                            />
                        </Flex>
                        <Text
                            color={'white'}
                            fontSize={'12px'}
                            mr={'auto'}
                            fontWeight={400}
                            mb={'0.5rem'}
                        >
                            Easily switch blockchain networks to access specific
                            tokens.
                        </Text>

                        {chains.map((chain) => (
                            <Flex
                                mt="0.5rem"
                                key={chain.id}
                                flex={1}
                                width={'100%'}
                            >
                                <Button
                                    px={'0.5rem'}
                                    width={'100%'}
                                    backgroundColor={
                                        chain.id === chainId
                                            ? 'primary.indigo.900'
                                            : 'transparent'
                                    }
                                    onClick={async () => {
                                        setLoadingChainId(chain.id);
                                        // Initiate the chain switch
                                        switchChain({ chainId: chain.id });
                                        // Wait a little for the switch to take effect before closing the modal
                                        await new Promise((resolve) =>
                                            setTimeout(resolve, 1000)
                                        );
                                        setLoadingChainId(null);
                                        onClose();
                                    }}
                                    isLoading={loadingChainId === chain.id}
                                    cursor={'pointer'}
                                    _hover={{
                                        backgroundColor:
                                            chain.id === chainId
                                                ? 'primary.indigo.900'
                                                : '#52525b',
                                    }}
                                >
                                    {chainLogoMap[chain.name] && (
                                        <Image
                                            src={chainLogoMap[chain.name]}
                                            alt={`${chain.name} logo`}
                                            width={24}
                                            height={24}
                                        />
                                    )}
                                    <Text
                                        ml="0.5rem"
                                        marginRight={'auto'}
                                        color={'white'}
                                    >
                                        {chain.name}
                                    </Text>
                                    {chain.id === chainId && (
                                        <>
                                            <Text
                                                marginLeft={'auto'}
                                                color={'white'}
                                                fontSize={'14px'}
                                            >
                                                Connected
                                            </Text>
                                            <Box
                                                ml="0.5rem"
                                                borderRadius="full"
                                                width="8px"
                                                height="8px"
                                                backgroundColor="rgb(48, 224, 0)"
                                            />
                                        </>
                                    )}
                                </Button>
                            </Flex>
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CustomChainModal;
