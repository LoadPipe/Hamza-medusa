'use client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MdOutlineHandshake } from 'react-icons/md';
import { OrderComponent } from '@/modules/order/components/order-overview/order-component';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ReleaseEscrowDialog } from '../components/escrow/release-escrow-dialog';
import EscrowStatus from '../components/order-overview/escrow-status';
import { Order, PaymentDefinition } from '@/web3/contracts/escrow';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { ModalCoverWalletConnect } from '@/modules/common/components/modal-cover-wallet-connect';
import { Customer } from '@/app/[countryCode]/(main)/account/@dashboard/escrow/[id]/page';
import { getEscrowPayment } from '@/lib/util/order-escrow';
import { useQuery } from '@tanstack/react-query';
import { getChainId } from '@/web3';

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
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
    const { isLoading: isLoadingSwitchNetwork, switchNetwork } =
        useSwitchNetwork();

    const handleSwitchNetwork = useCallback(
        (chainId: number) => {
            try {
                if (switchNetwork) {
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
        [switchNetwork, setIsCorrectNetwork]
    );

    const { data: escrowPayment, isLoading: isLoadingEscrowPayment } = useQuery<
        PaymentDefinition | null,
        boolean
    >({
        queryKey: ['escrowPayment', id],
        queryFn: async () => {
            if (!order) return null;
            return getEscrowPayment(order);
        },
        enabled:
            !!order &&
            !isLoadingSwitchNetwork &&
            isConnected &&
            isCorrectNetwork,
    });

    useEffect(() => {
        setIsClient(true);

        const checkNetwork = async () => {
            const chainId = await getChainId();
            const paymentChainId = order
                ? order?.payments[0].blockchain_data.chain_id
                : null;

            if (paymentChainId && paymentChainId !== Number(chainId)) {
                handleSwitchNetwork(paymentChainId);
            } else {
                setIsCorrectNetwork(true);
            }
        };
        checkNetwork();
    }, [order, handleSwitchNetwork]);

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
                    {isLoadingSwitchNetwork || isLoadingEscrowPayment ? (
                        <Text>Loading...</Text>
                    ) : (
                        <>
                            {order && !escrowPayment && (
                                <Text>
                                    Order found for ({order.id}) but escrow
                                    payment not found
                                </Text>
                            )}

                            {order && escrowPayment && (
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
        </Flex>
    );
};
