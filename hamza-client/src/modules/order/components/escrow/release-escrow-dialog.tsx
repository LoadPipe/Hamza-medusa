'use client';
import {
    getEscrowPayment,
    releaseEscrowPayment,
} from '@/lib/util/order-escrow';
import { getChainId } from '@/web3';
import { PaymentDefinition } from '@/web3/contracts/escrow';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    useToast,
    Flex,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Order } from '@/web3/contracts/escrow';
import { useSwitchNetwork } from 'wagmi';
import { updateOrderEscrowStatus } from '@/lib/server';
import { FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { EscrowStatus } from '@/lib/server/enums';
import GeneralModal from '../../../common/components/modal-confirm';

class CustomError extends Error {
    info?: any;

    constructor(message?: string, info?: any) {
        super(message);
        this.name = 'CustomError';
        this.info = info;
    }
}

export const ReleaseEscrowDialog = ({
    order,
    escrowPayment,
}: {
    order: Order;
    escrowPayment: PaymentDefinition;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReleased, setIsReleased] = useState(false);
    const toast = useToast();
    const { switchNetwork } = useSwitchNetwork();

    const handleSwitchNetwork = (chainId: number) => {
        if (switchNetwork) {
            switchNetwork(chainId);
        } else {
            console.error(
                'Network switching is not supported by the current provider.'
            );
        }
    };

    const handleReleaseEscrow = async () => {
        setIsLoading(true);

        try {
            const releaseData = await releaseEscrowPayment(order, 'buyer');
            console.log('Escrow released data: ', releaseData);

            //get escrowPayment to see if escrow contract completely released
            const escrowPayment = await getEscrowPayment(order);
            console.log('Escrow payment: ', escrowPayment);

            //update the order status
            const releaseStatus = escrowPayment?.released
                ? EscrowStatus.RELEASED
                : EscrowStatus.BUYER_RELEASED;
            await updateOrderEscrowStatus(order.id, releaseStatus, {
                escrow_status: releaseStatus,
                escrow_payment: {
                    ...escrowPayment,
                    amount: escrowPayment?.amount
                        ? escrowPayment.amount.toString()
                        : null,
                    amountRefunded: escrowPayment?.amountRefunded
                        ? escrowPayment.amountRefunded.toString()
                        : null,
                },
            });

            setIsReleased(true);
            setIsLoading(false);
            onClose();

            toast({
                title: 'Escrow released successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
                containerStyle: {
                    marginTop: '70px',
                },
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error during escrow release:', error);

            const message =
                error instanceof CustomError
                    ? error.info?.error?.message || error.message
                    : 'An unknown error occurred';
            setErrorMessage(message);

            // toast({
            //     title: 'Error during escrow release',
            //     description: message,
            //     status: 'error',
            // });
        }
    };

    useEffect(() => {
        if (escrowPayment.released) {
            setIsReleased(true);
        }
    }, [escrowPayment]);

    useEffect(() => {
        const checkNetwork = async () => {
            const chainId = await getChainId();
            const paymentChainId = order.payments[0].blockchain_data.chain_id;

            if (paymentChainId !== Number(chainId)) {
                handleSwitchNetwork(paymentChainId);
            }
        };
        checkNetwork();
    }, [order]);

    return (
        <>
            <Button mt="2rem" colorScheme="teal" onClick={onOpen}>
                Release Escrow
            </Button>

            <GeneralModal
                eventStatus={{ isLoading, isReleased }}
                isOpen={isOpen}
                onClose={onClose}
                title="Are you sure?"
                message="Please make sure you have received all your items, and have checked to make sure they are in good condition. Once you confirm, your crypto will be released to the seller."
                icon={<FaQuestionCircle size={72} color="#94D42A" />}
                leftButton={{
                    text: 'Cancel',
                    function: onClose,
                }}
                rightButton={{
                    text: isReleased ? 'Escrow Released' : 'Release Now',
                    function: handleReleaseEscrow,
                }}
            />

            <GeneralModal
                isOpen={!!errorMessage}
                onClose={() => {
                    setErrorMessage(null);
                    onClose();
                }}
                title="Error"
                message={errorMessage || ''}
                icon={<FaExclamationTriangle size={72} color="#FF4500" />}
                rightButton={{
                    text: 'Close',
                    function: () => {
                        setErrorMessage(null);
                        onClose();
                    },
                }}
            />
        </>
    );
};
