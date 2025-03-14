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
import arbLogo from '@/images/chains/arbitrum-arb-logo.png';
import ethLogo from '@/images/chains/ethereum-eth-logo.png';
import optimismLogo from '@/images/chains/optimism-ethereum-op-logo.png';
import polygonLogo from '@/images/chains/polygon-matic-logo.png';
import baseLogo from '@/images/chains/base-logo-in-blue.png';
import { StaticImageData } from 'next/image';
import { RxQuestionMarkCircled } from 'react-icons/rx';

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
    Polygon: polygonLogo,
};

/**
 * Mapping from network names to the "Learn more" URL.
 */
const learnMoreUrlMap: Record<string, string> = {
    'Arbitrum One':
        'https://support.hamza.market/hc/1568263160/16/hamza-supports-the-arbitrum-second-layer-network?category_id=4',
    'OP Mainnet':
        'https://support.hamza.market/hc/1568263160/18/hamza-supports-the-optimism-second-layer-network?category_id=4',
    Base: 'https://support.hamza.market/hc/1568263160/17/hamza-supports-the-base-second-layer-network?category_id=4',
    Sepolia:
        'https://coinmarketcap.com/academy/article/how-to-bridge-to-optimism',
};

/**
 * Returns the chain ID for a given network name.
 */
const getChainIdFromName = (networkName: string): number | null => {
    return chainNameToIdMap[networkName] ?? null;
};

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

    // Determine the learn more URL based on the active chain.
    const learnMoreUrl =
        activeChainName && learnMoreUrlMap[activeChainName]
            ? learnMoreUrlMap[activeChainName]
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
                    {chain?.name && chainLogoMap[chain.name] && (
                        <Image
                            src={chainLogoMap[chain.name].src}
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
                                {chainLogoMap[network.name] && (
                                    <Image
                                        src={chainLogoMap[network.name].src}
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
