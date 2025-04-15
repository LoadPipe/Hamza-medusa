'use client';
import {
    Box,
    Flex,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    ModalCloseButton,
} from '@chakra-ui/react';
import { MdOutlineHandshake } from 'react-icons/md';
import { OrderComponent } from '@/modules/order/components/order-overview/order-component';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ReleaseEscrowDialog } from '../components/escrow/release-escrow-dialog';
import EscrowStatus from '../components/order-overview/escrow-status';
import { Order, PaymentDefinition } from '@/web3/contracts/escrow';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ModalCoverWalletConnect } from '@/modules/common/components/modal-cover-wallet-connect';
import { Customer } from '@/app/[countryCode]/(main)/account/@dashboard/escrow/[id]/page';
import { getEscrowPayment } from '@/lib/util/order-escrow';
import { useQuery } from '@tanstack/react-query';
import { getChainId } from '@/web3';
import { getEscrowPaymentData } from '@/lib/server';

// TODO: need to get the escrow address and chain id for releasing
// TODO: user must connect the chain id that belongs to the order?
// TODO: the escrow contract is queried to make sure that the specified order exists in escrow, that it hasn't yet been released, and that there is money to release
// TODO: API call to release escrow
// TODO: When escrow completes, api should be made to sync with the order table escrow_status
export const Escrow = ({
    id,
    customer,
    order,
}: {
    id: string;
    customer: Customer | {};
    order: Order | null;
}) => {
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
    const [currentChainName, setCurrentChainName] = useState<string | null>(
        null
    );
    const [paymentChainName, setPaymentChainName] = useState<string | null>(
        null
    );
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        chains,
        isLoading: isLoadingSwitchNetwork,
        switchNetwork,
    } = useSwitchNetwork();

    const handleSwitchNetwork = useCallback(
        (chainId: number) => {
            try {
                if (switchNetwork) {
                    onOpen();
                    switchNetwork(chainId);
                    setIsCorrectNetwork(true);
                } else {
                    setIsCorrectNetwork(false);
                    console.error(
                        'Network switching is not supported by the current provider.'
                    );
                }
            } catch (error) {
                console.error(error);
                setIsCorrectNetwork(false);
            }
        },
        [switchNetwork, setIsCorrectNetwork, onOpen]
    );

    const startTimeRef = useRef(Date.now());
    
    const { data: escrowPayment, isLoading: isLoadingEscrowPayment, isFetching } = useQuery<
        PaymentDefinition | null
    >({
        queryKey: ['escrowPayment', id],
        queryFn: async () => {
            if (!order) return null;

            try {
                const result = await getEscrowPaymentData(order.id);

                return result;
            } catch (error) {
                console.error('Error fetching escrow payment:', error);
                return null;
            }
        },
        enabled:
            !!order &&
            !isLoadingSwitchNetwork &&
            isConnected &&
            isCorrectNetwork,
        refetchInterval: () => {
            const elapsed = Date.now() - startTimeRef.current;
            if (elapsed > 120000) {
                return false; 
            }
            return 15000; 
        },
    });

    // TODO: right now, when switching chain on the same page, the
    // name saved for currentChain is chain that the user is originally on.
    // but since the user is switching the intended name to be saved is the
    // chain being switched to.  This is a problem.  Leave this for future
    // as the system works, but the alert will simply say switching from
    // sepolia to sepolia instead of telling the user that the system is
    // auto switching them back to sepolia from ... opnet for example.
    useEffect(() => {
        setIsClient(true);

        // chain was added to detect chain switching on the page
        // itself.  As a result, I need to keep the chain name before
        // switching occurs, so it can be used in the modal.
        if (chain && !currentChainName) {
            setCurrentChainName(chain.name || null);
        }

        (async () => {
            const chainId = await getChainId();
            const paymentChainId =
                order?.payments[0]?.blockchain_data?.chain_id;

            const currentChain = chains.find(
                (chain) => Number(chain.id) === Number(chainId)
            );
            const paymentChain = chains.find(
                (chain) => Number(chain.id) === Number(paymentChainId)
            );

            if (!isLoadingSwitchNetwork) {
                if (!currentChainName) {
                    setCurrentChainName(currentChain?.name || null);
                }
                if (!paymentChainName) {
                    setPaymentChainName(paymentChain?.name || null);
                }
            }

            if (paymentChainId && paymentChainId !== Number(chainId)) {
                handleSwitchNetwork(paymentChainId);
            } else {
                setIsCorrectNetwork(true);
            }
        })();
    }, [
        order,
        handleSwitchNetwork,
        isLoadingSwitchNetwork,
        chains,
        chain,
        currentChainName,
        paymentChainName,
    ]);

    const NetworkSwitchModal = (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                bg="#121212"
                p="40px"
                borderRadius={'16px'}
                justifyContent={'center'}
                alignItems={'center'}
                color="white"
                gap={2}
                maxW={'496px'}
                width={'100%'}
            >
                <ModalCloseButton color="white" />
                <ModalBody
                    display="flex"
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDir={'column'}
                >
                    <ModalHeader
                        fontSize="24px"
                        fontWeight="bold"
                        textAlign={'center'}
                    >
                        Switching Network
                    </ModalHeader>
                    <Text
                        fontSize="16px"
                        maxW={'332px'}
                        width={'100%'}
                        textAlign={'center'}
                    >
                        Since your payment is on{' '}
                        <strong className="text-[#94d42a]">
                            [{paymentChainName}]
                        </strong>{' '}
                        and your wallet is on{' '}
                        <strong className="text-[#94d42a]">
                            [{currentChainName}]
                        </strong>
                        , we must switch networks to proceed.
                    </Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );

    if (!isClient) {
        return (
            <ModalCoverWalletConnect
                title="Proceed to Escrow"
                message="To view escrow details, please connect your wallet"
                pageIsLoading={isClient}
            />
        ); // Render nothing on the server
    }

    return (
        <Flex
            flexDir={'column'}
            width={'100%'}
            maxW={'800px'}
            mt="3rem"
            mb="5rem"
            mx="auto"
            p={{ base: '16px', md: '40px' }}
            borderRadius={'16px'}
            color="white"
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'#121212'}
        >
            {NetworkSwitchModal}
            {!isConnected ? (
                <ModalCoverWalletConnect
                    title="Proceed to Escrow"
                    message="To view escrow details, please connect your wallet"
                    pageIsLoading={isClient}
                />
            ) : (
                <>
                    <Box
                        color="primary.green.900"
                        mb="1rem"
                        fontSize={{ base: '40px', md: '72px' }}
                    >
                        <MdOutlineHandshake />
                    </Box>
                    <Text fontSize={'24px'} fontWeight={700}>
                        Escrow
                    </Text>

                    {/* Customer and Order problems */}
                    {Object.keys(customer).length === 0 && (
                        <Text>Customer not found</Text>
                    )}

                    {!order && <Text>Order not found</Text>}

                    {Object.keys(customer).length > 0 && !order && (
                        <Text>
                            The order ({id}) does not belong to this customer
                        </Text>
                    )}

                    {/* Customer and Order problems */}
                    {order && (
                        <>
                            {order.id}
                            <OrderComponent order={order} />
                        </>
                    )}

                    {/* Escrow Payment Status */}
                    {order && (
                        <>
                            {(isLoadingEscrowPayment || isLoadingSwitchNetwork) && !escrowPayment ? (
                                <Flex direction="column" align="center" justify="center" my={4}>
                                    <Text mb={3}>Setting up escrow...</Text>
                                    <Text fontSize="sm" color="whiteAlpha.700">
                                        This may take a minute while blockchain transactions confirm
                                    </Text>
                                </Flex>
                            ) : !escrowPayment && isFetching ? (
                                <Flex direction="column" align="center" justify="center" my={4}>
                                    <Text mb={3}>Checking for escrow payment...</Text>
                                    <Text fontSize="sm" color="whiteAlpha.700">
                                        Waiting for blockchain confirmation
                                    </Text>
                                </Flex>
                            ) : (
                                <>
                                    {!escrowPayment ? (
                                        <Flex direction="column" align="center" justify="center" my={4} p={5}
                                            borderWidth="1px" borderColor="whiteAlpha.300" borderRadius="md">
                                            <Text mb={2}>
                                                Order found ({order.id}), waiting for escrow setup to complete
                                            </Text>
                                            <Text fontSize="sm" color="whiteAlpha.700">
                                                Your payment is being processed. This may take a few moments.
                                            </Text>
                                            <Text fontSize="sm" color="whiteAlpha.700" mt={2}>
                                                The page will automatically update when ready.
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <>
                                            {!escrowPayment.payerReleased && (
                                                <ReleaseEscrowDialog
                                                    order={order}
                                                    escrowPayment={escrowPayment}
                                                />
                                            )}
                                            <EscrowStatus payment={escrowPayment} />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </Flex>
    );
};
