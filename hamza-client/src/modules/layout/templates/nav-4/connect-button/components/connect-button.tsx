'use client';

import { Button, Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@modules/layout/templates/nav-4/menu/account-menu';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Cart } from '@medusajs/medusa';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { SwitchNetwork } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';

//Todo: If chain unsupported?
export const WalletConnectButton = ({
    cart: cartState,
}: {
    cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
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

                const totalItems =
                    cartState?.items?.reduce((acc: any, item: any) => {
                        return acc + item.quantity;
                    }, 0) || 0;

                return (
                    <Flex>
                        <SwitchNetwork enabled={true} />
                        {connected ? (
                            <Flex
                                ml="1rem"
                                flexDirection={'row'}
                                alignItems={'center'}
                            >
                                <AccountMenu />
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
