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
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import { chains } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import {
    getChainIdFromName,
    getChainLogoFromName,
} from '@/modules/chain-select';

const ChainDropdown: React.FC = () => {
    const { chain } = useNetwork();
    const { switchNetwork, isLoading, pendingChainId, error } =
        useSwitchNetwork();

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
                                    src={getChainLogoFromName(network.name).src}
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
