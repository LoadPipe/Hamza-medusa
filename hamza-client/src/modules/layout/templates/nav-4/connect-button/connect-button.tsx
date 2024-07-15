'use client';

import { Button, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@modules/layout/templates/nav-4/menu/account-menu';
import CartButton from '../cart-button/components/cart-button';

//Todo: If chain unsupported?
export const WalletConnectButton = () => {
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
