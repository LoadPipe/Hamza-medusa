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
