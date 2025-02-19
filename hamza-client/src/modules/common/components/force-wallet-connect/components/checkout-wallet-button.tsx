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
import { useAccount } from 'wagmi';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useEffect } from 'react';
import HamzaLogoLoader from '../../../../../app/components/loaders/hamza-logo-loader';

export const CheckoutWalletButton = () => {
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

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
