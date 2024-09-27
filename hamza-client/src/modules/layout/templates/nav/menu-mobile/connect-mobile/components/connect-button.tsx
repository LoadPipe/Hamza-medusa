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
import AccountMenu from '@modules/layout/templates/nav/menu-desktop/account-menu';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Cart } from '@medusajs/medusa';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import {
    getAllowedChainsFromConfig,
    getBlockchainNetworkName,
    SwitchNetwork,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { MdOutlineWallet } from 'react-icons/md';
import { useSwitchNetwork } from 'wagmi';

//Todo: If chain unsupported?
export const WalletConnectButton = ({
    cart: cartState,
}: {
    cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    //const isProduction = process.env.NODE_ENV === 'production';
    //const networkName = isProduction ? 'Optimism' : 'Sepolia';
    //const switchNetworkId = isProduction ? 10 : 11155111;
    const switchNetworkId = getAllowedChainsFromConfig()[0];
    const networkName = getBlockchainNetworkName(switchNetworkId ?? '');

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
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

                const totalItems =
                    cartState?.items?.reduce((acc: any, item: any) => {
                        return acc + item.quantity;
                    }, 0) || 0;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
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
                                    <Flex alignSelf={'center'} ml="1rem">
                                        <LocalizedClientLink href="/cart">
                                            <Flex
                                                position="relative"
                                                width={'100%'}
                                                color="white"
                                                _hover={{
                                                    '.cart-text, .cart-icon': {
                                                        color: 'primary.green.900',
                                                    },
                                                }}
                                            >
                                                <Flex
                                                    flexDirection={'row'}
                                                    alignSelf={'center'}
                                                    color={'white'}
                                                    _hover={{
                                                        '.cart-icon': {
                                                            color: 'primary.green.900',
                                                            transition:
                                                                'color 0.3s ease-in-out',
                                                        },
                                                    }}
                                                >
                                                    <HiOutlineShoppingCart
                                                        className="cart-icon"
                                                        size={'25px'}
                                                    />
                                                </Flex>
                                                {totalItems > 0 && (
                                                    <Flex
                                                        position="absolute"
                                                        top="-4px"
                                                        right="-4px"
                                                        width="15px"
                                                        height="15px"
                                                        borderRadius="full"
                                                        backgroundColor="#EB4C60"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        fontSize="10px"
                                                        color="white"
                                                        fontWeight="700"
                                                    >
                                                        <Text fontSize={'10px'}>
                                                            {totalItems}
                                                        </Text>
                                                    </Flex>
                                                )}
                                            </Flex>
                                        </LocalizedClientLink>
                                    </Flex>
                                </Flex>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
