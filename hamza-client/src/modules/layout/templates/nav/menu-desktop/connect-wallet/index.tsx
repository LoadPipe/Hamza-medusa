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
import MainMenu from '../main-menu';
import HnsDisplay from '../hns-display';

export const WalletConnectButton = () => {
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
                                    gap={3}
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                >
                                    <HnsDisplay />
                                    <button
                                        onClick={openChainModal}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background:
                                                        chain.iconBackground,
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={
                                                            chain.name ??
                                                            'Chain icon'
                                                        }
                                                        src={chain.iconUrl}
                                                        style={{
                                                            width: 44,
                                                            height: 44,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                    <MainMenu />
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
