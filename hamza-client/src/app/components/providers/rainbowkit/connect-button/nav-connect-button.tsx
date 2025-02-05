'use client';

import { Box, Button, Text, Flex, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress } from '@lib/util/format-address';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import AccountMenu from '@/modules/nav/templates/nav/menu-desktop/account-menu';
import CartButton from '@/modules/nav/components/cart-nav';

//Todo: If chain unsupported?
export const WalletConnectButton = () => {
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
                    authenticationStatus === 'authenticated';

                return (
                    <Flex height={'54px'}>
                        {connected ? (
                            <Flex
                                px="1rem"
                                width={'100%'}
                                flexDirection={'row'}
                            >
                                <AccountMenu />
                                <Flex ml="1rem" alignSelf={'center'}>
                                    <CartButton />
                                </Flex>
                            </Flex>
                        ) : (
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
                        )}
                    </Flex>
                );
            }}
        </ConnectButton.Custom>
    );
};
