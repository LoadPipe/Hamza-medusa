'use client';
import {
    getEscrowPayment,
    releaseEscrowPayment,
} from '@/lib/util/order-escrow';
import { PaymentDefinition } from '@/web3/contracts/escrow';
import { Button, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Order } from '@/web3/contracts/escrow';
import { updateOrderEscrowStatus, releaseOrderEscrow } from '@/lib/server';
import { FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { EscrowStatus } from '@/lib/server/enums';
import GeneralModal from '../../../common/components/modal-confirm';
import { useQueryClient } from '@tanstack/react-query';

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
    const queryClient = useQueryClient();

    const handleReleaseEscrow = async () => {
        setIsLoading(true);

        try {
            //Release the escrow payment
            await releaseOrderEscrow(order.id);

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

            await queryClient.invalidateQueries({
                queryKey: ['escrowPayment', order.id],
            });

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
        }
    };

    useEffect(() => {
        if (escrowPayment.released) {
            setIsReleased(true);
        }
    }, [escrowPayment]);

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
