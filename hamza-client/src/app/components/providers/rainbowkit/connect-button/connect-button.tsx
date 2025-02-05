'use client';
import { Box, Text, Flex, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress } from '@lib/util/format-address';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';

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
                // Ensure the components is ready and not in a loading state
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    authenticationStatus === 'authenticated';

                return (
                    <Flex
                        width={'100%'}
                        height={'100%'}
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
                                        width={'100%'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        gap={'8px'}
                                        backgroundColor={'primary.green.900'}
                                        onClick={openConnectModal}
                                    >
                                        <Flex alignSelf={'center'}>
                                            <MdOutlineAccountBalanceWallet
                                                size={30}
                                            />
                                        </Flex>
                                        <Text
                                            alignSelf={'center'}
                                            fontWeight={'600'}
                                            fontSize={'20px'}
                                        >
                                            Connect Wallet
                                        </Text>
                                    </Flex>
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
                                        {chain?.iconUrl && (
                                            <Image
                                                alignSelf={'center'}
                                                alt={`${chain.name ?? 'Chain'} icon`}
                                                src={chain?.iconUrl}
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
