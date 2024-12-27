'use client';

import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Text,
    Skeleton,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@modules/layout/templates/nav/menu-desktop/account-menu';
import { useSwitchNetwork, useWalletClient, useAccount } from 'wagmi';
import {
    getAllowedChainsFromConfig,
    getBlockchainNetworkName,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useEffect, useState } from 'react';

export const WalletConnectButton = () => {
    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    //const isProduction = process.env.NODE_ENV === 'production';
    //const networkName = isProduction ? 'Optimism' : 'Sepolia';
    //const switchNetworkId = isProduction ? 10 : 11155111;
    const switchNetworkId = getAllowedChainsFromConfig()[0];
    const networkName = getBlockchainNetworkName(switchNetworkId ?? '');

    //Update zustand store with Wagmi hook when connected
    const account = useAccount();
    const { setWalletAddress } = useCustomerAuthStore();
    // useEffect to update Zustand state when the account is connected
    useEffect(() => {
        if (account?.address) {
            setWalletAddress(account.address); // Update Zustand store
        }
    }, [account?.address, setWalletAddress]);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        borderRadius={'30px'}
                                        backgroundColor={'primary.green.900'}
                                        onClick={openConnectModal}
                                        ml="1rem"
                                        height="54px"
                                        fontSize={'20px'}
                                    >
                                        Connect Wallet
                                    </Button>
                                );
                            }

                            //if (chain && chain.unsupported) {
                            if (
                                chain &&
                                chain.id != getAllowedChainsFromConfig()[0]
                            ) {
                                console.log(chain);
                                console.log('Network id is', switchNetworkId);
                                return (
                                    <Modal
                                        isOpen={true}
                                        onClose={() => {}}
                                        isCentered
                                    >
                                        <ModalOverlay />
                                        <ModalContent
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            borderRadius={'16px'}
                                            backgroundColor={'#121212'}
                                            border={'1px'}
                                            borderColor={'white'}
                                        >
                                            <ModalBody
                                                width={'100%'}
                                                py="1.5rem"
                                            >
                                                <Flex
                                                    flexDirection={'column'}
                                                    gap={'16px'}
                                                    alignItems={'center'}
                                                >
                                                    <Text
                                                        fontSize={'2rem'}
                                                        color={'white'}
                                                        fontWeight={300}
                                                    >
                                                        Unsupported Network
                                                    </Text>
                                                    <Text color={'white'}>
                                                        Hamza currently only
                                                        supports {networkName}.
                                                        Switch to {networkName}
                                                        to continue using Hamza.
                                                    </Text>
                                                    <Button
                                                        backgroundColor={
                                                            'primary.indigo.900'
                                                        }
                                                        color={'white'}
                                                        height={'38px'}
                                                        borderRadius={'full'}
                                                        width="100%"
                                                        disabled={
                                                            !switchNetwork ||
                                                            isLoading
                                                        }
                                                        _hover={{
                                                            backgroundColor:
                                                                'primary.indigo.800',
                                                            transition:
                                                                'background-color 0.3s ease-in-out',
                                                        }}
                                                        _focus={{
                                                            boxShadow: 'none',
                                                            outline: 'none',
                                                        }}
                                                        onClick={() => {
                                                            if (switchNetwork) {
                                                                switchNetwork(
                                                                    switchNetworkId
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Switch to {networkName}
                                                    </Button>
                                                </Flex>
                                                {error && (
                                                    <p>
                                                        Error: {error.message}
                                                    </p>
                                                )}
                                            </ModalBody>
                                        </ModalContent>
                                    </Modal>
                                );
                            }

                            return (
                                <Flex
                                    ml="1rem"
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                >
                                    <AccountMenu />
                                </Flex>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
