'use client';

import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Text,
    Box,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSwitchNetwork, useAccount } from 'wagmi';
import {
    getAllowedChainsFromConfig,
    getBlockchainNetworkName,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useEffect } from 'react';
import HamzaLogoLoader from '../../loaders/hamza-logo-loader';

export const CheckoutWalletButton = () => {
    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    //const isProduction = process.env.NODE_ENV === 'production';
    //const networkName = isProduction ? 'Optimism' : 'Sepolia';
    //const switchNetworkId = isProduction ? 10 : 11155111;
    const switchNetworkId = getAllowedChainsFromConfig()[0];
    const networkName = getBlockchainNetworkName(switchNetworkId ?? '');

    //Update zustand store with Wagmi hook when connected
    const account = useAccount();
    const { setWalletAddress } = useCustomerAuthStore();
    // useEffect to update Zustand state when the account is connected
    useEffect(() => {
        if (account?.address) {
            setWalletAddress(account.address); // Update Zustand store
        }
    }, [account?.address, setWalletAddress]);

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
                            if (connected) {
                                // Show loading spinner when loading is true
                                return (
                                    <>
                                        <HamzaLogoLoader
                                            messages={[
                                                'Charging the flux capacitor',
                                                'Running on caffeine and code',
                                                'Double-checking everything twice',
                                                'Getting things just right',
                                                'Aligning all the stars',
                                                'Calibrating awesomeness',
                                                'Fetching some digital magic',
                                                'Crossing the t’s and dotting the i’s',
                                                'Waking up the hamsters on the wheel',
                                                'Cooking up something great',
                                                'Dusting off the keyboard',
                                                'Wrangling code into shape',
                                                'Consulting the manual (just kidding)',
                                                'Building something epic',
                                                'Gearing up for greatness',
                                                'Rehearsing our victory dance',
                                                'Making sure it’s perfect for you',
                                                'Channeling good vibes into the code',
                                                'Stretching out some last-minute bugs',
                                                'Preparing the finishing touches',
                                                'Wow this is taking a long time',
                                                'Person, woman, man, camera... TV',
                                                'What’s for dinner tonight?',
                                                'Sending a message to the Mayor of Blockchain',
                                                'Contacting the blockchain',
                                                'Ein, zwei, drei',
                                                'Finalizing your purchase',
                                                'Preparing your receipt',
                                                'Nearly done',
                                                'Randomizing whimsical checkout messages',
                                                'Preparing you a glass of maple syrup',
                                                'Patience is the companion of wisdom',
                                                'Have patience with all things but first of all with yourself',
                                                'It’s nice to be able to buy normal stuff with crypto',
                                                'Hamza was born in 2024',
                                                'Reordering the punch-cards',
                                                'Hacking the Gibson',
                                                'Beuller.... Beuller',
                                                'Waking up and choosing crypto',
                                                'Let there be light',
                                                'dot dot dot',
                                            ]}
                                        />
                                    </>
                                );
                            }

                            if (!connected) {
                                return (
                                    <Box
                                        position="fixed"
                                        top="0"
                                        left="0"
                                        width="100vw"
                                        height="100vh"
                                        zIndex="9999"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        backgroundColor="#040404"
                                        color={'white'}
                                        flexDirection={'column'}
                                    >
                                        <Flex
                                            flexDir={'column'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            borderRadius={'12px'}
                                            gap={5}
                                            backgroundColor={'#121212'}
                                            height={'400px'}
                                            width={'500px'}
                                        >
                                            <Text
                                                color={'white'}
                                                fontSize={'24px'}
                                            >
                                                Proceed to Checkout
                                            </Text>
                                            <Text
                                                color={'white'}
                                                textAlign={'center'}
                                            >
                                                To continue checking out please
                                                connect your wallet
                                            </Text>
                                            <Button
                                                borderRadius={'30px'}
                                                backgroundColor={
                                                    'primary.green.900'
                                                }
                                                onClick={openConnectModal}
                                                ml="1rem"
                                                height="54px"
                                                fontSize={'20px'}
                                            >
                                                Connect Wallet
                                            </Button>
                                        </Flex>
                                    </Box>
                                );
                            }

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

                            return null;
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
