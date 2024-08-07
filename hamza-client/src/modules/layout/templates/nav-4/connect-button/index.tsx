'use client';

import { Button, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountMenu from '@modules/layout/templates/nav-4/menu/account-menu';
import { SwitchNetwork } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';

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
                    <Flex>
                        {connected ? (
                            <Flex
                                ml="1rem"
                                flexDirection={'row'}
                                alignItems={'center'}
                            >
                                <SwitchNetwork enabled={true} />
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
