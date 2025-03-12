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
    Image
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
 * Returns the chain ID for a given network name.
 */
const getChainIdFromName = (networkName: string): number | null => {
    return chainNameToIdMap[networkName] ?? null;
};

const ChainDropdown: React.FC = () => {
    const { chain } = useNetwork();
    const { switchNetwork, isLoading, pendingChainId, error } = useSwitchNetwork();

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

            <MenuList bg="#242424" border="none" boxShadow="lg" w="auto" minW="140px">
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
            </MenuList>
        </Menu>
    );
};

export default ChainDropdown;
