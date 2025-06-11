'use client';

import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Flex,
    Text,
    Box,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { chains } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { RxQuestionMarkCircled } from 'react-icons/rx';
import {
    getChainIdFromName,
    getChainInfoLinkUrlFromName,
    getChainLogoFromName,
} from '@/modules/chain-select';
import toast from 'react-hot-toast';

const ChainDropdown: React.FC = () => {
    const { chain } = useNetwork();
    const { switchNetwork, isSuccess, isLoading, pendingChainId, error } =
        useSwitchNetwork();

    // Local state to track the active chain name after switching is complete
    const [activeChainName, setActiveChainName] = React.useState(chain?.name);

    React.useEffect(() => {
        // When the network switch is complete, update the activeChainName
        if (isSuccess && chain?.name) {
            setActiveChainName(chain.name);
        }
    }, [isSuccess, chain?.name]);

    // Show error toast when network switching fails
    React.useEffect(() => {
        if (error) {
            toast.error(`Failed to switch network: ${error.message}`, {
                duration: 5000,
                position: 'bottom-right',
            });
        }
    }, [error]);

    // Determine the learn more URL based on the active chain.
    const learnMoreUrl =
        activeChainName && getChainInfoLinkUrlFromName(activeChainName)
            ? getChainInfoLinkUrlFromName(activeChainName)
            : 'https://coinmarketcap.com/academy/article/how-to-bridge-to-optimism';

    // alert(learnMoreUrl);
    return (
        <Menu placement="bottom-end">
            <MenuButton
                as={Button}
                bg="#242424"
                borderRadius="49px"
                px="16px"
                py="10px"
                color="white"
                border="none"
                _hover={{ bg: '#242424' }}
                _active={{ bg: '#242424' }}
            >
                <Flex alignItems="center" gap="8px">
                    {chain?.name && getChainLogoFromName(chain.name) && (
                        <Image
                            src={getChainLogoFromName(chain.name).src}
                            alt={`${chain.name} logo`}
                            boxSize="20px"
                            borderRadius="full"
                        />
                    )}
                    <TriangleDownIcon boxSize="14px" />
                </Flex>
            </MenuButton>

            <MenuList
                bg="#242424"
                border="none"
                boxShadow="lg"
                w="auto"
                minW="140px"
            >
                <Flex flexDirection="column" alignItems="center" p={2}>
                    <Flex mr="auto" alignItems="center" gap={3} width="100%">
                        <Text fontSize="18px" color="white" fontWeight={800}>
                            Switch Networks
                        </Text>
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
                                        only available on specific blockchains.{' '}
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
                        const chainId = getChainIdFromName(network.name);
                        return (
                            <MenuItem
                                key={index}
                                color="white"
                                bg="#242424"
                                _hover={{ bg: '#2c2c2c' }}
                                onClick={() => {
                                    if (chainId !== null) {
                                        switchNetwork?.(chainId);
                                    }
                                }}
                            >
                                {getChainLogoFromName(network.name) && (
                                    <Image
                                        src={
                                            getChainLogoFromName(network.name)
                                                .src
                                        }
                                        alt={`${network.name} logo`}
                                        width="24px"
                                        height="24px"
                                        mr="8px"
                                    />
                                )}
                                <Text flex="1">{network.name}</Text>
                                {isLoading && pendingChainId === chainId && (
                                    <Text ml="auto" fontSize="sm">
                                        Switching...
                                    </Text>
                                )}
                            </MenuItem>
                        );
                    })}
                    {error && (
                        <Box p="8px" color="red.400" fontSize="sm">
                            {error.message}
                        </Box>
                    )}
                </Flex>
            </MenuList>
        </Menu>
    );
};

export default ChainDropdown;
