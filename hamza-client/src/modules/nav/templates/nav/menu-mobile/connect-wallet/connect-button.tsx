'use client';

import { Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MobileAccountMenu from '../menu/mobile-account-menu';
import { MdOutlineWallet } from 'react-icons/md';

export const MobileWalletConnectButton = () => {
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
                                    <Flex
                                        backgroundColor={'primary.green.900'}
                                        onClick={openConnectModal}
                                        height="24px"
                                        width="24px"
                                        borderRadius={'3px'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                    >
                                        <MdOutlineWallet />
                                    </Flex>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <Flex
                                    ml="1rem"
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                >
                                    <button
                                        onClick={openChainModal}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: '1rem',
                                        }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background:
                                                        chain.iconBackground,
                                                    width: 26,
                                                    height: 26,
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
                                                            width: 26,
                                                            height: 26,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                    <MobileAccountMenu />
                                </Flex>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
