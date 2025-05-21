'use client';
import { Box, Flex, Text, IconButton, Button } from '@chakra-ui/react';
import { MdOutlineHandshake } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { OrderComponent } from '@/modules/order/components/order-overview/order-component';
import { useEffect, useState, useRef } from 'react';
import { ReleaseEscrowDialog } from '../components/escrow/release-escrow-dialog';
import EscrowStatus from '../components/order-overview/escrow-status';
import { Order, PaymentDefinition } from '@/web3/contracts/escrow';
import { useAccount } from 'wagmi';
import { ModalCoverWalletConnect } from '@/modules/common/components/modal-cover-wallet-connect';
import { Customer } from '@/app/[countryCode]/(main)/account/@dashboard/escrow/[id]/page';
import { useQuery } from '@tanstack/react-query';
import { getEscrowPaymentData } from '@/lib/server';
import { useRouter } from 'next/navigation';

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
    const [isClient, setIsClient] = useState<boolean>(false);
    const startTimeRef = useRef(Date.now());
    const router = useRouter();

    const {
        data: escrowPayment,
        isLoading: isLoadingEscrowPayment,
        isFetching,
    } = useQuery<PaymentDefinition | null>({
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
        enabled: !!order && isConnected,
        refetchInterval: () => {
            const elapsed = Date.now() - startTimeRef.current;
            if (elapsed > 120000) {
                return false;
            }
            return 15000;
        },
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <ModalCoverWalletConnect
                title="Proceed to Escrow"
                message="To view escrow details, please connect your wallet"
                pageIsLoading={isClient}
            />
        );
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
            position="relative"
        >
            <Button
                aria-label="Go back"
                position="absolute"
                top="16px"
                right="16px"
                onClick={() => router.push('/account/orders?tab=Refund')}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                leftIcon={<IoArrowBack />}
                size="md"
                backgroundColor="#191919"
                borderRadius="25px"
            >
                Back
            </Button>
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

                    {/* Display order details */}
                    {order && (
                        <>
                            {order.id.replace(/^order_/, '')}
                            <OrderComponent order={order} />
                        </>
                    )}

                    {/* Escrow Payment Status */}
                    {order && (
                        <>
                            {isLoadingEscrowPayment && !escrowPayment ? (
                                <Flex
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    my={4}
                                >
                                    <Text mb={3}>Setting up escrow...</Text>
                                    <Text fontSize="sm" color="whiteAlpha.700">
                                        This may take a minute while blockchain
                                        transactions confirm
                                    </Text>
                                </Flex>
                            ) : !escrowPayment && isFetching ? (
                                <Flex
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    my={4}
                                >
                                    <Text mb={3}>
                                        Checking for escrow payment...
                                    </Text>
                                    <Text fontSize="sm" color="whiteAlpha.700">
                                        Waiting for blockchain confirmation
                                    </Text>
                                </Flex>
                            ) : (
                                <>
                                    {!escrowPayment ? (
                                        <Flex
                                            direction="column"
                                            align="center"
                                            justify="center"
                                            my={4}
                                            p={5}
                                            borderWidth="1px"
                                            borderColor="whiteAlpha.300"
                                            borderRadius="md"
                                        >
                                            <Text mb={2}>
                                                Order found{' '}
                                                {order.id.replace(
                                                    /^order_/,
                                                    ''
                                                )}
                                                , waiting for escrow setup to
                                                complete
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="whiteAlpha.700"
                                            >
                                                Your payment is being processed.
                                                This may take a few moments.
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="whiteAlpha.700"
                                                mt={2}
                                            >
                                                The page will automatically
                                                update when ready.
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <>
                                            {!escrowPayment.payerReleased && (
                                                <ReleaseEscrowDialog
                                                    order={order}
                                                    escrowPayment={
                                                        escrowPayment
                                                    }
                                                />
                                            )}
                                            <EscrowStatus
                                                payment={escrowPayment}
                                            />
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
