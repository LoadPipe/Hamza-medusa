'use client';

import { useState, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@/modules/nav/templates/nav/menu-desktop/account-menu';
import { useWalletClient, useAccount } from 'wagmi';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import MainMenu from '../main-menu';
import HnsDisplay from '../hns-display';
import CurrencySelector from '../currency-selector';
import CustomChainModal from '@/modules/layout/templates/nav/components/custom-chain-modal';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

export const WalletConnectButton = () => {
    // Update zustand store with Wagmi hook when connected
    const { address, isConnecting, isReconnecting } = useAccount();
    const { setWalletAddress } = useCustomerAuthStore();

    const {
        clearFilters,
        lastAddress,
        setLastAddress,
        hasHydrated,
    } = useUnifiedFilterStore((s) => ({
        clearFilters: s.clearFilters,
        lastAddress: s.lastAddress,
        setLastAddress: s.setLastAddress,
        hasHydrated: s.hasHydrated,
    }));

    useEffect(() => {
        // 1) Do nothing until the filter store is rehydrated & Wagmi is done connecting
        if (!hasHydrated) return;
        if (isConnecting || isReconnecting) return;

        // 2) If address hasn't changed, do nothing
        if (address === lastAddress) return;

        // 3) If user logout
        if (lastAddress && !address) {

            // set the address to null before reloading
            setLastAddress(null);
            clearFilters();

            // Then reload so next time the effect runs, lastAddress is already null
            window.location.reload();
            return;
        }

        // 4) Otherwise, if user logs in (null -> new) or changes wallet (old -> new)
        if (!lastAddress && address) {
            // new login
            clearFilters();
        } else if (lastAddress && address && address !== lastAddress) {
            // switched wallets
            clearFilters();
        }

        // 5) Update lastAddress in the store
        setLastAddress(address || null);

        // 6) If there's a new address, store it in auth store
        if (address) {
            setWalletAddress(address);
        }
    }, [
        address,
        lastAddress,
        hasHydrated,
        isConnecting,
        isReconnecting,
        clearFilters,
        setLastAddress,
        setWalletAddress,
    ]);


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
