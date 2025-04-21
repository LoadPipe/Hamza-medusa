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

import { RxQuestionMarkCircled } from 'react-icons/rx';
import { MdClose } from 'react-icons/md';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import { chains } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import Image, { StaticImageData } from 'next/image';
import {
    getChainIdFromName,
    getChainInfoLinkUrlFromName,
    getChainLogoFromName,
} from '@/modules/chain-select';

interface CustomChainModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomChainModal: React.FC<CustomChainModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { chain } = useNetwork();
    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    // Determine the learn more URL based on the active chain.
    const learnMoreUrl =
        chain && getChainInfoLinkUrlFromName(chain.name)
            ? getChainInfoLinkUrlFromName(chain.name)
            : 'https://coinmarketcap.com/academy/article/how-to-bridge-to-optimism';

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                justifyContent="center"
                alignItems="center"
                borderRadius="16px"
                backgroundColor="rgb(26, 27, 31)"
                border="1px"
                borderColor="white"
            >
                <ModalBody width="100%" py="1.5rem">
                    <Flex flexDirection="column" alignItems="center">
                        <Flex
                            mr="auto"
                            alignItems="center"
                            gap={3}
                            width="100%"
                        >
                            <Text
                                fontSize="18px"
                                color="white"
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
                                    <Box cursor="pointer">
                                        <RxQuestionMarkCircled color="white" />
                                    </Box>
                                </PopoverTrigger>
                                <PopoverContent
                                    width="200px"
                                    height="120px"
                                    bg="gray.700"
                                    color="white"
                                    border="none"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <PopoverArrow bg="gray.700" />
                                    <PopoverBody fontSize="12px">
                                        <>
                                            Switch networks to access different
                                            tokens, dApps, and features that are
                                            only available on specific
                                            blockchains.{' '}
                                            <a
                                                href={learnMoreUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'cyan',
                                                    pointerEvents: 'auto',
                                                }}
                                            >
                                                Learn more.
                                            </a>
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
                                backgroundColor="gray.600"
                                _hover={{ backgroundColor: 'gray.600' }}
                                onClick={onClose}
                            />
                        </Flex>
                        <Text
                            color="white"
                            fontSize="12px"
                            mr="auto"
                            fontWeight={400}
                            mb="0.5rem"
                        >
                            Easily switch blockchain networks to access specific
                            tokens.
                        </Text>

                        {chains.map((network, index) => {
                            // network is assumed to be an object with a .name property
                            const chainId = getChainIdFromName(network.name);
                            return (
                                <Flex
                                    mt="0.5rem"
                                    key={index}
                                    flex={1}
                                    width="100%"
                                >
                                    <Button
                                        px={'0.5rem'}
                                        width="100%"
                                        onClick={async () => {
                                            if (chainId !== null) {
                                                // Optionally, you might want to handle errors separately if needed.
                                                switchNetwork?.(chainId);

                                                // Wait for 2 seconds before closing
                                                await new Promise((resolve) =>
                                                    setTimeout(resolve, 1000)
                                                );
                                                onClose();
                                            }
                                        }}
                                        backgroundColor={
                                            chain?.id === chainId
                                                ? 'primary.indigo.900'
                                                : 'transparent'
                                        }
                                        isLoading={
                                            isLoading &&
                                            pendingChainId === chainId
                                        }
                                        _hover={{
                                            backgroundColor:
                                                chain?.id === chainId
                                                    ? 'primary.indigo.900'
                                                    : '#52525b',
                                        }}
                                    >
                                        {getChainLogoFromName(network.name) && (
                                            <Image
                                                src={getChainLogoFromName(
                                                    network.name
                                                )}
                                                alt={`${network.name} logo`}
                                                width={24}
                                                height={24}
                                            />
                                        )}
                                        <Text
                                            ml="0.5rem"
                                            marginRight="auto"
                                            color="white"
                                        >
                                            {network.name}
                                        </Text>
                                        {chain?.id === chainId && (
                                            <Flex marginLeft="auto">
                                                <Text
                                                    marginLeft="auto"
                                                    color="white"
                                                    fontSize="14px"
                                                >
                                                    Connected
                                                </Text>
                                                <Box
                                                    alignSelf="center"
                                                    ml="0.5rem"
                                                    borderRadius="full"
                                                    width="8px"
                                                    height="8px"
                                                    backgroundColor="rgb(48, 224, 0)"
                                                />
                                            </Flex>
                                        )}
                                    </Button>
                                </Flex>
                            );
                        })}

                        {error && (
                            <Text color="red.400" mt="0.5rem">
                                {error.message}
                            </Text>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CustomChainModal;
