'use client';
import React from 'react';
import { Flex, Text, MenuItem, Box, Image } from '@chakra-ui/react';
import { formatAddress } from '@lib/util/format-address';
import { ConnectButton } from '@rainbow-me/rainbowkit';
export const AuthorizedAccount = () => {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal }) => {
                return (
                    <MenuItem
                        p="0"
                        // borderTopWidth={'2px'}
                        borderBottomRadius={'15px'}
                        // borderColor="rgba(255, 255, 255, 0.5)"
                        height={'91px'}
                        backgroundColor={'#2C272D'}
                        alignItems={'center'}
                        onClick={openAccountModal}
                    >
                        <Box
                            ml="1.25rem"
                            display={'flex'}
                            justifyContent={'center'}
                            alignSelf={'center'}
                        >
                            {chain?.iconUrl && (
                                <Image
                                    alignSelf={'center'}
                                    alt={`${chain.name ?? 'Chain'} icon`}
                                    src={chain.iconUrl}
                                />
                            )}
                        </Box>

                        <Text ml="1rem" alignSelf={'center'} color="#8C8C8C">
                            {formatAddress(account?.address ?? '')}
                        </Text>

                        <Box
                            alignSelf={'center'}
                            ml="auto"
                            mr="1rem"
                            width={'10px'}
                            height={'10px'}
                            borderRadius={'full'}
                            color="primary.green.900"
                            backgroundColor={'green'}
                        ></Box>
                    </MenuItem>
                );
            }}
        </ConnectButton.Custom>
    );
};
