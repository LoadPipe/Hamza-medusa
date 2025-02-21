'use client';

import { useState, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@modules/layout/templates/nav/menu-desktop/account-menu';
import { useWalletClient, useAccount } from 'wagmi';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import MainMenu from '../main-menu';
import HnsDisplay from '../hns-display';
import CurrencySelector from '../currency-selector';
import CustomChainModal from '../../components/custom-chain-modal';

export const WalletConnectButton = () => {
    // Update zustand store with Wagmi hook when connected
    const account = useAccount();
    const { setWalletAddress } = useCustomerAuthStore();

    useEffect(() => {
        if (account?.address) {
            setWalletAddress(account.address); // Update Zustand store
        }
    }, [account?.address, setWalletAddress]);

    // Local state to control CustomChainModal visibility
    const [isChainModalOpen, setChainModalOpen] = useState(false);

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
                                        borderRadius="30px"
                                        backgroundColor="primary.green.900"
                                        onClick={openConnectModal}
                                        height="48px"
                                        fontSize="16px"
                                    >
                                        Connect Wallet
                                    </Button>
                                );
                            }

                            return (
                                <Flex
                                    gap="18px"
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <CustomChainModal
                                        isOpen={isChainModalOpen}
                                        onClose={() => setChainModalOpen(false)}
                                    />
                                    <HnsDisplay />
                                    <CurrencySelector network={chain.name} />
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => setChainModalOpen(true)}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background:
                                                        chain.iconBackground,
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
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
                                                            width: 48,
                                                            height: 48,
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
