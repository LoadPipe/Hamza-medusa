'use client';

import { useEffect } from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@/modules/nav/templates/nav/menu-desktop/account-menu';
import { useAccount } from 'wagmi';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import MainMenu from '../main-menu';
import WalletInfo from '../wallet-info-menu';

export const WalletConnectButton = () => {
    const setWalletAddress = useCustomerAuthStore((state) => state.setWalletAddress);
    const preferred_currency_code = useCustomerAuthStore((state) => state.preferred_currency_code);

    const account = useAccount();

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
                        {!connected ? (
                            <Button
                                borderRadius="30px"
                                backgroundColor="primary.green.900"
                                onClick={openConnectModal}
                                height="48px"
                                fontSize="16px"
                            >
                                Connect Wallet
                            </Button>
                        ) : (

                            <Flex gap="18px" flexDirection="row" alignItems="center">
                                <WalletInfo
                                    chainName={chain?.name}
                                    chain={chain}
                                    preferred_currency_code={preferred_currency_code ?? undefined}
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
