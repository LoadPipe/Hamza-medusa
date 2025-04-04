import { Button, Box, Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Loading from '@/app/[countryCode]/(main)/account/loading';

export const ModalCoverWalletConnect = ({
    title,
    message,
    pageIsLoading,
}: {
    title: string;
    message: string;
    pageIsLoading: boolean;
}) => {
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
            px={{ base: '1rem', md: 0 }}
        >
            <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'12px'}
                gap={5}
                backgroundColor={'#121212'}
                height={{ base: 'auto', md: '400px' }}
                width={{ base: '100%', md: '500px' }}
                py={{ base: 8, md: 0 }}
            >
                <Text
                    color={'white'}
                    fontSize={{ base: '20px', md: '24px' }}
                    textAlign="center"
                    px={4}
                >
                    {title || 'Wallet Connection'}
                </Text>
                <Text
                    color={'white'}
                    textAlign={'center'}
                    px={4}
                    fontSize={{ base: '16px', md: 'inherit' }}
                >
                    {message || 'Please connect your wallet to continue.'}
                </Text>
                <ConnectButton.Custom>
                    {({ openConnectModal, authenticationStatus }) => {
                        if (
                            authenticationStatus === 'unauthenticated' &&
                            pageIsLoading
                        ) {
                            return (
                                <Button
                                    borderRadius={'30px'}
                                    backgroundColor={'primary.green.900'}
                                    onClick={openConnectModal}
                                    height={{ base: '48px', md: '54px' }}
                                    fontSize={{ base: '16px', md: '20px' }}
                                    mx={4}
                                >
                                    Connect Wallet
                                </Button>
                            );
                        } else {
                            return (
                                <Loading
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                        height: '50px',
                                    }}
                                />
                            );
                        }
                    }}
                </ConnectButton.Custom>
            </Flex>
        </Box>
    );
};
