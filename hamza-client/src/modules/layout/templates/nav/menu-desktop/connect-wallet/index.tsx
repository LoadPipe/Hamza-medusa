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

                if (ready && connected && chain.unsupported) {
                    openChainModal();
                }

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
