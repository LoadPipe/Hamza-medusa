'use client';

import {
    Button,
    Flex,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MobileAccountMenu from '../menu/mobile-account-menu';
import {
    getAllowedChainsFromConfig,
    getBlockchainNetworkName,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { MdOutlineWallet } from 'react-icons/md';
import { useSwitchNetwork } from 'wagmi';

export const WalletConnectButton = () => {
    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    const switchNetworkId = getAllowedChainsFromConfig()[0];
    const networkName = getBlockchainNetworkName(switchNetworkId ?? '');

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

                            if (ready && connected && chain.unsupported) {
                                openChainModal();
                            }

                            return (
                                <Flex
                                    ml="1rem"
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                >
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
