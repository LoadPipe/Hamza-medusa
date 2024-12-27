import React from 'react';
import {
    Button,
    FormControl,
    FormErrorMessage,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
} from '@chakra-ui/react';

const MIN_CANCEL_REASON_LENGTH = 30;

interface CancelOrderModalProps {
    isModalOpen: boolean;
    closeCancelModal: () => void;
    handleCancel: () => void;
    cancelReason: string;
    setCancelReason: (reason: string) => void;
    isAttemptedSubmit: boolean;
    isCanceling: boolean;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isModalOpen,
    closeCancelModal,
    handleCancel,
    cancelReason,
    setCancelReason,
    isAttemptedSubmit,
    isCanceling,
}) => {
    const getErrorMessage = (): string => {
        if (!cancelReason) {
            return 'Cancellation reason is required.';
        } else if (cancelReason.length < MIN_CANCEL_REASON_LENGTH) {
            return `Cancellation reason must be at least ${MIN_CANCEL_REASON_LENGTH} characters long.`;
        }
        return '';
    };

    console.log('CancelReason in Modal:', cancelReason);

    return (
        <Modal isOpen={isModalOpen} onClose={closeCancelModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Request Cancellation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl
                        isInvalid={
                            isAttemptedSubmit &&
                            (!cancelReason ||
                                cancelReason.length < MIN_CANCEL_REASON_LENGTH)
                        }
                    >
                        <Textarea
                            placeholder="Reason for cancellation"
                            value={cancelReason}
                            onChange={(e) => {
                                console.log(
                                    'New CancelReason Value:',
                                    e.target.value
                                );
                                setCancelReason(e.target.value);
                            }}
                        />
                        {isAttemptedSubmit && (
                            <FormErrorMessage>
                                {getErrorMessage()}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={closeCancelModal}
                        isDisabled={isCanceling}
                    >
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        ml={3}
                        onClick={handleCancel}
                        isLoading={isCanceling}
                        isDisabled={isCanceling}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CancelOrderModal;
