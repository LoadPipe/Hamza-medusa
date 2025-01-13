import { Button, Box, Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Loading from '@/app/[countryCode]/(main)/account/loading';

export const ModalCoverWalletConnect = ({ title, message, pageIsLoading }: { title: string, message: string, pageIsLoading: boolean }) => {
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
									{title}
									{!title && "Wallet Connection"}
							</Text>
							<Text
									color={'white'}
									textAlign={'center'}
							>
									{message}
									{!message && "Please connect your wallet to continue."}
							</Text>
							<ConnectButton.Custom>
									{({ openConnectModal, authenticationStatus }) => {
											if (authenticationStatus === 'unauthenticated' && pageIsLoading) {
													return (
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
													);
											} else {
													return <Loading style={{ padding: 0, margin: 0, height: '50px' }} />;
											}
									}}
							</ConnectButton.Custom>
					</Flex>
			</Box>
	);
};