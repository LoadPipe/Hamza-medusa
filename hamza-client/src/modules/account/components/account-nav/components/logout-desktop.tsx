'use client';
import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CiLogout } from 'react-icons/ci';
export const LogoutDesktop = () => {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal }) => {
                return (
                    <Box
                        as="button"
                        borderRadius={'8px'}
                        height={'56px'}
                        padding="16px"
                        bg="transparent"
                        color="white"
                        onClick={openAccountModal}
                    >
                        <Flex>
                            <Flex width={'26px'} height={'26px'}>
                                <CiLogout
                                    color="white"
                                    size={'24px'}
                                    style={{
                                        alignSelf: 'center',
                                        margin: '0 auto',
                                    }}
                                />
                            </Flex>

                            <Text
                                ml={2}
                                my="auto"
                                fontSize={'18px'}
                                fontWeight={600}
                            >
                                Logout
                            </Text>
                        </Flex>
                    </Box>
                );
            }}
        </ConnectButton.Custom>
    );
};
