'use client';

import { useEffect } from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@/modules/nav/templates/nav/menu-desktop/account-menu';
import { useAccount } from 'wagmi';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import MainMenu from '../main-menu';
import WalletInfo from '../wallet-info-menu';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';
import { usePathname } from 'next/navigation';

export const WalletConnectButton = () => {
    const setWalletAddress = useCustomerAuthStore(
        (state) => state.setWalletAddress
    );
    const { setCustomerAuthData } = useCustomerAuthStore();
    const preferred_currency_code = useCustomerAuthStore(
        (state) => state.preferred_currency_code
    );
    const { address, isConnecting, isReconnecting } = useAccount();
    const pathname = usePathname();

    const account = useAccount();

    const { clearFilters, lastAddress, setLastAddress, hasHydrated } =
        useUnifiedFilterStore((s) => ({
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

                //if we're on order processing page, don't show any of this stuff
                if (pathname.includes('/order/processing/cart_')) {
                    return <></>;
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
                        {!connected ? (
                            <Button
                                borderRadius="30px"
                                backgroundColor="primary.green.900"
                                onClick={() => {
                                    setCustomerAuthData({
                                        wallet_address: '',
                                        customer_id: '',
                                        anonymous: false,
                                        is_verified: false,
                                        token: '',
                                        status: 'unauthenticated',
                                    });
                                    openConnectModal();
                                }}
                                height="48px"
                                fontSize="16px"
                            >
                                Connect Wallet A
                            </Button>
                        ) : (
                            <Flex
                                gap="18px"
                                flexDirection="row"
                                alignItems="center"
                            >
                                <WalletInfo
                                    chainName={chain?.name}
                                    chain={chain}
                                    preferred_currency_code={
                                        preferred_currency_code ?? undefined
                                    }
                                />

                                <MainMenu />
                                <AccountMenu />
                            </Flex>
                        )}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
