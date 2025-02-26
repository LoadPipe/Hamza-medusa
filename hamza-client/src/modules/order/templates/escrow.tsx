'use client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MdOutlineHandshake } from 'react-icons/md';
import { OrderComponent } from '@/modules/order/components/order-overview/order-component';
import { useParams } from 'next/navigation';
import { getCustomerOrder, getHamzaCustomer } from '@/lib/server';
import { useEffect, useState } from 'react';
import { ReleaseEscrowDialog } from '../components/escrow/release-escrow-dialog';
import EscrowStatus from '../components/order-overview/escrow-status';
import { getEscrowPayment } from '@/lib/util/order-escrow';
import { Order, PaymentDefinition } from '@/web3/contracts/escrow';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ModalCoverWalletConnect } from '@/modules/common/components/modal-cover-wallet-connect';

interface EscrowProps {
    order: Order;
}
// TODO: need to get the escrow address and chain id for releasing
// TODO: user must connect the chain id that belongs to the order?
// TODO: the escrow contract is queried to make sure that the specified order exists in escrow, that it hasn’t yet been released, and that there is money to release
// TODO: API call to release escrow
// TODO: When escrow completes, api should be made to sync with the order table escrow_status
export const Escrow = ({ order }: EscrowProps) => {
    const [orderExist, setOrderExist] = useState<true | false | null>(null);

    const [escrowPaymentExist, setEscrowPaymentExist] = useState<
        true | false | null
    >(null);
    const [escrowPayment, setEscrowPayment] =
        useState<PaymentDefinition | null>(null);

    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();

    const handleSwitchNetwork = (chainId: number) => {
        if (switchChain) {
            switchChain({ chainId });
        } else {
            console.error(
                'Network switching is not supported by the current provider.'
            );
        }
    };

    const fetchCustomerAndOrder = async () => {
        try {
            // Fetch escrow payment
            const escrowPayment = await getEscrowPayment(order);
            setEscrowPaymentExist(!!escrowPayment);
            if (!escrowPayment) return;
            setEscrowPayment(escrowPayment);
        } catch (error) {
            console.error(
                'Error fetching customer, order, or escrow payment:',
                error
            );
        }
    };

    useEffect(() => {
        const paymentChainId = order.payments[0].blockchain_data.chain_id;
        if (paymentChainId !== currentChainId) {
            handleSwitchNetwork(paymentChainId);
        }
        if (paymentChainId === currentChainId) {
            fetchCustomerAndOrder();
        }
    }, [order, currentChainId]);

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

                {/* Customer and Order Status */}
                {order && (
                    <>
                        {order.id}
                        <OrderComponent order={order} />
                    </>
                )}

                {/* Escrow Payment Status */}
                {escrowPayment === null ? (
                    <Text>Escrow status loading...</Text>
                ) : orderExist === true &&
                  escrowPaymentExist === false &&
                  order ? (
                    <Text>
                        Order found for ({order.id}) but escrow payment not
                        found
                    </Text>
                ) : escrowPaymentExist === true && escrowPayment && order ? (
                    <>
                        {escrowPayment.payerReleased === false && (
                            <ReleaseEscrowDialog
                                order={order}
                                escrowPayment={escrowPayment}
                            />
                        )}
                        <EscrowStatus payment={escrowPayment} />
                    </>
                ) : null}
            </>
        </Flex>
    );
};
