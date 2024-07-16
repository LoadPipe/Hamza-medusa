'use client';

import { Button, Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@modules/layout/templates/nav-4/menu/account-menu';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Cart } from '@medusajs/medusa';
import { HiOutlineShoppingCart } from 'react-icons/hi';

//Todo: If chain unsupported?
export const WalletConnectButton = ({
    cart: cartState,
}: {
    cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
    console.log('Cart State:', cartState);

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
                        {connected ? (
                            <Flex
                                ml="1rem"
                                flexDirection={'row'}
                                alignItems={'center'}
                            >
                                <AccountMenu />

                                <Flex alignSelf={'center'} ml="0.75rem">
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
                                                    size={'40px'}
                                                />
                                            </Flex>
                                            {totalItems > 0 && (
                                                <Flex
                                                    position="absolute"
                                                    top="-4px"
                                                    right="-4px"
                                                    width="20px"
                                                    height="20px"
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
