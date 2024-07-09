'use client';
import { Box, Button, Text, Flex, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress } from '@lib/util/format-address';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { Sora } from '@next/font/google';

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '700'],
});
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
                // Ensure the component is ready and not in a loading state
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    authenticationStatus === 'authenticated';

                return (
                    <Flex
                        height={'54px'}
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
                                    <Button
                                        fontFamily={sora.style.fontFamily}
                                        borderRadius={'30px'}
                                        backgroundColor={'primary.green.900'}
                                        onClick={openConnectModal}
                                        ml="1rem"
                                        height="54px"
                                        fontSize={'20px'}
                                    >
                                        Connect Wallet
                                    </Button>
                                );
                            }
                            if (chain && chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                    ></button>
                                );
                            }
                            return (
                                <Flex
                                    px="1rem"
                                    width={'100%'}
                                    flexDirection={'row'}
                                >
                                    <Box
                                        mr="0.5rem"
                                        w="2.5rem"
                                        h="2.5rem"
                                        display={'flex'}
                                        justifyContent={'center'}
                                        borderRadius={'50%'}
                                        alignSelf={'center'}
                                        backgroundColor={'#2C272D'}
                                    >
                                        {chain.iconUrl && (
                                            <Image
                                                alignSelf={'center'}
                                                alt={`${chain.name ?? 'Chain'} icon`}
                                                src={chain.iconUrl}
                                            />
                                        )}
                                    </Box>
                                    <Flex
                                        flex={1}
                                        borderRadius={'0px'}
                                        backgroundColor={'#2C272D'}
                                        onClick={openAccountModal}
                                        style={{
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <Text
                                            as="p"
                                            alignSelf={'center'}
                                            textStyle="h2"
                                            color="#8C8C8C"
                                        >
                                            {formatAddress(account.address)}
                                        </Text>
                                        <Text
                                            alignSelf={'center'}
                                            ml="auto"
                                            fontSize={'40px'}
                                            color="primary.green.900"
                                        >
                                            &#x2022;
                                        </Text>
                                    </Flex>
                                </Flex>
                            );
                        })()}
                    </Flex>
                );
            }}
        </ConnectButton.Custom>
    );
};
