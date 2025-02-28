'use client';
import React from 'react';
import { Flex, Text, MenuItem, Box } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CiLogout } from 'react-icons/ci';
export const LogoutMobile = () => {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal }) => {
                return (
                    <MenuItem backgroundColor={'transparent'} color="white">
                        <Box onClick={openAccountModal}>
                            <Flex>
                                <Flex width={'22px'} height={'22px'}>
                                    <CiLogout
                                        size={'20px'}
                                        style={{
                                            alignSelf: 'center',
                                            margin: '0 auto',
                                        }}
                                    />
                                </Flex>

                                <Text
                                    ml={2}
                                    my="auto"
                                    fontSize={'16px'}
                                    fontWeight={600}
                                >
                                    Logout
                                </Text>
                            </Flex>
                        </Box>
                    </MenuItem>
                );
            }}
        </ConnectButton.Custom>
    );
};
