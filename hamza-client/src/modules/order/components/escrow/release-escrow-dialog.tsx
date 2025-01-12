"use client";
import { getEscrowPayment, releaseEscrowPayment } from '@/utils/order-escrow';
import { getWalletAddress, getChainId } from '@/web3';
import { EscrowPaymentDefinition, PaymentDefinition } from '@/web3/contracts/escrow';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
		useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Order } from '@/web3/contracts/escrow';
import { useSwitchNetwork } from 'wagmi';
import { updateOrderEscrowStatus } from '@/lib/data';
import { EscrowStatus } from '@/lib/data/enums';


export const ReleaseEscrowDialog = ({ order, escrowPayment }: { order: Order, escrowPayment: PaymentDefinition }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [isReleased, setIsReleased] = useState(false);
    const toast = useToast();
    const { switchNetwork } = useSwitchNetwork();
    
    const handleSwitchNetwork = (chainId: number) => {
        if (switchNetwork) {
            switchNetwork(chainId);
        } else {
            console.error('Network switching is not supported by the current provider.');
        }
    };

    const handleReleaseEscrow = async () => {
        setIsLoading(true);

        try {
            const chainId = await getChainId();
            const paymentChainId = order.payments[0].blockchain_data.chain_id;

            if (paymentChainId !== Number(chainId)) {
                handleSwitchNetwork(paymentChainId);
            }

            const releaseData = await releaseEscrowPayment(order, 'buyer');
            console.log("Escrow released data: ", releaseData);

            //get escrowPayment to see if escrow contract completely released
            const escrowPayment = await getEscrowPayment(order);
            console.log("Escrow payment: ", escrowPayment);

            //update the order status
            const releaseStatus = escrowPayment?.released ? EscrowStatus.RELEASED : EscrowStatus.BUYER_RELEASED;
            await updateOrderEscrowStatus(order.id, releaseStatus, {
                escrow_status: releaseStatus,
                escrow_payment: {
                    ...escrowPayment,
                    amount: escrowPayment?.amount ? escrowPayment.amount.toString() : null,
                    amountRefunded: escrowPayment?.amountRefunded ? escrowPayment.amountRefunded.toString() : null
                }
            });

            setIsReleased(true);
            setIsLoading(false);
            onClose();

            toast({
                title: "Escrow released successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
                containerStyle: {
                    marginTop: '70px',
                },
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error during escrow release:', error);
            toast({
                title: 'Error during escrow release',
                description: error instanceof Error ? error.message : 'An unknown error occurred',
                status: 'error',
            });
        }
    }

    useEffect(() => {
        if (escrowPayment.released) {
            setIsReleased(true);
        }
    }, []);

    return (
        <>
            <Button mt="2rem" colorScheme="teal" onClick={onOpen}>
                Release Escrow
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Are you sure?</ModalHeader>
                <ModalBody>
                        Check your items before releasing the escrow.
                </ModalBody>
                <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="teal"
                            ml={3}
                            onClick={() => {
                                handleReleaseEscrow();
                            }}
                            isLoading={isLoading}
                            // isDisabled={isReleased}
                        >
                            {isReleased ? "Escrow Released" : "Release"}
                        </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
